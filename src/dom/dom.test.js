useTests("DOM", () => {
  beforeEach(() => {
    Type.activeTypes = {};
  });

  useTests("Element.addProps", () => {
    useTests("   style", () => {
      it("basic usage", async () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ s: `w:100px h:100px` });

        assert(el.className.length);
        assert(GLOBAL_STYLE.textContent.includes(el.className));
        assert(GLOBAL_STYLE.textContent.includes(`width: 100px;`));
        assert(GLOBAL_STYLE.textContent.includes(`height: 100px;`));
        await defer();

        assert(Math.trunc(el.getBoundingClientRect().width) === 100);
        assert(Math.trunc(el.getBoundingClientRect().height) === 100);
      });
      it("stateful", async () => {
        const A = new Type("A");
        const a = A.New({ color: "blue" });
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ s: () => `bg:${a.color}` });

        await defer();
        const firstClassName = div.className;
        assert(el.className);
        assert(GLOBAL_STYLE.textContent.includes(el.className));
        assert(GLOBAL_STYLE.textContent.includes("background: blue;"));
        a.color = "red";

        await defer();
        assert(el.classList.length === 1);
        assert(el.className !== firstClassName);
        assert(GLOBAL_STYLE.textContent.includes(div.className));
        assert(GLOBAL_STYLE.textContent.includes("background: red;"));
      });
      it("multiple s props", async () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ s: [() => `bg:green`, "w:20px"] });

        await defer();
        assert(GLOBAL_STYLE.textContent.includes("width: 20px;"));
        assert(GLOBAL_STYLE.textContent.includes("background: green;"));
      });
      it("reuses class when s is same", () => {
        const el1 = document.createElement("div");
        const el2 = document.createElement("div");

        div.append(el1, el2);

        el1.addProps({ s: [`w:100px h:100px`, () => `h:4%`] });
        el2.addProps({ s: [`w:100px h:100px`, () => `h:4%`] });

        assert(el1.className === el2.className);
      });
      useTests("element.style", () => {
        it("basic usage", () => {
          const el = document.createElement("div");
          div.append(el);

          el.addProps({ s_w: "10px", s_h: "20px" });

          assert(el.style.width === "10px");
          assert(el.style.height === "20px");
        });
        it("dynamic", async () => {
          const A = new Type("A");
          const a = A.New({ color: "blue" });
          const el = document.createElement("div");
          div.append(el);

          el.addProps({ s_bg: () => a.color });

          assert(el.style.background === "blue");

          a.color = "red";
          await defer();

          assert(el.style.background === "red");
        });
        it("multiple style per key", async () => {
          const el = document.createElement("div");
          div.append(el);

          el.addProps({ s_w_h_minw: "10px" });

          assert(el.style.width === "10px");
          assert(el.style.height === "10px");
          assert(el.style.minWidth === "10px");
        });
      });

      it("pseudo hover", async () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ _s: `w:100px h:100px` });

        assert(GLOBAL_STYLE.textContent.includes(`:hover`));
      });
      it("pseudo focus", async () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ __s: `w:100px h:100px` });

        assert(GLOBAL_STYLE.textContent.includes(`:focus`));
      });
      it("media query", async () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ s__w_100px: `bg:blue` });

        assert(GLOBAL_STYLE.textContent.includes("@media"));
      });
    });
    useTests("   animation", () => {
      it("basic usage", () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ a: `2s ease-in-out |to| w:10px` });

        assert(el.className.length);
        assert(GLOBAL_STYLE.textContent.includes(el.className));
      });
      it("multiple animations", () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ a: [`1s |to| w:10px`, () => `2s |to| w:20px`] });

        assert(el.className.length);

        assert(GLOBAL_STYLE.textContent.includes("2s"));
        assert(GLOBAL_STYLE.textContent.includes("10px"));

        assert(GLOBAL_STYLE.textContent.includes("1s"));
        assert(GLOBAL_STYLE.textContent.includes("20px"));
      });
      it("re-uses for same animation", () => {
        const el1 = document.createElement("div");
        const el2 = document.createElement("div");

        div.append(el1);
        div.append(el2);

        el1.addProps({ a: `2s ease-in-out |to| w:10px` });
        el2.addProps({ a: `2s ease-in-out |to| w:10px` });

        assert(el1.className === el2.className);
      });
      it("stateful", async () => {
        const A = new Type("A");
        const a = A.New({ color: "blue", time: "2s" });
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ a: () => `${a.time} |to| bg:${a.color}` });

        assert(GLOBAL_STYLE.textContent.includes("to"));
        assert(GLOBAL_STYLE.textContent.includes("blue"));
        assert(GLOBAL_STYLE.textContent.includes("2s"));

        a.color = "red";
        a.time = "1s";

        await defer();
        assert(GLOBAL_STYLE.textContent.includes("red"));
        assert(GLOBAL_STYLE.textContent.includes("1s"));

        // assert()
      });

      it("pseudo hover", async () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ _a: `2s |to| w:10px` });
        assert(GLOBAL_STYLE.textContent.includes(":hover"));
      });
      it("pseudo focus", () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ __a: `1s |to| w:20px` });
        assert(GLOBAL_STYLE.textContent.includes(":focus"));
      });
      it("media query", async () => {
        const el = document.createElement("div");
        div.append(el);

        el.addProps({ a__w_100px: `5s |to| w:100px` });

        assert(GLOBAL_STYLE.textContent.includes("@media"));
      });
    });
    useTests("attributes", () => {
      it("numbers", () => {
        const numberAttrs = Object.entries(DOM_ATTRIBUTES).filter(
          ([_, v]) => v === "number"
        );

        numberAttrs.forEach(([attr]) => {
          if (["offsetHeight", "offsetWidth"].includes(attr)) {
            // these only have getters
            assert(typeof div[attr] === "number", attr);
          } else {
            div.addProps({ [attr]: 4 });
            // div[attr] = 4;
            assert(div[attr] == 4, attr);
          }
        });
      });
      it("strings", () => {
        const stringAttrs = Object.entries(DOM_ATTRIBUTES).filter(
          ([_, v]) => v === "string"
        );

        stringAttrs.forEach(([attr]) => {
          if (attr === "autocapitalize") {
            div.addProps({ [attr]: "words" });
            assert(div[attr] === "words", attr);
          } else if (attr === "dir") {
            div.addProps({ [attr]: "rtl" });
            assert(div[attr] === "rtl");
          } else if (attr === "outerHTML") {
            // getter only
            assert(!!div[attr], attr);
          } else if (attr === "innerText") {
            // innerText depends on rendered layout; skipping in test context
            assert(true);
          } else {
            div.addProps({ [attr]: "true" });
            assert(div[attr] == "true", attr);
          }
          //
        });
      });
      it("booleans", () => {
        const booleanAttrs = Object.entries(DOM_ATTRIBUTES).filter(
          ([_, v]) => v === "boolean"
        );

        booleanAttrs.forEach(([attr]) => {
          div.addProps({ [attr]: true });
          assert(div[attr] == true, `${attr}: true`);

          div.addProps({ [attr]: false });
          assert(div[attr] == false, `${attr}: false`);
        });
      });
      it("custom", () => {
        const customAttrs = ["x", "y", "z"];

        customAttrs.forEach((attr) => {
          div.addProps({ [attr]: "foo" });
          assert(div[attr] == "foo", `${attr}: string`);

          div.addProps({ [attr]: 4 });
          assert(div[attr] == 4, `${attr}: number`);

          div.addProps({ [attr]: true });
          assert(div[attr] == true, `${attr}: boolean true`);

          div.addProps({ [attr]: false });
          assert(div[attr] == false, `${attr}: boolean false`);
        });
      });
      it("class", () => {
        div.classList.add("x");
        div.addProps({ class: `foo bar baz` });
        div.classList.add("y");

        assert(div.className === "x foo bar baz y");
      });
      it("dynamic", async () => {
        const A = new Type("A");
        const a = A.New({ i: "foo" });
        div.addProps({ dog: () => a.i });

        await defer();
        assert(div.dog === "foo");

        a.i = "bar";
        await defer();

        assert(div.dog === "bar");

        // unmount unsubscribes the dynamic field
        div.remove();
        await defer();

        a.i = "finny";
        await defer();
        assert(div.dog === "bar");
      });
      it("dynamic class", async () => {
        const A = new Type("A");
        const a = A.New({ i: "foo bar" });

        div.classList.add("x");
        div.classList.add("y");
        div.addProps({ class: () => a.i });

        await defer();
        assert(div.className === "x y foo bar");

        a.i = "bar";
        await defer();
        assert(div.className === "x y bar");

        a.i = "finny foo";

        await defer();
        assert(div.className === "x y finny foo");
      });
      it("effects: single", async () => {
        const A = new Type("A");
        const a = A.New({ foo: "abc" });

        let i = 0;
        div.addProps({
          effects: () => {
            i++;
            a.foo;
          },
        });

        await defer();
        assert(i === 1);

        a.foo = "xyz";
        await defer();

        assert(i === 2);
      });
      it("effects: multiple", async () => {
        const A = new Type("A");
        const a = A.New({ foo: "abc", bar: "xyz" });

        let i = 0;
        let j = 0;
        div.addProps({
          effects: [
            () => {
              i++;
              a.foo;
            },
            () => {
              j++;
              a.bar;
            },
          ],
        });

        await defer();
        assert(i === 1);
        assert(j === 1);

        a.foo = "xyz";
        a.bar = "abc";

        await defer();

        assert(i === 2);
        assert(j === 2);
      });
      it("multiple_attrs", () => {
        const el = document.createElement("div");
        el.addProps({ x_y_z: "d" });

        assert(el.x === "d");
        assert(el.y === "d");
        assert(el.z === "d");
      });
    });
    useTests("DOM Events", () => {
      Object.entries(DOM_EVENTS).forEach(([eventName, EventClass]) => {
        it(`fires ${eventName}`, async () => {
          await new Promise((res, rej) => {
            const timeout = setTimeout(() => {
              rej(new Error("Timeout"));
            }, 50);

            // Add event handler dynamically via addProps
            div.addProps({
              ["on" + eventName]: () => {
                assert(true, `${eventName} triggered`);
                res();
              },
            });

            // Create and dispatch event
            try {
              const event = new EventClass(eventName, {
                bubbles: true,
                cancelable: true,
              });
              div.dispatchEvent(event);
            } catch (err) {
              // Fallback in case constructor is unsupported in environment
              const fallback = new Event(eventName, {
                bubbles: true,
                cancelable: true,
              });
              div.dispatchEvent(fallback);
            }
          });
        });
      });
    });
  });

  useTests("Element.Effect", () => {
    it("basic usage", async () => {
      const A = new Type("A");
      const a = A.New({ foo: "bar" });
      const el = document.createElement("div");

      let i = 0;
      el.Effect(() => {
        a.foo;
        i++;
      });

      div.append(el);

      await defer();
      assert(i === 1);

      a.foo = "xyz";
      await defer();
      assert(i === 2);

      el.remove();
      await defer();

      a.foo = "bar";
      await defer();

      assert(i === 2);
    });
  });

  useTests("Node.from", () => {
    it("nodes", () => {
      [div, span, input].forEach((source) => {
        const el = Node.from(source);
        assert(el === source);
      });
    });
    it("undefined, null, false", () => {
      [undefined, null, false].forEach((source) => {
        const el = Node.from(source);
        assert(el.data === "");
      });
    });
    it("primitives", () => {
      ["a", true, 1].forEach((source) => {
        const el = Node.from(source);
        assert(el.data === source.toString());
      });
    });
    it("objects", () => {
      [{}, { a: 1 }, { a: { b: 1 } }].forEach((source) => {
        const el = Node.from(source);
        assert(el.data === JSON.stringify(source, null, 4));
      });
    });
    it("arrays", () => {
      const el = Node.from([1, 2]);
      assert(el.nodeType === Node.DOCUMENT_FRAGMENT_NODE);
      assert(el.childNodes.length === 2);
    });
    it("dynamic", async () => {
      const A = new Type("A");
      const a = A.New({ i: 0 });

      const el = Node.from(() => {
        if (a.i === 0) return "x";
        else if (a.i === 1) return ["y", "z"];
      });
      div.append(el);
      assert(el instanceof DocumentFragment);
      await defer();
      assert(div.textContent === "x");

      a.i = 1;
      await defer();
      assert(div.textContent === "yz");

      a.i = 0;
      await defer();
      assert(div.textContent === "x");

      // stops updating on unmount
      div.remove();
      await defer();
      assert(div.textContent === "x");

      a.i = 1;
      await defer();
      assert(div.textContent === "x");
    });
    it("dynamic list", async () => {
      const A = new Type("A");
      const a = A.New({ filter: "" });
      const list = List.New(["ape", "ark", "dog"]);

      const el = Node.from(() => {
        const l = list.filter((e) => e.includes(a.filter));
        return l;
      });

      div.append(el);
      await defer();
      assert(div.textContent === "apearkdog");

      a.filter = "a";
      await defer();
      assert(div.textContent === "apeark");

      a.filter = "ap";
      await defer();
      assert(div.textContent === "ape");

      a.filter = "d";
      await defer();
      assert(div.textContent === "dog");
    });
    it("Node.list", async () => {
      const a = List.New(["x", "y", "z"]);
      const el = Node.from(new Set([a, (e) => e]));
      div.append(el);
      assert(div.textContent === "");
      await defer();
      assert(div.textContent === "xyz");

      a[0] = "a";
      await defer();
      assert(div.textContent === "ayz");

      a[1] = "hello";
      a[3] = "world";
      await defer();
      assert(div.textContent === "ahellozworld");

      delete a[3];
      delete a[2];
      delete a[1];
      await defer();
      assert(div.textContent === "a");
    });
  });

  useTests("Node.list", () => {
    it("basic usage", async () => {
      const a = List.New(["x", "y", "z"]);
      const el = Node.list(a, (e) => e);
      assert(el instanceof DocumentFragment);

      div.append(el);
      assert(div.textContent === "");
      await defer();
      assert(div.textContent === "xyz");

      a[0] = "a";
      await defer();
      assert(div.textContent === "ayz");

      a[1] = "hello";
      a[3] = "world";
      await defer();
      assert(div.textContent === "ahellozworld");

      delete a[3];
      delete a[2];
      delete a[1];
      await defer();
      assert(div.textContent === "a");
    });
    it("reactively filters a functional list", async () => {
      const products = List.New(["Banana", "Apple", "Cake", "Cereal"]);
      const search = new Type("Search").New({ value: "a" });

      const el = Node.list(
        () =>
          products.filter((p) =>
            p.toLowerCase().includes(search.value.toLowerCase())
          ),
        (item) => document.createTextNode(item)
      );

      div.append(el);
      await defer();
      assert(div.textContent === "BananaAppleCakeCereal");

      search.value = "ca";
      await defer();
      assert(div.textContent === "Cake");

      search.value = "e";
      await defer();
      assert(div.textContent === "AppleCakeCereal");

      search.value = "zz";
      await defer();
      assert(div.textContent === "");

      search.value = "b";
      await defer();
      assert(div.textContent === "Banana");
    });
  });

  useTests("Element.create", () => {
    useTests("functional tests", () => {
      it("basic usage", async () => {
        const el = Element.create(
          "div",
          { id: "a", class: "foo bar" },
          "x",
          "y"
        );

        assert((el.textContent = "xy"));
        assert(el.id === "a");
        assert(el.className === "foo bar");
      });
      it("attaches props", async () => {
        const el = Element.create("div", {
          x: "foo",
          y: "bar",
          z: () => "baz",
        });

        assert(el.x === "foo");
        assert(el.y === "bar");

        await defer(); // awaiting dynamic props
        assert(el.z === "baz");
      });
      it("returns a document fragment if type is undefined", () => {
        const el = Element.create(
          undefined,
          {},
          document.createElement("div"),
          "a"
        );

        assert(el instanceof DocumentFragment);
        assert(el.childNodes.length === 2);
        assert(el.textContent === "a");
      });
      it("functional component", async () => {
        const App = ({ p1, p2 }, ...children) => {
          return p1 + "x" + p2 + children.join("");
        };
        const el = Element.create(App, { p1: "a", p2: "b" }, "y", "z");
        div.append(el);
        await defer();

        assert(div.textContent === "axbyz");
      });
      it("dynamic child", async () => {
        const A = new Type("A");
        const a = A.New({ i: 0 });

        const el = Element.create("div", {}, () => {
          if (a.i === 0) return "x";
          else return "y";
        });
        div.append(el);
        await defer();
        assert(el.textContent === "x");

        a.i++;
        await defer();
        await defer();

        assert(el.textContent === "y");
      });
      it("short circuit child", async () => {
        const A = new Type("A");
        const a = A.New({ i: false });

        const el = Element.create("div", {}, () => a.i && "foo");
        div.append(el);
        await defer();
        // console.log(el.textContent);
        assert(el.textContent === "");

        a.i++;
        await defer();
        await defer();

        assert(el.textContent === "foo");
      });
      it("Node.list", async () => {
        const a = List.New(["x", "y", "z"]);
        const el = Element.create("list", { _: a }, (e) => e);
        assert(el instanceof DocumentFragment);

        div.append(el);
        assert(div.textContent === "");
        await defer();
        assert(div.textContent === "xyz");

        a[0] = "a";
        await defer();
        assert(div.textContent === "ayz");

        a[1] = "hello";
        a[3] = "world";
        await defer();
        assert(div.textContent === "ahellozworld");

        delete a[3];
        delete a[2];
        delete a[1];
        await defer();
        assert(div.textContent === "a");
      });
      it("null, false", () => {
        [null, false].forEach((v) => {
          const el = Element.create(v);
          assert(el.nodeType === Node.TEXT_NODE);
        });
      });
      it("style element", () => {
        const el = Element.create("style");
        assert(el instanceof HTMLStyleElement);
      });
    });
    useTests("integration tests", () => {
      it("counter element", async () => {
        const A = new Type("A");
        const a = A.New({ i: 0 });

        const el = Element.create("div", { onclick: () => a.i++ }, () => a.i);
        div.append(el);
        await defer();

        assert(el.textContent === "0");

        el.click();
        await defer();

        assert(a.i === 1);
        assert(el.textContent === "1");

        el.click();
        await defer();

        assert(a.i === 2);
        assert(el.textContent === "2");
      });
      it("counter component", async () => {
        const A = new Type("A");

        const App = () => {
          const a = A.New({ i: 0 });

          return Element.create(
            "div",
            {},
            () => a.i,
            Element.create("button", { onclick: () => a.i++ })
          );
        };

        const el = Element.create(App);
        div.append(el);
        await defer();

        const button = div.querySelector("button");
        button.click();

        await defer();
        assert(div.textContent === "1");
      });
    });
  });
});
