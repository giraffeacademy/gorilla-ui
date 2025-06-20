let _id = 1;
window.useId = () => _id++;

window.asArray = (_) => {
  if (Array.isArray(_)) return _;
  else if (_ !== undefined) return [_];
  else return [];
};

window.asFunctionResult = (value, ...args) => {
  if (typeof value === "function" && !/^class\s/.test(value.toString()))
    return value(...args);
  return value;
};

Object.defineProperty(Object.prototype, "hasAnyOwnProperty", {
  value: function (...keys) {
    return keys.some((key) => this.hasOwnProperty(key));
  },
  enumerable: false,
});

window.asFunction = function (input) {
  if (typeof input === "function") return input;
  else return () => input;
};

Object.defineProperty(String.prototype, "count", {
  value: function (substr) {
    const escaped = substr.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    return (this.match(new RegExp(escaped, "g")) || []).length;
  },
  enumerable: false,
});

// DOM Lifecycle Events
new MutationObserver((mutations) => {
  mutations.forEach((m) => {
    if (m.type === "childList") {
      const cascadeEvent = (node, event) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return;

        const isMount = event === "mount";

        if (node.__mounted === isMount) return; // Skip if already in that state
        node.__mounted = isMount;

        node.dispatchEvent(new CustomEvent(event, { bubbles: false }));

        if (node.children) {
          for (const child of node.children) {
            cascadeEvent(child, event);
          }
        }
      };

      for (const node of m.addedNodes) {
        cascadeEvent(node, "mount");
      }

      if (m.addedNodes.length) {
        m.target.dispatchEvent(
          new CustomEvent("childadd", {
            bubbles: true,
            detail: { child: [...m.addedNodes] },
          })
        );
      }

      for (const node of m.removedNodes) {
        cascadeEvent(node, "unmount");
      }

      if (m.removedNodes.length) {
        m.target.dispatchEvent(
          new CustomEvent("childremove", {
            bubbles: true,
            detail: { child: m.removedNodes[0] },
          })
        );
      }
    } else if (m.type === "characterData" && m.target.parentElement) {
      m.target.parentElement.dispatchEvent(
        new CustomEvent("textchange", {
          bubbles: true,
          detail: { textNode: m.target, action: "change" },
        })
      );
    } else if (m.type === "attributes") {
      m.target.dispatchEvent(
        new CustomEvent("attrchange", {
          bubbles: true,
          detail: {
            attributeName: m.attributeName,
            oldValue: m.oldValue,
            newValue: m.target.getAttribute(m.attributeName),
          },
        })
      );
    }
  });
}).observe(document, {
  childList: true,
  characterData: true,
  subtree: true,
  attributes: true,
  attributeOldValue: true,
});
