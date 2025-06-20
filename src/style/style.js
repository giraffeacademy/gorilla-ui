import { $AST, Shape, $UNKNOWN, $EXP, Lexer } from "panda-parse";

const ABBREVIATIONS = {
  w: "width",
  minw: "min-width",
  maxw: "max-width",
  h: "height",
  minh: "min-height",
  maxh: "max-height",
  m: "margin",
  ml: "margin-left",
  mt: "margin-top",
  mr: "margin-right",
  mb: "margin-bottom",
  p: "padding",
  pl: "padding-left",
  pt: "padding-top",
  pr: "padding-right",
  pb: "padding-bottom",
  d: "display",
  b: "border",
  bc: "border-color",
  bw: "border-width",
  bs: "border-style",
  bl: "border-left",
  blc: "border-left-color",
  blw: "border-left-width",
  bls: "border-left-style",
  bt: "border-top",
  btc: "border-top-color",
  btw: "border-top-width",
  bts: "border-top-style",
  br: "border-right",
  brc: "border-right-color",
  brw: "border-right-width",
  brs: "border-right-style",
  bb: "border-bottom",
  bbc: "border-bottom-color",
  bbw: "border-bottom-width",
  bbs: "border-bottom-style",
  r: "border-radius",
  rtl: "border-top-left-radius",
  rtr: "border-top-right-radius",
  rbr: "border-bottom-right-radius",
  rbl: "border-bottom-left-radius",
  over: "overflow",
  overx: "overflow-x",
  overy: "overflow-y",
  o: "opacity",
  ol: "outline",
  sh: "box-shadow",
  c: "cursor",
  ct: "content",
  fc: "color",
  fs: "font-size",
  ff: "font-family",
  fw: "font-weight",
  fd: "font-direction",
  fsp: "font-spacing",
  fst: "font-style",
  td: "text-decoration",
  ta: "text-align",
  tdc: "text-decoration-color",
  left: "left",
  top: "top",
  right: "right",
  bottom: "bottom",
  a: "align-items",
  ac: "align-content",
  j: "justify-content",
  as: "align-self",
  fl: "flex",
  flg: "flex-grow",
  fls: "flex-shrink",
  z: "z-index",
  bg: "background",
  t: "transition",
  tdl: "transition-delay",
  tdr: "transition-duration",
  tp: "transition-property",
  ttf: "transition-timing-function",
  sel: "user-select",
  tf: "transform",
  tfo: "transform-origin",
  an: "animation",
  andel: "animation-delay",
  andir: "animation-direction",
  andur: "animation-duration",
  anfm: "animation-fill-mode",
  anic: "animation-iteration-count",
  ann: "animation-name",
  anps: "animation-play-state",
  antf: "animation-timing-function",
  v: "visibility",
  ws: "white-space",
  wb: "word-break",
  ww: "word-wrap",
  ow: "overflow-wrap",
  hy: "hyphens",
  lh: "line-height",
  cc: "caret-color",
  pe: "pointer-events",
  ts: "text-shadow",
};
const SHORTHANDS = {
  flex: ["display", "flex"],
  block: ["display", "block"],
  hide: ["display", "none"],
  inline: ["display", "inline"],
  inlineb: ["display", "inline-block"],
  absolute: ["position", "absolute"],
  static: ["position", "static"],
  relative: ["position", "relative"],
  sticky: ["position", "sticky"],
  fixed: ["position", "fixed"],
  wrap: ["flex-wrap", "wrap"],
  wrapr: ["flex-wrap", "wrap-reverse"],
  row: ["flex-direction", "row"],
  rowr: ["flex-direction", "row-reverse"],
  col: ["flex-direction", "column"],
  colr: ["flex-direction", "column-reverse"],
  bbox: ["box-sizing", "border-box"],
  italic: ["font-style", "italic"],
  bold: ["font-weight", "bold"],
  oblique: ["font-style", "oblique"],
  visible: ["visibility", "visible"],
  hide: ["visibility", "hidden"],
  collapse: ["visibility", "collapse"],
  underline: ["text-decoration", "underline"],
  overline: ["text-decoration", "overline"],
  "line-through": ["text-decoration", "line-through"],
  blink: ["text-decoration", "blink"],
};

class $STYLE_AST extends $AST {
  static SHAPE = new Shape([() => $ATTRIBUTE_STYLE, $UNKNOWN], {
    min: 0,
    max: Infinity,
  });
  static SAMPLES = [`w:10px absolute bg:blue`];
  static test(control, fn = () => {}, testCSS = false) {
    it(`${control}${this.name}`, () => {
      this.SAMPLES.forEach((sample) => {
        const ast = this.parse(new Lexer(sample));
        assert(ast instanceof this && ast.text === sample, sample);

        if (testCSS) {
          const css = ast.toJS();
          console.log(`---- js ----\n\n${css}`);
        }
        if (fn) fn(ast);
      });
    });
  }

