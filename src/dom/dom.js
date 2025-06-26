const GLOBAL_STYLE = document.createElement("style");
document.head.append(GLOBAL_STYLE);

// prettier-ignore
window.DOM_ATTRIBUTES = {
    // General/global attributes
    accessKey: "string",         // Keyboard shortcut for the element
    autocapitalize: "string",    // Controls text auto-capitalization
    className: "string",         // CSS class names
    contentEditable: "string",   // Whether the element is editable
    dir: "string",               // Text direction (e.g. 'ltr', 'rtl')
    draggable: "boolean",        // Whether the element can be dragged
    hidden: "boolean",           // Hides the element from rendering
    id: "string",                // Unique identifier
    innerText: "string",         // Visible text content
    lang: "string",              // Language of the element's content
    offsetHeight: "number",      // Height including padding/borders (read-only)
    offsetWidth: "number",       // Width including padding/borders (read-only)
    role: "string",              // ARIA accessibility role
    spellcheck: "boolean",       // Enables spell checking
    style: "object",             // Inline CSS styles (CSSStyleDeclaration)
    tabIndex: "number",          // Tab order for keyboard navigation
    title: "string",             // Tooltip text
    translate: "boolean",        // Whether the content is translatable
    innerHTML: "string",         // HTML inside the element
    outerHTML: "string",         // Full HTML of the element including itself
    textContent: "string",       // Raw text content
  
    // Form-related
    name: "string",              // Form field name
    value: "string",             // Current value of the input
    type: "string",              // Type of input (e.g. text, checkbox)
    disabled: "boolean",         // Disables user interaction
    checked: "boolean",          // Checked state (checkbox/radio)
    placeholder: "string",       // Placeholder text
    required: "boolean",         // Marks field as required
    readOnly: "boolean",         // Prevents editing
    min: "string",               // Minimum value constraint
    max: "string",               // Maximum value constraint
    step: "string",              // Value granularity
    pattern: "string",           // Regex pattern constraint
    multiple: "boolean",         // Allows multiple selections
    size: "number",              // Number of visible options (e.g. <select>)
  
    // Media
    src: "string",               // Media source URL
    alt: "string",               // Alternate text (images)
    width: "number",             // Display width
    height: "number",            // Display height
    poster: "string",            // Preview image for videos
    controls: "boolean",         // Shows media controls
    autoplay: "boolean",         // Auto-start playback
    loop: "boolean",             // Repeat playback
    muted: "boolean",            // Mute audio
    preload: "string",           // Preload behavior
    playsInline: "boolean",      // Plays video inline on mobile
  
    // Links and navigation
    href: "string",              // Link destination
    target: "string",            // Link target context (_blank, _self, etc.)
    rel: "string",               // Relationship between documents
    download: "string",          // Prompts file download
    hreflang: "string",          // Language of the linked document
    referrerPolicy: "string",    // Referrer policy for links
  
    // Meta
    content: "string",           // Metadata value
    httpEquiv: "string",         // Meta HTTP header equivalent
    charset: "string",           // Document character encoding
    // name already declared above, same type
  
    // Data attributes
    dataset: "object",           // Access to data-* attributes (DOMStringMap)
  
    // Input constraints
    form: "object",              // Associated form element (HTMLFormElement or null)
    formAction: "string",        // Submission URL for buttons
    formMethod: "string",        // HTTP method used for form
    formNoValidate: "boolean",   // Bypasses form validation
    formTarget: "string",        // Target window for form result
  
    // ARIA attributes
    ariaLabel: "string",         // ARIA label for accessibility
    ariaHidden: "string",        // Hides from assistive tech
    ariaRole: "string",          // Defines ARIA role
    ariaChecked: "string"        // Checkbox/radio checked state for ARIA
  };
