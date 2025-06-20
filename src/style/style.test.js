import { Lexer } from "panda-parse";

useTests("Style", () => {
  $STYLE_AST.test("", null, true);
  $MEASUREMENT.test("", null, true);
  $HEX_COLOR.test("", null, true);
  $STRING_STYLE.test("", null, true);
  $IDENTIFIER_STYLE.test("", null, true);
  $VARIABLE.test("", null, true);
  $STYLE_VALUE_GROUP.test("", null, true);
  $MULTIPLICATIVE_STYLE.test("", null, true);
  $ADDITIVE_STYLE.test("", null, true);
  $FUN_CALL_STYLE.test("", null, true);
  $ATTRIBUTE_STYLE.test("", null, true);
  $ANIMATION_STEP.test("", null, true);
  $ANIMATION.test("", null, true);

  useTests("misc", () => {
    it("works", () => {
      const ast = $STYLE_AST.parse(new Lexer(`ff:#5DFGH8`));
      console.log(ast);
    });
  });

  useTests("$STYLE_VALUE: Integrations", () => {
    const STYLE_VALUE_ASTS = [
      $MEASUREMENT,
      $HEX_COLOR,
      $STRING_STYLE,
      $VARIABLE,
      $IDENTIFIER_STYLE,
      $MULTIPLICATIVE_STYLE,
      $ADDITIVE_STYLE,
      $FUN_CALL_STYLE,
    ];
    STYLE_VALUE_ASTS.forEach((AST) => {
      it(`${AST.name}`, () => {
        AST.SAMPLES.forEach((sample) => {
          const ast = $STYLE_VALUE.parse(new Lexer(sample));
          assert(ast instanceof AST && ast.text === sample, sample);
        });
      });
    });
  });

  useTests("Element.prototype.addDynamicClass", () => {
    it("creates a new class with parsed style", () => {
      const style = document.createElement("style");
      div.append(style);

      const [className] = style.addDynamicClass(`w:10px h:2rem`);

      assert(style.textContent.includes(`.${className} {`));
      assert(style.textContent.includes(`width: 10px`));
      assert(style.textContent.includes(`height: 2rem`));
    });
    it("supports updates and replaces content correctly", () => {
      const style = document.createElement("style");
      div.append(style);

      const [className, update] = style.addDynamicClass(`w:5px`);
      update(`w:99px h:10px`);

      const content = style.textContent;

      assert(content.includes(`width: 99px`));
      assert(content.includes(`height: 10px`));
      assert(!content.includes(`width: 5px`)); // old style gone
      assert(content.match(new RegExp(`\\.${className}\\s*\\{[\\s\\S]+\\}`)));
    });
    it("handles multiple dynamic classes without overlap", () => {
      const style = document.createElement("style");
      div.append(style);

      const [classA, updateA] = style.addDynamicClass(`w:1px`);
      const [classB, updateB] = style.addDynamicClass(`w:2px`);

      assert(style.textContent.includes(`.${classA}`));
      assert(style.textContent.includes(`.${classB}`));

      updateA(`w:10px`);
      updateB(`w:20px`);

      assert(style.textContent.includes(`width: 10px`));
      assert(style.textContent.includes(`width: 20px`));
      assert(!style.textContent.includes(`width: 1px`));
      assert(!style.textContent.includes(`width: 2px`));
    });
    it("can be used repeatedly without corruption", () => {
      const style = document.createElement("style");
      div.append(style);

      for (let i = 0; i < 10; i++) {
        const [cls, update] = style.addDynamicClass(`w:${i}px`);
        update(`w:${i * 10}px`);
        assert(style.textContent.includes(`.${cls}`));
        assert(style.textContent.includes(`width: ${i * 10}px`));
      }
    });
    it("pseudo selectors", () => {
      const style = document.createElement("style");
      div.append(style);

      const [className] = style.addDynamicClass(`fc:red`, { pseudo: "hover" });

      assert(className.includes(":hover"));
      assert(style.textContent.includes(`.${className} {`));
      assert(style.textContent.includes(`color: red`));
      assert(style.textContent.includes(":hover"));
    });
    it("media queries", () => {
      const style = document.createElement("style");
      div.append(style);

      const [className] = style.addDynamicClass(`w:10px`, {
        media: ["minw", "500px"],
      });

      assert(style.textContent.includes("@media (min-width: 500px)"));
      assert(style.textContent.includes(`.${className} {`));
      assert(style.textContent.includes(`width: 10px`));
    });
  });

  useTests("Element.prototype.addDynamicAnimation", () => {
    it("creates a new class with parsed animation", () => {
      const style = document.createElement("style");
      div.append(style);

      const [className, animationName] = style.addDynamicAnimation(`
2s ease-in-out 1s infinite alternate both
  |from| w:10px
  |50%| bg:red
  |to| w:20px  
`);

      assert(style.textContent.includes(`@keyframes ${animationName} {`));
      assert(style.textContent.includes(`.${className} {`));
      assert(style.textContent.includes(`to`));
      assert(style.textContent.includes(`from`));
    });
    it("supports updates and replaces content correctly", () => {
      const style = document.createElement("style");
      div.append(style);

      const [className, animationName, update] =
        style.addDynamicAnimation(`2s |to| absolute`);
      update(`1s |from| fixed`);

      assert(style.textContent.includes(`@keyframes ${animationName} {`));
      assert(style.textContent.includes(`.${className} {`));
      assert(style.textContent.includes(`1s`));
      assert(style.textContent.includes(`from`));
      assert(style.textContent.includes(`fixed`));
    });
    it("handles multiple dynamic classes without overlap", () => {
      const style = document.createElement("style");
      div.append(style);

      const [classA, _a, updateA] = style.addDynamicAnimation(`1s |to| w:1px`);
      const [classB, _b, updateB] = style.addDynamicAnimation(`2s |to| w:2px`);

      assert(style.textContent.includes(`.${classA}`));
      assert(style.textContent.includes(`.${classB}`));

      updateA(`10s |to| w:10px`);
      updateB(`20s |to| w:20px`);

      assert(style.textContent.includes(`width: 10px`));
      assert(style.textContent.includes(`width: 20px`));
      assert(!style.textContent.includes(`width: 1px`));
      assert(!style.textContent.includes(`width: 2px`));
    });
    it("can be used repeatedly without corruption", () => {
      const style = document.createElement("style");
      div.append(style);

      for (let i = 0; i < 10; i++) {
        const [className, animationName, update] = style.addDynamicAnimation(
          `1s |to| w:${i}px`
        );
        update(`1s |to| w:${i * 10}px`);
        assert(style.textContent.includes(`.${className}`));
        assert(style.textContent.includes(`@keyframes ${animationName}`));

        assert(style.textContent.includes(`width: ${i * 10}px`));
      }
    });
    it("pseudo selectors", () => {
      const style = document.createElement("style");
      div.append(style);

      const [className, animationName] = style.addDynamicAnimation(
        `1s |to| w:10px`,
        {
          pseudo: "hover",
        }
      );

      assert(className.includes(":hover"));
      assert(style.textContent.includes(`.${className} {`));
      assert(style.textContent.includes(`@keyframes ${animationName} {`));

      assert(style.textContent.includes(`width: 10px`));
      assert(style.textContent.includes(":hover"));
    });
    it("media queries", () => {
      const style = document.createElement("style");
      div.append(style);

      const [className, animationName] = style.addDynamicAnimation(
        `1s |to| w:10px`,
        {
          media: ["minw", "500px"],
        }
      );

      assert(style.textContent.includes("@media (min-width: 500px)"));
      assert(style.textContent.includes(`.${className} {`));
      assert(style.textContent.includes(`@keyframes ${animationName} {`));

      assert(style.textContent.includes(`width: 10px`));
    });
  });

  useTests("Element.prototype.addDynamicStyle", () => {
    it("basic usage", async () => {
      const A = new Type("A");
      const a = A.New({ color: "blue" });
      const el = document.createElement("div");
      div.append(el);

      el.addDynamicStyle("bg", () => a.color);

      await defer();
      assert(el.style.background === "blue");

      a.color = "red";
      await defer();
      assert(el.style.background === "red");

      el.remove();
      await defer();

      a.color = "green";
      await defer();
      assert(el.style.background === "red");
    });
    it("multiple styles", async () => {
      const A = new Type("A");
      const a = A.New({ color: "blue" });
      const el = document.createElement("div");
      div.append(el);

      el.addDynamicStyle(["bg", "fc"], () => a.color);

      await defer();
      assert(el.style.background === "blue");
      assert(el.style.color === "blue");

      a.color = "red";
      await defer();
      assert(el.style.background === "red");
      assert(el.style.color === "red");

      el.remove();
      await defer();

      a.color = "green";
      await defer();
      assert(el.style.background === "red");
      assert(el.style.color === "red");
    });
  });
});