  toJS() {
    let result = ``;
    this.contentExps.forEach((exp) => {
      if (exp.toJS) result += `${exp.toJS().trim()};\n`;
      else result += `${exp.text.trim()};\n`;
    });
    return result;
  }
}
window.$STYLE_AST = $STYLE_AST;

class $STYLE_VALUE extends $EXP {}
window.$STYLE_VALUE = $STYLE_VALUE;

// ---------------- MEASUREMENT ----------------
class $MEASUREMENT extends $STYLE_AST {
  static SHAPE = new Shape(/^-?\d*\.?\d+[a-zA-Z%]*/);
  static SAMPLES = [
    // Absolute Lengths
    "0px",
    "1px",
    "12px",
    "0pt",
    "10pt",
    "72pt",
    "0pc",
    "6pc",
    "0in",
    "1in",
    "0cm",
    "2.54cm",
    "0mm",
    "10mm",
    "0Q",
    "40Q",

    // Relative Lengths
    "0em",
    "1em",
    "1.5em",
    "2.5em",
    "0rem",
    "1rem",
    "3rem",
    "0%",
    "50%",
    "100%",
    "0ex",
    "1ex",
    "2.2ex",
    "0ch",
    "1ch",
    "10ch",
    "1lh",
    "1.2lh",
    "1rlh",
    "1.5rlh",

    // Viewport-relative
    "0vw",
    "100vw",
    "5.5vw",
    "0vh",
    "100vh",
    "33.33vh",
    "0vmin",
    "50vmin",
    "0vmax",
    "75vmax",
    "0svw",
    "100svw",
    "0svh",
    "100svh",
    "0lvw",
    "100lvw",
    "0lvh",
    "100lvh",
    "0dvw",
    "100dvw",
    "0dvh",
    "100dvh",

    // Angles
    "0deg",
    "90deg",
    "360deg",
    "0rad",
    "3.14rad",
    "6.28rad",
    "0grad",
    "100grad",
    "400grad",
    "0turn",
    "0.5turn",
    "1turn",

    // Time
    "0s",
    "1s",
    "2.5s",
    "0ms",
    "500ms",
    "1000ms",

    // Frequency (rare)
    "0Hz",
    "440Hz",
    "1000Hz",
    "0kHz",
    "1kHz",
    "2.5kHz",

    // Resolution (for media queries)
    "0dpi",
    "96dpi",
    "300dpi",
    "0dpcm",
    "37.8dpcm",
    "118.1dpcm",
    "1dppx",
    "2dppx",
  ];

  toJS() {
    return this.text;
  }
}
window.$MEASUREMENT = $MEASUREMENT;

// ---------------- HEX COLOR ----------------
class $HEX_COLOR extends $STYLE_AST {
  static SHAPE = new Shape(/^#.{0,6}\b/);
  static SAMPLES = ["#fff", "#000", "#1234", "#abcd", "#123abc", "#AABBCC"];

  toJS() {
    return this.text;
  }
}
window.$HEX_COLOR = $HEX_COLOR;

// ---------------- STRING ----------------
class $STRING_STYLE extends $STYLE_AST {
  static SHAPE = new Shape(/^("(?:[^"\\\n\r]|\\.)*"|'(?:[^'\\\n\r]|\\.)*')/);
  static SAMPLES = [
    `"simple double quoted"`,
    `'simple single quoted'`,

    `"with spaces and symbols !@#$%^&*()"`,
    `'1234567890'`,

    `"escaped quote: \\"hello\\""`,
    `'escaped single: It\\'s fine'`,

    `"line\\nbreak"`, // escape sequences
    `"tab\\tchar"`,

    `"unicode: \\00A9"`, // copyright symbol
    `"emoji: \\1F600"`,

    `"mixed \\\"quotes\\\" and \\n escapes"`,

    `""`, // empty string (valid)
    `''`,

    `"nested 'quotes' work"`,
    `'nested "quotes" work too'`,

    `"quote inside: 'single'"`,
    `'quote inside: "double"'`,

    `"just a backslash \\\\"`, // double escaped

    `"semi;colon inside"`,
    `'bracket } inside'`,
  ];

