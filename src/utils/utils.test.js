useTests("Utils", () => {
  useTests(`asArray`, () => {
    it("returns the array if the input is already an array", () => {
      const input = [1, 2, 3];
      return asArray(input) === input;
    });
    it("wraps a non-array input in an array", () => {
      const input = 42;
      const result = asArray(input);
      return Array.isArray(result) && result[0] === input;
    });
    it("returns an empty array when given as input", () => {
      const input = [];
      return asArray(input).length === 0;
    });
    it("returns a single-element array when given a string", () => {
      const input = "test";
      const result = asArray(input);
      return result.length === 1 && result[0] === input;
    });
    it("returns an empty list when value is undefined", () => {
      const input = undefined;
      const result = asArray(input);
      assert(result.matches([]));
    });
  });
  useTests(`asFunctionResult`, () => {
    it("returns the result of the function when the input is a function", () => {
      assert(asFunctionResult(() => 42) === 42);
    });
    it("returns the input as is when it's not a function", () => {
      assert(asFunctionResult("Hello") === "Hello");
    });
    it("passes the args into the function", () => {
      const fn = (...args) => args;
      assert(asFunctionResult(fn, 1, 2, 3).matches([1, 2, 3]));
    });
  });
  useTests(`hasAnyOwnProperty`, () => {
    it("Object has one of the given properties", () => {
      assert({ a: 1, b: 2, c: 3 }.hasAnyOwnProperty("a", "z"));
    });
    it("Object has multiple of the given properties", () => {
      assert({ a: 1, b: 2, c: 3 }.hasAnyOwnProperty("a", "b", "z"));
    });
    it("Object is missing all given properties", () => {
      assert(!{ a: 1, b: 2, c: 3 }.hasAnyOwnProperty("x", "y", "z"));
    });
  });
  useTests("asFunction", () => {
    it("returns the function if the input is already a function", () => {
      const inputFunction = () => "test";
      return asFunction(inputFunction) === inputFunction;
    });
    it("wraps a non-function input into a function", () => {
      const input = "test";
      const resultFunction = asFunction(input);
      return typeof resultFunction === "function" && resultFunction() === input;
    });
    it("wraps an object into a function that returns the object", () => {
      const input = { key: "value" };
      const resultFunction = asFunction(input);
      return (
        typeof resultFunction === "function" && resultFunction().key === "value"
      );
    });
    it("wraps undefined into a function that returns undefined", () => {
      const input = undefined;
      const resultFunction = asFunction(input);
      return (
        typeof resultFunction === "function" && resultFunction() === undefined
      );
    });
    it("wraps a number into a function that returns the number", () => {
      const input = 42;
      const resultFunction = asFunction(input);
      return typeof resultFunction === "function" && resultFunction() === input;
    });
  });

  useTests("String.prototype.count", () => {
    it("counts single-letter occurrences", () => {
      return "banana".count("a") === 3;
    });

    it("counts multi-letter substring occurrences", () => {
      return "hello hello hello".count("hello") === 3;
    });

    it("returns 0 if the substring is not present", () => {
      return "abcdef".count("z") === 0;
    });

    it("returns 0 for an empty string", () => {
      return "".count("a") === 0;
    });

    it("handles special regex characters safely", () => {
      return "1.2.3.".count(".") === 3;
    });

    it("counts overlapping substrings naively (non-overlapping)", () => {
      return "aaaa".count("aa") === 2; // Not 3
    });

    it("is case-sensitive", () => {
      return "Hello hello".count("hello") === 1;
    });
  });
  useTests("DOM Lifecycle Events", () => {
    it("mount", async () => {
      const el = document.createElement("div");
      let i = 0;

      el.addEventListener("mount", () => i++);

      div.appendChild(el);

      await defer();
      assert(i === 1);
    });
    it("unmount", async () => {
      const el = document.createElement("div");
      let i = 0;

      el.addEventListener("unmount", () => i++);

      div.appendChild(el);
      div.removeChild(el);

      await defer();
      assert(i === 1);
    });
    it("mount with nested children", async () => {
      const parent = document.createElement("div");
      const child = document.createElement("div");

      let i = 0;
      let j = 0;

      parent.addEventListener("mount", () => i++);
      child.addEventListener("mount", () => j++);

      parent.appendChild(child);
      div.appendChild(parent);

      await defer();
      assert(i === 1);
      assert(j === 1);
    });
    it("unmount with nested children", async () => {
      const parent = document.createElement("div");
      const child = document.createElement("div");

      let i = 0;
      let j = 0;

      parent.appendChild(child);
      div.appendChild(parent);

      parent.addEventListener("unmount", () => i++);
      child.addEventListener("unmount", () => j++);

      div.removeChild(parent);

      await defer();
      assert(i === 1);
      assert(j === 1);
    });
    it("mount -> unmount -> mount", async () => {
      const el = document.createElement("div");
      let i = 0;

      el.addEventListener("mount", () => i++);

      div.appendChild(el);
      await defer();
      assert(i === 1);

      div.removeChild(el);
      await defer();

      div.appendChild(el);
      await defer();
      assert(i === 2);
    });
    it("childadd", async () => {
      const parent = document.createElement("div");
      let i = 0;

      parent.addEventListener("childadd", () => i++);

      const child = document.createElement("div");
      child.id = "child";

      div.appendChild(parent);
      parent.appendChild(child);

      await defer();
      assert(i === 1);
    });
    it("childremove", async () => {
      const parent = document.createElement("div");
      const child = document.createElement("div");
      let i = 0;

      parent.appendChild(child);
      div.appendChild(parent);

      parent.addEventListener("childremove", (e) => {
        i++;
        assert(e.detail.child === child);
      });

      parent.removeChild(child);

      await defer();
      assert(i === 1);
    });
    it("textchange", async () => {
      const el = document.createElement("div");
      const textNode = document.createTextNode("initial");
      el.appendChild(textNode);
      let i = 0;

      el.addEventListener("textchange", (e) => {
        i++;
        assert(e.detail.textNode === textNode);
        assert(e.detail.action === "change");
      });

      div.appendChild(el);

      textNode.textContent = "updated";

      await defer();
      assert(i === 1);
    });
    it("attrchange -> added", async () => {
      const el = document.createElement("div");
      let i = 0;

      el.addEventListener("attrchange", (e) => {
        i++;
        assert(e.detail.attributeName === "data-foo");
        assert(e.detail.oldValue === null);
        assert(e.detail.newValue === "bar");
      });

      div.appendChild(el);
      el.setAttribute("data-foo", "bar");

      await defer();
      assert(i === 1);
    });
    it("attrchange -> changed", async () => {
      const el = document.createElement("div");
      el.setAttribute("data-foo", "bar");

      let i = 0;

      el.addEventListener("attrchange", (e) => {
        i++;
        assert(e.detail.attributeName === "data-foo");
        assert(e.detail.oldValue === "bar");
        assert(e.detail.newValue === "baz");
      });

      div.appendChild(el);
      el.setAttribute("data-foo", "baz");

      await defer();
      assert(i === 1);
    });
    it("attrchange -> removed", async () => {
      const el = document.createElement("div");
      el.setAttribute("data-foo", "bar");
      let i = 0;

      el.addEventListener("attrchange", (e) => {
        i++;
        assert(e.detail.attributeName === "data-foo");
        assert(e.detail.oldValue === "bar");
        assert(e.detail.newValue === null);
      });

      div.appendChild(el);
      el.removeAttribute("data-foo");

      await defer();
      assert(i === 1);
    });
  });
});