// prettier-ignore
window.DOM_EVENTS = {
    // Mouse Events
    click: MouseEvent,              // Mouse button click
    dblclick: MouseEvent,           // Double click
    mousedown: MouseEvent,          // Mouse button pressed
    mouseup: MouseEvent,            // Mouse button released
    mouseenter: MouseEvent,         // Pointer enters element (no bubbling)
    mouseleave: MouseEvent,         // Pointer leaves element (no bubbling)
    mouseover: MouseEvent,          // Pointer moves onto element or child
    mouseout: MouseEvent,           // Pointer moves off element or child
    mousemove: MouseEvent,          // Pointer moves within the element
    contextmenu: MouseEvent,        // Right-click context menu
  
    // Keyboard Events
    keydown: KeyboardEvent,         // Key is pressed down
    keyup: KeyboardEvent,           // Key is released
    keypress: KeyboardEvent,        // (Deprecated) Key is pressed (printable chars only)
  
    // Form Events
    submit: Event,                  // Form is submitted
    reset: Event,                   // Form is reset
    input: Event,                   // Input value changes (real-time)
    change: Event,                  // Input value committed
    focus: Event,                   // Element gains focus (no bubbling)
    blur: Event,                    // Element loses focus (no bubbling)
    focusin: Event,                 // Focus enters an element (bubbles)
    focusout: Event,                // Focus leaves an element (bubbles)
  
    // Clipboard Events
    copy: ClipboardEvent,           // Copy operation initiated
    cut: ClipboardEvent,            // Cut operation initiated
    paste: ClipboardEvent,          // Paste operation initiated
  
    // Drag & Drop Events
    drag: DragEvent,                // Element is being dragged
    dragstart: DragEvent,           // Dragging begins
    dragend: DragEvent,             // Dragging ends
    dragenter: DragEvent,           // Drag enters drop zone
    dragleave: DragEvent,           // Drag leaves drop zone
    dragover: DragEvent,            // Drag is over drop zone
    drop: DragEvent,                // Element is dropped
  
    // Media Events
    play: Event,                    // Playback starts
    pause: Event,                   // Playback pauses
    ended: Event,                   // Playback finishes
    volumechange: Event,            // Volume is changed
    timeupdate: Event,              // Playback time updated
    durationchange: Event,          // Media duration changes
    loadedmetadata: Event,          // Metadata is loaded
    loadeddata: Event,              // Media data is loaded
    canplay: Event,                 // Media is ready to play
    canplaythrough: Event,          // Media can play through without buffering
    seeking: Event,                 // Seeking starts
    seeked: Event,                  // Seeking ends
    stalled: Event,                 // Media fetch stalled
    waiting: Event,                 // Media is buffering
  
    // Animation & Transition Events
    animationstart: AnimationEvent,     // CSS animation starts
    animationend: AnimationEvent,       // CSS animation ends
    animationiteration: AnimationEvent, // CSS animation iteration
    animationcancel: AnimationEvent,    // CSS animation canceled
    transitionstart: TransitionEvent,   // CSS transition starts
    transitionend: TransitionEvent,     // CSS transition ends
    transitionrun: TransitionEvent,     // CSS transition running
    transitioncancel: TransitionEvent,  // CSS transition canceled
  
    // Window Events
    resize: UIEvent,               // Window resized
    scroll: Event,                 // Document is scrolled
    load: Event,                   // Page or resource loaded
    unload: Event,                 // Page is unloaded
    beforeunload: Event,           // Before page unloads
    error: Event,                  // Error occurred
    hashchange: HashChangeEvent,   // URL hash changed
    popstate: PopStateEvent,       // History entry changed
  
    // Touch Events
    touchstart: TouchEvent,        // Finger touches screen
    touchmove: TouchEvent,         // Finger moves on screen
    touchend: TouchEvent,          // Finger lifted from screen
    touchcancel: TouchEvent,       // Touch interrupted (e.g., OS switch)
  
    // Pointer Events
    pointerdown: PointerEvent,         // Pointer is pressed
    pointerup: PointerEvent,           // Pointer is released
    pointermove: PointerEvent,         // Pointer moves
    pointerover: PointerEvent,         // Pointer moves onto element
    pointerout: PointerEvent,          // Pointer moves off element
    pointerenter: PointerEvent,        // Pointer enters element (no bubbling)
    pointerleave: PointerEvent,        // Pointer leaves element (no bubbling)
    gotpointercapture: PointerEvent,   // Element captures pointer
    lostpointercapture: PointerEvent,  // Element loses pointer capture
  
    // Other Events
    wheel: WheelEvent,             // Mouse wheel scroll
    fullscreenchange: Event,       // Fullscreen mode toggled
    visibilitychange: Event        // Page visibility changed
  };

