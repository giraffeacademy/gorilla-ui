class Effect {
  static ACTIVE_STACK = [];
  static get activeEffect() {
    return Effect.ACTIVE_STACK.at(-1);
  }
  static pendingEffects = new Set();

  static Root(fn) {
    const ACTIVE_STACK_CACHE = this.ACTIVE_STACK;
    this.ACTIVE_STACK = [];
    const result = fn();
    this.ACTIVE_STACK = ACTIVE_STACK_CACHE;
    return result;
  }
  constructor(fn = () => {}) {
    this.fn = fn;
    this.unsubCallbacks = new Set();
    this._runCount = 0;

    this.run();

    const _this = this;
    return () => _this.cleanup();
  }

  cleanup() {
    this.unsubCallbacks.forEach((fn) => fn());
  }

  async run() {
    const effect = this;
    RUN_TASKS(async () => {
      effect.cleanup();
      Effect.ACTIVE_STACK.push(effect);
      await effect.fn(effect._runCount++);
      Effect.ACTIVE_STACK.pop();
    });
  }
}
window.Effect = Effect;

Object.defineProperty(Object.prototype, "link", {
  value: function link(targetField, type, typeField) {
    const unsub = new Effect(() => {
      this[targetField] = type[typeField];
    });
    if (this instanceof Node) this.addEventListener("unmount", unsub);

    return unsub;
  },
  enumerable: false,
});