  toJS() {
    return this.text;
  }
}
window.$STRING_STYLE = $STRING_STYLE;

// ---------------- STRING ----------------
class $IDENTIFIER_STYLE extends $STYLE_AST {
  static SHAPE = new Shape(/^([a-zA-Z][a-zA-Z0-9-_]*|[a-zA-Z][a-zA-Z0-9-_]*)/);
  static SAMPLES = [
    // ATTRIBUTE_STYLE VALUES
    "repeat",
    "no-repeat",
    "space-between",
    "center",
    "left",
    "right",

    // SHORTHANDS
    "flex",
    "block",
    "line",
    "inline",
    "absolute",
    "static",
  ];

  toJS() {
    if (this.text.startsWith("--")) return `var(${this.text})`;
    if (SHORTHANDS[this.text.trim()]) {
      const [attrName, value] = SHORTHANDS[this.text.trim()];
      return `${attrName}: ${value}`;
    }
    return this.text;
  }
}
window.$IDENTIFIER_STYLE = $IDENTIFIER_STYLE;

// ---------------- VARIABLE ----------------
class $VARIABLE extends $STYLE_AST {
  static SHAPE = new Shape(/^--[a-zA-Z][a-zA-Z0-9-_]*/);

  static SAMPLES = [
    "--main",
    "--primary-color",
    "--x",
    "--fontSize",
    "--THEME_value",
    "--my_var-1",
    "--A1",
    "--header_token",
    "--alpha123",
    "--a_b_c",
    "--Z-9",
    "--color_dark-mode",
    "--Main_Content_V1",
  ];

  toJS() {
    return this.text;
  }
}
window.$VARIABLE = $VARIABLE;

// ---------------- VALUE GROUP ----------------
class $STYLE_VALUE_GROUP extends $STYLE_AST {
  static allowIncompleteParse = true;
  static incompleteParseThreshold = 1;
  static SHAPE = new Shape(
    `(`,

    [$VARIABLE, $STRING_STYLE, $HEX_COLOR, $MEASUREMENT, $IDENTIFIER_STYLE],
    { min: 0, max: Infinity },

    `)`
  );
  static SAMPLES = [
    `(a)`,
    `(\na\n)`,
    `(a b c)`,
    `(--main-color)`,
    `(--theme1 --theme2 --theme-3)`,
    `(--var1 "fallback")`,
    `(100px)`,
    `(1.5em 2rem 0)`,
    `(#fff)`,
    `(#123456 --shadow-color)`,
    `(var1 var2 "a string" 10px #abc)`,
    `(--header-font "Roboto" 16px)`,
    `(--bg-color #f0f0f0 "fallback" 100%)`,

    // With more formatting and whitespace
    `(\n  --color \n  #000\n  "text" \n)`,

    // INCOMPLETE / malformed (allowed due to `allowIncompleteParse`)
    `(`,
    `(--something`,
    `(100px "hello"`,
  ];

  toJS() {
    return this.text.slice(1, -1);
  }
}
window.$STYLE_VALUE_GROUP = $STYLE_VALUE_GROUP;

// ---------------- MULTIPLICITIVE ----------------
class $MULTIPLICATIVE_STYLE extends $STYLE_AST {
  static allowIncompleteParse = true;
  static incompleteParseThreshold = 2;
  static SHAPE = new Shape(
    [
      () => $FUN_CALL_STYLE,
      $HEX_COLOR,
      $STRING_STYLE,
      $VARIABLE,
      $IDENTIFIER_STYLE,
      $MEASUREMENT,
    ],

    /^(\/(?!=|\/)|\*(?!=))/,

    this
  );
  static SAMPLES = [
    // DIVIDE
    `a/b`,
    `a /b`,
    `a/ b`,
    `a / b`,
    `a\n/\nb`,
    `a/b/c`,

    // MULTIPLY
    `a*b`,
    `a *b`,
    `a* b`,
    `a * b`,
    `a\n*\nb`,
    `a*b*c`,

    // INCOMPLETE
    `a*`,
  ];

  get left() {
    return this.contentExps[0];
  }
  get op() {
    return this.contentExps[1];
  }
  get right() {
    return this.contentExps[2];
  }

  toJS() {
    return `${this.left.toJS()} ${this.op.text} ${this.right?.toJS()}`;
  }
}
window.$MULTIPLICATIVE_STYLE = $MULTIPLICATIVE_STYLE;

// ---------------- ADDITIVE ----------------
class $ADDITIVE_STYLE extends $STYLE_AST {
  static allowIncompleteParse = true;
  static incompleteParseThreshold = 2;
  static SHAPE = new Shape(
    $MULTIPLICATIVE_STYLE,

    /^(-(?!=|-)|\+(?!=|\+))/,

    this
  );
  static SAMPLES = [
    // SUBTRACT
    `a - b`,
    `a\n-\nb`,
    `a - b - c`,

    // ADD
    `a+b`,
    `a +b`,
    `a+ b`,
    `a + b`,
    `a\n+\nb`,
    `a+b+c`,

    // ORDER OF OPERATIONS
    `a + b * c`,

    // INCOMPLETE
    `a+`,
  ];