const STYLE_CACHE = {};
const ANIMATION_CACHE = {};

Object.defineProperty(Element.prototype, "addProps", {
  value: function (props = {}) {
    Object.entries(props).forEach(([attr, value]) => {
      if (
        attr === "s" ||
        attr.startsWith("_s") ||
        attr.startsWith("__s") ||
        attr.startsWith("s_")
      ) {
        if (attr.startsWith(`s_`) && !attr.startsWith("s__")) {
          const styleShorts = attr.split("_").slice(1);
          this.addDynamicStyle(styleShorts, value);
          return;
        }

        let pseudo;
        if (attr.startsWith("_s")) pseudo = "hover";
        if (attr.startsWith("__s")) pseudo = "focus";

        let media;
        if (attr.startsWith("s__")) media = attr.split("__")[1].split("_");

        const styles = asArray(value);
        styles.forEach((style) => {
          const cacheKey = `${attr}_${asFunctionResult(style)}`;

          let className = STYLE_CACHE[cacheKey];

          if (!className) {
            const [_className, update] = GLOBAL_STYLE.addDynamicClass(
              asFunctionResult(style),
              {
                pseudo,
                media,
              }
            );

            if (typeof style === "function") this.Effect(() => update(style()));
            className = _className;
            STYLE_CACHE[cacheKey] = className;
          }

          this.classList.add(className.split(":")[0]);
        });
        return;
      }

      if (
        attr === "a" ||
        attr.startsWith("_a") ||
        attr.startsWith("__a") ||
        attr.startsWith("a_")
      ) {
        let pseudo;
        if (attr.startsWith("_a")) pseudo = "hover";
        if (attr.startsWith("__a")) pseudo = "focus";

        let media;
        if (attr.startsWith("a__")) media = attr.split("__")[1].split("_");

        const animations = asArray(value);

        animations.forEach((animation) => {
          const cacheKey = `${asFunctionResult(animation)}`;
          let className = ANIMATION_CACHE[cacheKey];

          if (!className) {
            const [_className, _animationName, update] =
              GLOBAL_STYLE.addDynamicAnimation(asFunctionResult(animation), {
                pseudo,
                media,
              });
            if (typeof animation === "function")
              this.Effect(() => update(animation()));

            className = _className;
            ANIMATION_CACHE[cacheKey] = className;
          }
          this.classList.add(className.split(":")[0]);
        });

        return;
      }

      attr.split("_").forEach((attr) => {
        if (typeof value === "function" && attr === "class") {
          let currentClasses = [];
          const unsub = new Effect(() => {
            currentClasses.forEach((className) =>
              this.classList.remove(className)
            );
            currentClasses = value().split(/\s+/);
            Effect.Root(() =>
              this.addProps({ class: currentClasses.join(" ") })
            );
          });
          this.addEventListener("unmount", () => unsub());
        } else if (attr.startsWith(`on`)) {
          this.addEventListener(attr.slice(2), value);
        } else if (typeof value === "function") {
          const unsub = new Effect(() => {
            this[attr] = value();
          });
          this.addEventListener("unmount", () => unsub());
        } else if (attr === "class") {
          this.classList.add(...value.split(/\s+/));
        } else if (attr === "effects") {
          this.addEventListener("mount", () =>
            asArray(value).forEach((fn) => this.Effect((i) => fn(i, this)))
          );
        } else {
          if (DOM_ATTRIBUTES[attr]) this.setAttribute(attr, value);
          this[attr] = value;
        }
      });
    });
  },
  enumerable: false,
});

