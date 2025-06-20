import "../effect/effect";

const reservedObjKeys = [
  "constructor",
  "__proto__",
  "prototype",
  "toString",
  "valueOf",
  "hasOwnProperty",
  "isPrototypeOf",
  "propertyIsEnumerable",
];
class Type {
  static activeTypes = {};
  static _StaticType = null;
  static _staticTypeInstance = null;

  constructor(initFn = () => ({}), ...superClasses) {
    this.initObj = typeof initFn === "function" ? initFn() : initFn;
    this.superClasses = superClasses;
    this.effects = new Set();

    // PARSE SPECIAL KEYS
    this.typeTarget = Array.isArray(this.initObj) ? [] : {};
    this.finals = {};
    this.getters = {};
    this.setters = {};
    this.deleters = {};
    this.memos = {};
    this.statics = {};
    {
      for (const key in this.initObj)
        if (key.startsWith(`$final_`)) {
          const fieldName = key.split("_").slice(1).join("_");
          this.finals[fieldName] = this.initObj[key];
        }
      for (const key in this.initObj) {
        const fieldName = key.split("_").slice(1).join("_");

        if (key.startsWith("$static_")) {
          this.statics[fieldName] = this.initObj[key];
          continue;
        }

        const isFinal = key in this.finals;
        if (isFinal) continue;

        if (key.startsWith("$get_"))
          this.getters[fieldName] = this.initObj[key];
        else if (key.startsWith("$set_"))
          this.setters[fieldName] = this.initObj[key];
        else if (key.startsWith("$delete_"))
          this.deleters[fieldName] = this.initObj[key];
        else if (key.startsWith("$memo_"))
          this.memos[fieldName] = this.initObj[key];
      }
      for (const key in this.initObj)
        if (!key.startsWith(`$`)) this.typeTarget[key] = this.initObj[key];
    }
  }