  get left() {
    return this.contentExps[0];
  }
  get op() {
    return this.contentExps[1];
  }
  get right() {
    return this.contentExps[2];
  }

  toJS() {
    return `${this.left.toJS()} ${this.op.text} ${this.right?.toJS()}`;
  }
}
window.$ADDITIVE_STYLE = $ADDITIVE_STYLE;

// ---------------- FUN_CALL ----------------

class $FUN_CALL_STYLE extends $STYLE_AST {
  static allowIncompleteParse = true;
  static incompleteParseThreshold = 2;
  static SHAPE = new Shape(
    $IDENTIFIER_STYLE,

    `(`,

    new Shape(
      [
        $ADDITIVE_STYLE,
        $MULTIPLICATIVE_STYLE,
        $FUN_CALL_STYLE,
        $VARIABLE,
        $IDENTIFIER_STYLE,
        $STRING_STYLE,
        $HEX_COLOR,
        $MEASUREMENT,
        $STYLE_VALUE_GROUP,
      ],
      `,`,
      { min: 0 }
    ),
    { min: 0, max: Infinity },

    `)`
  );
  static SAMPLES = [
    `a()`,
    `a(b)`,
    `a(b, c, d)`,
    `calc(a - b)`,
    `calc(a - calc(b * c))`,
    `calc(20% + 50px / 200rem)`,

    // INCOMPLETE
    `a(`,
  ];

  get left() {
    return this.contentExps[0];
  }
  get args() {
    return this.contentExps.slice(2, -1);
  }

  toJS() {
    return `${this.left.toJS()}(${this.args
      .map((a) => (a.AST ? a.toJS() : a.text))
      .join("")})`;
  }
}
window.$FUN_CALL_STYLE = $FUN_CALL_STYLE;

// ---------------- ATTRIBUTE_STYLE ----------------
class $ATTRIBUTE_STYLE extends $STYLE_AST {
  static allowIncompleteParse = true;
  static incompleteParseThreshold = 2;

  static SHAPE = new Shape(
    $IDENTIFIER_STYLE,

    ":",

    [() => $ATTRIBUTE_STYLE_NESTED, $STYLE_VALUE]
  );
  static SAMPLES = [
    `a:b`,
    `a:space-between`,
    "a:w:#000",
    "m:(1rem 2rem)",
    "w:calc(100% - 10px)",
  ];

  get fieldNames() {
    return this.contentExps.slice(0, -1).filter((exp) => exp.text !== ":");
  }

  get value() {
    return this.contentExps.at(-1);
  }

  toJS() {
    let result = ``;
    const value = this.value.toJS ? this.value.toJS() : this.value.text;
    this.fieldNames.forEach((shortNameExp) => {
      const shortName = shortNameExp.text;
      const cssName = ABBREVIATIONS[shortName];
      result += `${cssName}: ${value.trim()}\n`;
    });
    return result;
  }
}
window.$ATTRIBUTE_STYLE = $ATTRIBUTE_STYLE;

class $ATTRIBUTE_STYLE_NESTED extends $ATTRIBUTE_STYLE {
  static fallbackToFirstExp = false;
}

class $ANIMATION_STEP extends $STYLE_AST {
  static SHAPE = new Shape(
    "|",

    [$MEASUREMENT, $IDENTIFIER_STYLE],

    "|",

    $ATTRIBUTE_STYLE,
    {
      min: 1,
      max: Infinity,
    }
  );

  static SAMPLES = [`|from| w:10px h:20px`];

  get step() {
    return this.contentExps[1];
  }
  get attributes() {
    return this.contentExps.slice(3);
  }

  toJS() {
    return `${this.step.text} {
${this.attributes.reduce((acc, attr) => acc + `${attr.toJS()}`, "")}
}`;
  }
}
window.$ANIMATION_STEP = $ANIMATION_STEP;

class $ANIMATION extends $STYLE_AST {
  static allowIncompleteParse = false;
  // static incompleteParseThreshold = 2;

  static SHAPE = new Shape(
    [$MEASUREMENT, $IDENTIFIER_STYLE, $VARIABLE],
    {
      min: 1,
      max: Infinity,
    },

    $ANIMATION_STEP,
    { min: 1, max: Infinity }
  );
  static SAMPLES = [
    `2s |to| absolute`,
    // `2s ease-in-out 1s infinite alternate both
    //   |from| w:10px
    //   |50%| bg:red
    //   |to| w:20px`,
  ];