Object.defineProperty(Node.prototype, "Effect", {
  value: function (fn) {
    const unsub = new Effect(fn);
    this.addEventListener("unmount", unsub);

    return unsub;
  },
  enumerable: false,
});

Object.defineProperty(Node, "from", {
  value: function (source) {
    if (source instanceof Node) return source;

    // FALSEY
    if ([undefined, null, false].includes(source))
      return document.createTextNode("");

    // ARRAY
    if (Array.isArray(source)) {
      const frag = document.createDocumentFragment();
      frag.append(...source.map(Node.from));
      return frag;
    }

    if (source instanceof Set) return Node.list(...source);

    // OBJECT
    if (typeof source === "object")
      return document.createTextNode(JSON.stringify(source, null, 4));

    // DYNAMIC FUNCTIONS
    if (typeof source === "function") {
      let frag = document.createDocumentFragment();
      let start = document.createComment("");
      let end = document.createComment("");
      frag.append(start, end);

      const cleanup = new Effect((i) => {
        if (i > 0 && !document.contains(start)) return cleanup();
        while (start.nextSibling !== end) start.nextSibling.remove();
        start.after(...asArray(Node.from(source())));
      });
      return frag;
    }

    // EVERYTHING ELSE
    return document.createTextNode(source.toString());
  },
  enumerable: false,
});

Object.defineProperty(Node, "list", {
  value: function (list, itemFn) {
    const frag = document.createDocumentFragment();
    const start = document.createComment("");
    const end = document.createComment("");
    frag.append(start, end);

    const cleanup = new Effect((i) => {
      if (i > 0 && !document.contains(start)) return cleanup();

      const items = typeof list === "function" ? list() : list;

      // collect current DOM nodes between markers
      const activeNodes = [];
      let node = start.nextSibling;
      while (node !== end) {
        activeNodes.push(node);
        node = node.nextSibling;
      }

      for (let i = 0; i < Math.max(activeNodes.length, items.length); i++) {
        const item = items[i];
        let current = activeNodes[i];

        if (item && current) {
          if (item !== current.__listItem) {
            const newNode = Node.from(itemFn(item, i, items));
            newNode.__listItem = item;
            current.replaceWith(newNode);
            activeNodes[i] = newNode;
          }
        } else if (item && !current) {
          const newNode = Node.from(itemFn(item, i - 1, items));
          newNode.__listItem = item;
          end.before(newNode);
          activeNodes[i] = newNode;
        } else if (!item && current) {
          current.remove();
          activeNodes.splice(i, 1);
          i--; // re-check this index after removal
        }
      }
    });

    return frag;
  },
  enumerable: false,
});

Object.defineProperty(Element, "create", {
  value: function (type, props = {}, ...children) {
    let el;

    // FRAGMENT
    if (type === undefined) {
      el = document.createDocumentFragment();
      el.append(...children.map(Node.from));
      return el;
    }

    // FALSEY
    if (!type) return document.createTextNode("");

    // DYNAMIC ELEMENT
    if (typeof type === "function") {
      return Effect.Root(() => Node.from(type(props || {}, ...children)));
    }

    // DYNAMIC LIST
    if (type === "list") {
      return Node.list(props._, children[0]);
    }

    el = document.createElement(type);
    if (el instanceof HTMLUnknownElement) {
      el = document.createElement(type.slice(-1) === "_" ? "span" : "div");
      el.name = type.replace(/_$/g, "");
      el.setAttribute("name", el.name);
    }
    el.addProps(props || {});
    el.append(...children.map(Node.from));
    return el;
  },
  enumerable: false,
});
window.React = { createElement: Element.create };