  New(instanceInitObj = {}) {
    const type = this;

    let isRunningInternalCode = false;
    const activeAccessorStack = [];
    const runInternalCode = (internalCode, key, accessor = "get") => {
      activeAccessorStack.push({ key, accessor });
      if (internalCode instanceof (async () => {}).constructor)
        return async function (...args) {
          isRunningInternalCode = true;

          try {
            const result = await internalCode(proxy, ...args);
            return result;
          } catch (e) {
            throw e;
          } finally {
            isRunningInternalCode = false;
            activeAccessorStack.pop();
          }
        };
      else
        return function (...args) {
          isRunningInternalCode = true;
          try {
            const result = internalCode(proxy, ...args);
            return result;
          } catch (e) {
            throw e;
          } finally {
            isRunningInternalCode = false;
            activeAccessorStack.pop();
          }
        };
    };
    const isRunningAccessor = (accessor, key) => {
      if (!activeAccessorStack.length) return false;

      const active = activeAccessorStack.at(-1);
      return active.key === key && active.accessor === accessor;
    };

    const METHOD_REGEX = /^_?[A-Z]/;

    const effects = {};
    const memoedValues = {};

    const instanceTarget = Array.isArray(this.typeTarget)
      ? [...this.typeTarget]
      : { ...this.typeTarget };
    const proxy = new Proxy(instanceTarget, {
      get(target, key) {
        if (typeof key === "symbol") return target[key];
        if (reservedObjKeys.includes(key)) return target[key];

        if (Effect.activeEffect) {
          if (!effects[key]) effects[key] = new Set();
          if (effects[key] instanceof Set)
            effects[key].add(Effect.activeEffect);

          const activeEffectCache = Effect.activeEffect;
          Effect.activeEffect.unsubCallbacks.add(() => {
            effects[key].delete(activeEffectCache);
          });
        }

        const isMemoed = Object.hasOwn(type.memos, key);
        if (isMemoed) {
          if (!memoedValues[key]) {
            memoedValues[key] = type.memos[key](proxy);
            new Effect(() => {
              memoedValues[key] = type.memos[key](proxy);
            });
          }
          return Reflect.get(memoedValues, key);
        }

        const hasGetter = Object.hasOwn(type.getters, key);
        if (hasGetter)
          if (isRunningInternalCode && isRunningAccessor("get", key))
            return target[key];
          else return runInternalCode(type.getters[key], key, "get")();

        const isPrivateField = key.startsWith(`_`);
        if (isPrivateField && !isRunningInternalCode)
          throw new ReferenceError(`private field ${key} cannot be accessed.`);

        const isFinalField = key in type.finals;
        if (isFinalField) return Reflect.get(type.finals, key);

        const isMethod =
          typeof target[key] === "function" && key.match(METHOD_REGEX);
        if (isMethod) return runInternalCode(target[key], key, "get");

        return Reflect.get(target, key);
      },
      set(target, key, value) {
        if (typeof key === "symbol") return (target[key] = value);
        if (reservedObjKeys.includes(key)) return (target[key] = value);

        const isUnchangedPrimitive =
          !Array.isArray(instanceTarget) && target[key] === value;
        const isUnchangedFn =
          typeof target[key] === `function` &&
          typeof value === "function" &&
          target[key].toString() === value.toString();
        if (isUnchangedPrimitive || isUnchangedFn) return true;

        const hasSetter = Object.hasOwn(type.setters, key);
        if (hasSetter)
          if (isRunningInternalCode && isRunningAccessor("set", key))
            return Reflect.set(target, key, value);
          else {
            runInternalCode(type.setters[key], key, "set")(value);
            return true;
          }

        const isPrivateField = key.startsWith(`_`);
        if (isPrivateField && !isRunningInternalCode)
          throw new ReferenceError(`private field ${key} cannot be set.`);

        const isFinalField = key in type.finals;
        if (isFinalField)
          throw new ReferenceError(`final field ${key} cannot be set.`);

        const isMethod =
          typeof target[key] === "function" && key.match(METHOD_REGEX);
        if (isMethod) throw new ReferenceError(`method ${key} cannot be set.`);

        Reflect.set(target, key, value);

        if (effects[key]) effects[key].forEach((effect) => effect.run());
        // Object.keys(effects).forEach((key) =>
        //   effects[key].forEach((effect) => effect.run())
        // );

        return true;
      },
      deleteProperty(target, key) {
        if (typeof key === "symbol") return target[key];

        // Effects
        Object.keys(effects).forEach((key) =>
          effects[key].forEach((effect) => effect.run())
        );

        const hasDeleter = Object.hasOwn(type.deleters, key);
        if (hasDeleter) {
          if (isRunningInternalCode && isRunningAccessor("delete", key))
            return Reflect.deleteProperty(target, key);
          else {
            runInternalCode(type.deleters[key], key, "delete")();
            return true;
          }
        }

        const isPrivateField = key.startsWith(`_`);
        if (isPrivateField && !isRunningInternalCode)
          throw new ReferenceError(`private field ${key} cannot be deleted.`);

        const isFinalField = key in type.finals;
        if (isFinalField)
          throw new ReferenceError(`final field ${key} cannot be deleted.`);

        const isMethod =
          typeof target[key] === "function" && key.match(METHOD_REGEX);
        if (isMethod) {
          throw new ReferenceError(`method ${key} cannot be deleted.`);
        }
        return Reflect.deleteProperty(target, key);
      },
      ownKeys(target) {
        let keys = Reflect.ownKeys(target).filter(
          (key) => !key.startsWith("_")
        );
        keys.push(...Object.keys(type.getters));
        return keys;
      },
      getOwnPropertyDescriptor(target, key) {
        if (key in type.getters)
          return { enumerable: true, configurable: true };
        return Reflect.getOwnPropertyDescriptor(target, key);
      },
      has(target, key) {
        const isPrivateField = key.startsWith(`_`);
        if (isPrivateField && !isRunningInternalCode) return false;

        return Reflect.has(target, key) || key in type.getters;
      },
    });

    this.superClasses.forEach((SuperClass) => {
      const s = SuperClass.New(instanceInitObj);
      Object.assign(proxy, s);
    });
    Object.assign(proxy, this.initObj);
    Object.assign(proxy, instanceInitObj);
    if (this.initObj.$init) this.initObj.$init(proxy);

    return proxy;
  }

  get static() {
    if (!this._staticTypeInstance) {
      this._StaticType = new Type(this.statics);
      this._staticTypeInstance = this._StaticType.New();
    }

    return this._staticTypeInstance;
  }
}
window.Type = Type;
window.List = new Type([]);

window.Make = (initObj = {}) => {
  if (initObj === null || typeof initObj !== "object")
    throw `You can pass "Make" an object with default fields or just leave it blank.`;

  const newType = new Type(initObj);
  return newType.New();
};