  get attributes() {
    const indexOfFirstStep = this.contentExps.findIndex(
      (exp) => exp instanceof $ANIMATION_STEP
    );
    return this.contentExps.slice(0, indexOfFirstStep);
  }

  get steps() {
    return this.contentExps.filter((exp) => exp instanceof $ANIMATION_STEP);
  }

  toJS() {
    return (
      this.attributes.reduce((acc, attr) => acc + attr.toJS(), "") +
      "\n" +
      this.steps.reduce((acc, step) => acc + step.toJS() + "\n", "")
    );
  }
}
window.$ANIMATION = $ANIMATION;

$STYLE_VALUE.SHAPE = new Shape([$STYLE_VALUE_GROUP, $ADDITIVE_STYLE]);

// ---------------- DOM ----------------

Object.defineProperty(HTMLStyleElement.prototype, "addDynamicClass", {
  value: function (style, opts = {}) {
    style = style.toString();
    const { pseudo, media } = opts;

    let className = `s${useId()}`;
    if (pseudo) className += `:${pseudo}`;
    const startDelimeter = `/*---- START ${className} ----*/`;
    const endDelimeter = `/*---- END ${className} ----*/\n`;
    let styleAST = $STYLE_AST.parse(new Lexer(style));

    const renderClass = () => {
      if (media) {
        const [shorthand, value] = media;
        const attribute = ABBREVIATIONS[shorthand];
        return `${startDelimeter}
@media (${attribute}: ${value}){
  .${className} {
${styleAST.toJS()}
  }
}
${endDelimeter}`;
      } else
        return `${startDelimeter}
.${className} {
${styleAST.toJS()}
}
${endDelimeter}`;
    };

    this.textContent += renderClass();

    const update = (newStyle) => {
      newStyle = newStyle.toString();
      styleAST = $STYLE_AST.parse(new Lexer(newStyle));
      const startIndex = this.textContent.indexOf(startDelimeter);
      const endIndex = this.textContent.indexOf(endDelimeter);

      this.textContent =
        this.textContent.slice(0, startIndex) +
        renderClass() +
        this.textContent.slice(endIndex + endDelimeter.length);
    };
    return [className, update];
  },
  enumerable: false,
});

Object.defineProperty(HTMLStyleElement.prototype, "addDynamicAnimation", {
  value: function (animation, opts = {}) {
    const { pseudo, media } = opts;
    let animationAST = $ANIMATION.parse(new Lexer(animation));

    let className = `s${useId()}`;
    if (pseudo) className += `:${pseudo}`;
    const startDelimeter = `/*---- START ${className} ----*/`;
    const endDelimeter = `/*---- END ${className} ----*/\n`;

    let animationName = `a${useId()}`;

    const renderKeyframes = () => {
      return `${startDelimeter}
@keyframes ${animationName} {
  ${animationAST.toJS().split("\n").slice(1).join("\n")}
}
`;
    };

    const renderClass = () => {
      if (media) {
        const [shorthand, value] = media;
        const attribute = ABBREVIATIONS[shorthand];
        return `
@media (${attribute}: ${value}){
  .${className} {
animation: ${animationName} ${animationAST.toJS().split("\n")[0]};
  }
}
${endDelimeter}`;
      } else
        return `
.${className} {
animation: ${animationName} ${animationAST.toJS().split("\n")[0]};
}
${endDelimeter}
`;
    };

    this.textContent += renderKeyframes() + renderClass();

    const update = (newAnimation) => {
      animationAST = $ANIMATION.parse(new Lexer(newAnimation));
      const startIndex = this.textContent.indexOf(startDelimeter);
      const endIndex = this.textContent.indexOf(endDelimeter);

      this.textContent =
        this.textContent.slice(0, startIndex) +
        renderKeyframes() +
        renderClass() +
        this.textContent.slice(endIndex + endDelimeter.length);
    };

    return [className, animationName, update];
  },
  enumerable: false,
});

Object.defineProperty(Element.prototype, "addDynamicStyle", {
  value: function (shortAttributes, valueFn) {
    shortAttributes = asArray(shortAttributes);
    shortAttributes.forEach((shortAttribute) => {
      const attribute = ABBREVIATIONS[shortAttribute];
      this.style[attribute] = asFunctionResult(valueFn);
      this.Effect(() => {
        this.style[attribute] = asFunctionResult(valueFn);
      });
    });
  },
  enumerable: false,
});
