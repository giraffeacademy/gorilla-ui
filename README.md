# 🦍 Gorilla UI

**Gorilla UI** is a lightweight, expressive UI framework for the modern web. It lets you build interfaces with just JavaScript and JSX — no build tools or virtual DOMs required. It’s reactive, declarative, and directly manipulates real DOM elements.

---

## What Is a UI Framework?

A **UI framework** helps developers build interactive, stateful web interfaces more easily. Instead of manually updating the DOM when data changes, a framework handles these updates automatically. This lets you focus on how your app should look and behave — not how to wire everything together by hand.

Gorilla UI provides:

- A JSX-based syntax for composing UI
- Built-in reactivity with `Make(...)` proxies
- Automatic DOM updates when data changes
- A custom style language with shorthands and responsive features
- Descriptive tag names and direct DOM integration (no virtual DOM)

---

## Why Gorilla UI?

Unlike many UI frameworks that use a virtual DOM or runtime diffing engine, Gorilla UI works **directly with real DOM elements**. It’s designed for simplicity and performance:

- No React, Vue, or build step required
- `Make()` creates reactive state objects
- JSX tags are turned into actual DOM nodes
- Descriptive, semantic element names are encouraged (use `_` to separate words)
- Custom `s` style prop supports inline shorthands, dynamic expressions, animations, media queries, and pseudo styles

Gorilla UI overrides `window.React.createElement` at the global level — it’s not compatible with React or other JSX-based libraries that expect a virtual DOM.

---

## Core Features

### ✅ 1. Reactive State with `Make`

Gorilla UI uses `Make` to create observable data:

```js
const state = Make({ count: 0 });
```

You can bind any part of the UI to this state using an arrow function:

```jsx
<counter>{() => state.count}</counter>
```

When `state.count` changes, the UI updates automatically.

---

### ✅ 2. JSX + Real DOM

JSX is fully supported — but instead of mapping to React components, tags are turned into real DOM elements. Custom tag names are allowed:

```jsx
<my_component>Hi!</my_component>
```

Multi-word names use underscores (`_`) and are created as-is in the DOM.

---

### ✅ 3. Style with the `s` Prop

The `s` prop is a mini style language that supports:

- Abbreviated CSS properties (e.g. `fc` → `color`)
- Shorthands (e.g. `flex`, `row`, `col`)
- Media queries (`s__400px`)
- Hover/focus styles (`_s`, `__s`)
- Dynamic styles (`s_fc={() => state.active ? "red" : "gray"}`)

Example:

```jsx
<button s="flex a:center bg:salmon fc:white r:.25em">Click Me</button>
```

More on styling later on in the document!

---

### ✅ 4. Auto-Binding Events and Attributes

Any standard DOM attribute or event works:

```jsx
<input
  placeholder="Enter text"
  value={() => state.text}
  oninput={(e) => (state.text = e.target.value)}
/>
```

Functions passed to attributes will re-run reactively.

---

### ✅ 5. Built-in Animation Support

Gorilla UI also supports animated styles and transitions using the `a`, `_a`, and `__a` props.

---

### ✅ 6. No Build Step

Just include your script and JSX runtime (via Babel or your preferred JSX setup). Gorilla UI runs directly in the browser.

---

## Next Steps

Ready to build? Let’s start with two interactive examples:

- A simple counter
- A reactive todo list

---

# Tutorial: Building a Counter with Gorilla UI

Let’s walk through how to build a simple reactive counter using Gorilla UI.

---

## Step 0: Installation

To install Gorilla UI use npm or your preferred package manager:

```
npm install gorilla-ui
```

Then simply import it into whatever file you're using

```
import "gorilla-ui
```

Note that Gorilla UI adds several fields and variables to the global window, this is part of it's design philosophy around ease of use and allows for a native like feel.

## Step 1: Create Reactive State with `Make`

Gorilla UI uses a function called `Make` to create reactive state objects. You can think of it like `useState`, but simpler and more powerful.

Start by initializing the counter state:

```js
const _ = Make({ count: 0 });
```

Here, `_` is just a convention — it's a plain JavaScript object, but wrapped in a proxy so that any changes to `_.count` automatically update the UI.

---

## Step 2: Define the Counter Component

Gorilla UI components are plain functions that return JSX. You can use any tag names you like — even custom ones like `<counter>` or `<display>`.

```js
const Counter = () => {
  const _ = Make({ count: 0 });

  return (
    <counter s="flex a:center">
      <display s="mr:.25em">{() => _.count}</display>
      <button s="bg:salmon r:.25em fc:white" onclick={() => _.count++}>
        +1
      </button>
    </counter>
  );
};
```

Let’s break this down:

- `<counter>` and `<display>` are valid tag names — Gorilla UI creates them as real DOM nodes.
- `{() => _.count}` is a reactive expression — the `display` element will update any time `_.count` changes.
- The `button` increments the count on click.
- Styles are added using the `s` prop. For example, `s="bg:salmon r:.25em fc:white"` sets the background, border radius, and font color (see style section for full documentation on available shorthands).

---

## Step 3: Render the Component

To show the counter on the page, append it directly to the DOM:

```js
document.body.append(<Counter />);
```

That’s it! No virtual DOM. No render loop. Just plain DOM + reactive state.

---

## Full Example

```js
const Counter = () => {
  const _ = Make({ count: 0 });

  return (
    <counter s="flex a:center">
      <display s="mr:.25em">{() => _.count}</display>
      <button s="bg:salmon r:.25em fc:white" onclick={() => _.count++}>
        +1
      </button>
    </counter>
  );
};

document.body.append(<Counter />);
```

---

## What Happens Under the Hood

- When the component renders, Gorilla UI creates real DOM elements (`<counter>`, `<display>`, `<button>`)
- It assigns the reactive function `{() => _.count}` to the text content of `<display>`. This function is tracked and rerun automatically whenever `_.count` changes.
- When the button is clicked, `_.count++` triggers the reactive system.
- Gorilla UI re-evaluates the function bound to `<display>` and updates the DOM.

---

## Summary

In just a few lines of code, you built a fully reactive UI with:

- Descriptive JSX tags
- Automatic state tracking
- Dynamic styling
- No external libraries or virtual DOM

Next up, try building a dynamic list with user input and checkboxes using the same techniques — just like a Todo app.

---

# Tutorial: Building a Todo List with Gorilla UI

In this tutorial, we’ll build a fully reactive **Todo List** using Gorilla UI. You’ll learn how to:

- Create a reactive list of items
- Handle user input
- Reactively update styles and checkboxes
- Render dynamic components from an array

Let’s get started.

---

## Step 1: Set Up the Component Structure

Start by creating a function called `TodoList`. This will be your component.

```js
const TodoList = () => {
  // We'll add our state and UI inside here
};
```

---

## Step 2: Create a Reactive Array of Todos

Inside the component, we’ll define an array of todos using `Make(...)`. Each item is also a reactive object.

```js
const todos = Make([
  Make({ title: "Walk dog", isComplete: false }),
  Make({ title: "Take out trash", isComplete: true }),
  Make({ title: "Do dishes", isComplete: false }),
]);
```

Explanation:

- `Make([...])` wraps the array so it becomes reactive.
- Each `Make({ ... })` wraps a todo item in a reactive object.
- If we change `todo.isComplete`, the UI will automatically update anywhere that uses that value.

---

## Step 3: Add a Styled Container

Now let’s return some JSX from the component. We’ll start with a root container that has a vertical layout and padding.

```js
return (
  <todo_list s="flex col p:1em b:(.25em solid black) r:1em">
    {/* UI will go here */}
  </todo_list>
);
```

Here, `s="..."` applies styling using Gorilla UI’s style language:

- `flex col`: flexbox layout in column direction
- `p:1em`: padding
- `b:(...)`: a full border definition
- `r:1em`: border-radius

---

## Step 4: Add an Input Field for New Todos

Next, let’s add an input box that lets users type in new tasks and press Enter to add them.

```js
<input
  placeholder="Enter new todo"
  onkeydown={(e) => {
    if (e.key === "Enter") {
      todos.push(Make({ title: e.target.value, isComplete: false }));
      e.target.value = "";
    }
  }}
  s="r:.25em ol:none bg:salmon fc:white"
/>
```

Explanation:

- When the user presses `Enter`, it creates a new reactive todo and pushes it into the `todos` array.
- The input field is then cleared.
- Styles:
  - `r:.25em`: rounded corners
  - `ol:none`: removes outline
  - `bg:salmon`: background color
  - `fc:white`: font color

---

## Step 5: Render the Todo Items

Below the input, we’ll render a list of todos. Use the special `<list>` component, which takes the reactive array via `_={todos}` and maps it to individual items.

```js
<list _={todos}>{(todo) => <todo>{todo.title}</todo>}</list>
```

This works like a reactive `map()` — when `todos` changes (like when we add an item), the list updates automatically. Note that `<list></list>` is a special reserved tag for doing exactly this.

---

## Step 6: Add Checkbox and Completion State

We want users to mark items as complete. Let’s enhance the inner part of the list like this:

```js
<todo>
  <input
    type="checkbox"
    checked={() => todo.isComplete}
    onclick={() => (todo.isComplete = !todo.isComplete)}
  />
  {todo.title} - {() => (todo.isComplete ? "complete" : "incomplete")}
</todo>
```

Explanation:

- `checked={() => todo.isComplete}`: reactive binding to checkbox state
- `onclick`: toggles `isComplete`
- We display whether the task is `"complete"` or `"incomplete"` reactively

---

## Step 7: Add Dynamic Styling

Let’s make the text turn green when a task is complete and red otherwise.

```js
<todo s_fc={() => (todo.isComplete ? "green" : "red")}>
```

- `s_fc={...}` sets the font color dynamically based on the todo’s state.
- You can replace `fc` with any other style abbreviation.

---

## Step 8: Final Component

Here’s the complete version now that we’ve built it step-by-step:

```js
const TodoList = () => {
  const todos = Make([
    Make({ title: "Walk dog", isComplete: false }),
    Make({ title: "Take out trash", isComplete: true }),
    Make({ title: "Do dishes", isComplete: false }),
  ]);

  return (
    <todo_list s="flex col p:1em b:(.25em solid black) r:1em">
      <input
        placeholder="Enter new todo"
        onkeydown={(e) => {
          if (e.key === "Enter") {
            todos.push(Make({ title: e.target.value, isComplete: false }));
            e.target.value = "";
          }
        }}
        s="r:.25em ol:none bg:salmon fc:white"
      />
      <list _={todos}>
        {(todo) => (
          <todo s_fc={() => (todo.isComplete ? "green" : "red")}>
            <input
              type="checkbox"
              checked={() => todo.isComplete}
              onclick={() => (todo.isComplete = !todo.isComplete)}
            />
            {todo.title} - {() => (todo.isComplete ? "complete" : "incomplete")}
          </todo>
        )}
      </list>
    </todo_list>
  );
};

document.body.append(<TodoList />);
```

---

## Summary

You’ve now built a reactive Todo List using:

- Reactive arrays and objects with `Make`
- Dynamic list rendering with `<list>`
- Reactive DOM updates using functions
- Conditional styling with `s_fc`
- Event handlers for user input

You wrote zero `render()` functions and no boilerplate — just clean, declarative UI.

---

# Style System Reference

Gorilla UI includes a built-in style DSL (Domain-Specific Language) that simplifies styling using the `s` prop and related attributes. This system supports:

- Abbreviations for common CSS properties
- Shorthand keywords (like `flex`, `row`, `bold`)
- Dynamic values via functions
- Pseudo styles (`_s`, `__s`)
- Media queries (`s__mobile`)
- Animations (`a`, `_a`, `__a`)

Below is the complete reference for all abbreviations and shorthands supported in Gorilla UI.

---

## Abbreviations

These map short keys to full CSS properties. You can use them in any `s`, `s_fc`, etc. style expression.

| Abbreviation | Property                   |
| ------------ | -------------------------- |
| w            | width                      |
| minw         | min-width                  |
| maxw         | max-width                  |
| h            | height                     |
| minh         | min-height                 |
| maxh         | max-height                 |
| m            | margin                     |
| ml           | margin-left                |
| mt           | margin-top                 |
| mr           | margin-right               |
| mb           | margin-bottom              |
| p            | padding                    |
| pl           | padding-left               |
| pt           | padding-top                |
| pr           | padding-right              |
| pb           | padding-bottom             |
| d            | display                    |
| b            | border                     |
| bc           | border-color               |
| bw           | border-width               |
| bs           | border-style               |
| bl           | border-left                |
| blc          | border-left-color          |
| blw          | border-left-width          |
| bls          | border-left-style          |
| bt           | border-top                 |
| btc          | border-top-color           |
| btw          | border-top-width           |
| bts          | border-top-style           |
| br           | border-right               |
| brc          | border-right-color         |
| brw          | border-right-width         |
| brs          | border-right-style         |
| bb           | border-bottom              |
| bbc          | border-bottom-color        |
| bbw          | border-bottom-width        |
| bbs          | border-bottom-style        |
| r            | border-radius              |
| rtl          | border-top-left-radius     |
| rtr          | border-top-right-radius    |
| rbr          | border-bottom-right-radius |
| rbl          | border-bottom-left-radius  |
| over         | overflow                   |
| overx        | overflow-x                 |
| overy        | overflow-y                 |
| o            | opacity                    |
| ol           | outline                    |
| sh           | box-shadow                 |
| c            | cursor                     |
| ct           | content                    |
| fc           | color (font color)         |
| fs           | font-size                  |
| ff           | font-family                |
| fw           | font-weight                |
| fd           | font-direction             |
| fsp          | font-spacing               |
| fst          | font-style                 |
| td           | text-decoration            |
| ta           | text-align                 |
| tdc          | text-decoration-color      |
| left         | left                       |
| top          | top                        |
| right        | right                      |
| bottom       | bottom                     |
| a            | align-items                |
| ac           | align-content              |
| j            | justify-content            |
| as           | align-self                 |
| fl           | flex                       |
| flg          | flex-grow                  |
| fls          | flex-shrink                |
| z            | z-index                    |
| bg           | background                 |
| t            | transition                 |
| tdl          | transition-delay           |
| tdr          | transition-duration        |
| tp           | transition-property        |
| ttf          | transition-timing-function |
| sel          | user-select                |
| tf           | transform                  |
| tfo          | transform-origin           |
| an           | animation                  |
| andel        | animation-delay            |
| andir        | animation-direction        |
| andur        | animation-duration         |
| anfm         | animation-fill-mode        |
| anic         | animation-iteration-count  |
| ann          | animation-name             |
| anps         | animation-play-state       |
| antf         | animation-timing-function  |
| v            | visibility                 |
| ws           | white-space                |
| wb           | word-break                 |
| ww           | word-wrap                  |
| ow           | overflow-wrap              |
| hy           | hyphens                    |
| lh           | line-height                |
| cc           | caret-color                |
| pe           | pointer-events             |
| ts           | text-shadow                |

---

## Shorthands

These expand to entire sets of styles or common patterns.

| Shorthand    | Expands To                     |
| ------------ | ------------------------------ |
| flex         | display: flex                  |
| block        | display: block                 |
| hide         | display: none                  |
| inline       | display: inline                |
| inlineb      | display: inline-block          |
| absolute     | position: absolute             |
| static       | position: static               |
| relative     | position: relative             |
| sticky       | position: sticky               |
| fixed        | position: fixed                |
| wrap         | flex-wrap: wrap                |
| wrapr        | flex-wrap: wrap-reverse        |
| row          | flex-direction: row            |
| rowr         | flex-direction: row-reverse    |
| col          | flex-direction: column         |
| colr         | flex-direction: column-reverse |
| bbox         | box-sizing: border-box         |
| italic       | font-style: italic             |
| bold         | font-weight: bold              |
| oblique      | font-style: oblique            |
| visible      | visibility: visible            |
| collapse     | visibility: collapse           |
| underline    | text-decoration: underline     |
| overline     | text-decoration: overline      |
| line-through | text-decoration: line-through  |
| blink        | text-decoration: blink         |

---

## Using Abbreviations and Shorthands

You can use any combination in the `s` prop:

```jsx
<box s="flex col bg:salmon fc:white p:1em r:.5em" />
```

This would expand to:

```css
display: flex;
flex-direction: column;
background: salmon;
color: white;
padding: 1em;
border-radius: 0.5em;
```

And with dynamic logic:

```jsx
<box s_fc={() => (isActive ? "green" : "gray")} />
```

Note that while it is possible to use dynamic styles via the `s` prop:

```jsx
<box s={() => (isActive ? "fc:green" : "fc:gray")} />
```

This is not reccomended, instead use the `s_fc` prop so a new class is not created. Also note that for components rendered inside of a `<list></list>` dynamic classes will not work due to the way Gorilla caches styles. When in doubt, if you have dynamic styles, use a dedicated `s_name` prop!

---

# Advanced Styling: Responsive and Pseudo Styles

Gorilla UI's style system doesn’t just let you write compact styles — it also supports **hover**, **focus**, and **media query** styles with the same ease. All styles are auto-scoped, auto-classed, and reactive when used with functions.

This section walks you through:

- Pseudo selectors using `_s` and `__s`
- Media queries using `s__breakpoint`
- Dynamic variants (with functions)
- Style application order and reusability

---

## Pseudo Styles: Hover and Focus

Use the following props to apply pseudo-class styles:

- `_s`: styles for `:hover`
- `__s`: styles for `:focus`

### Example: Hover and Focus Styles

```jsx
<button s="fc:black bg:white" _s="bg:gray" __s="bg:lightblue" />
```

This compiles to scoped CSS like:

```css
.button {
  color: black;
  background: white;
}
.button:hover {
  background: gray;
}
.button:focus {
  background: lightblue;
}
```

---

## Media Query Styles

Media-specific styles are written using `s__breakpoint`, where `breakpoint` is a token like `mobile`, `w_768px`, or any valid media suffix.

### Example: Media Styles

```jsx
<card s="fc:black" s__maxw_600px="fc:blue" />
```

This will generate:

```css
.card {
  color: black;
}
@media (max-width: 600px) {
  .card {
    color: blue;
  }
}
```

---

## Combining Styles

You can use all forms together:

```jsx
<box
  s="fc:black"
  _s="fc:gray"
  __s="fc:blue"
  s__w_800px="fc:purple"
  s_fc={() => (state.complete ? "green" : "red")}
/>
```

This combines:

- Base style
- Hover/focus style
- Media query override
- Dynamic reactivity with `s_fc`

All of these are:

- Automatically classed and scoped
- Reused via cache if the styles match
- Applied in correct CSS order (base → media → pseudo → reactive)

---

## Style Reuse and Efficiency

Gorilla UI automatically caches styles by their content and usage context. This means:

- Identical style strings or functions produce the same class name
- DOM is not mutated if styles haven’t changed
- You can confidently reuse expressions without performance worry

---

## 🛠 Using the Style Split Keys (`s_bg_fc_r`, etc.)

You can target multiple style properties with one key:

```jsx
<box s_bg_fc_r="salmon" />
```

This sets:

```css
background: salmon;
color: salmon;
border-radius: salmon;
```

Or even:

```jsx
<box s_w_h_minw="10px" />
```

This sets:

```css
width: 10px;
height: 10px;
min-width: 10px;
```

---

## Dynamic Pseudo and Media Styles

You can also use functions inside `_s`, `__s`, or `s__breakpoint`:

```jsx
<box _s_fc={() => (state.active ? "green" : "gray")} />
```

These update automatically when their dependencies change.

---

# Advanced Styling: Animations and Transitions

Gorilla UI includes built-in support for declarative animations and transitions using a clean, shorthand-based syntax. These animations are defined directly in JSX and scoped to each element automatically.

You can apply animations using:

- `a`: base animation
- `_a`: hover animation
- `__a`: focus animation
- `a__media`: media query-specific animation

Animations are dynamically generated using unique CSS classes and injected into a global stylesheet.

---

## Animation Syntax

The animation string defines a timeline of style changes. There are three supported formats:

### 1. To-only animation

```js
a = "1s ease-in |to| w:100px bg:salmon";
```

Applies a transition from current state **to** the specified values over 1 second.

### 2. From-to animation

```js
a = "0.5s linear |from| w:0px bg:gray |to| w:200px bg:black";
```

Starts with specific styles and transitions to new values. You can use `from` and `to` sections together.

### 3. Percent-based keyframes

```js
a = "1s ease-in-out |0%| o:0 |50%| o:1 |100%| o:0";
```

Manually define keyframes at given percentages (just like CSS `@keyframes`). Useful for blinking, pulsing, or complex animations.

---

## Examples

### Animate width and background:

```jsx
<box a="1s |to| w:100px bg:salmon" />
```

### Animate from gray to black:

```jsx
<panel a="0.5s ease-out |from| bg:gray |to| bg:black" />
```

### Fade in and out:

```jsx
<fade a="2s linear |0%| o:0 |50%| o:1 |100%| o:0" />
```

---

## Multiple Animations

You can pass an array of animations:

```jsx
<box a={["0.3s |to| r:1em", () => "0.5s |to| bg:red"]} />
```

Each animation string is treated independently, and class names are combined.

---

## Pseudo Animations

Apply animations on `:hover` and `:focus`:

```jsx
<button _a="0.3s |to| bg:gray" />
<input __a="0.3s |to| r:.5em" />
```

---

## Media Query Animations

Apply animations based on screen size:

```jsx
<box a__w_600px="1s |to| w:100px" />
```

Use custom breakpoints or standard media tokens (like `a__mobile`).

---

## Reactive Animations

Animations can use dynamic functions too:

```jsx
<box
  a={() =>
    state.active ? "0.4s |to| bg:green w:200px" : "0.4s |to| bg:gray w:100px"
  }
/>
```

When `state.active` changes, the animation re-evaluates and applies automatically.

---

You can combine `from` and `to`, or define full keyframe sequences using `0%`, `50%`, `100%`, etc.

---

## Example: Full Usage

```jsx
<box
  a="
  1.5s ease-in-out 
  |from| w:0px o:0 
  |50%| w:100px o:1 
  |to| w:200px o:0.5
"
/>
```

This builds a 3-phase animation:

- Starts at `width: 0px`, `opacity: 0`
- Midpoint: `width: 100px`, `opacity: 1`
- Ends at `width: 200px`, `opacity: 0.5`

---

## How It Works Internally

- Gorilla UI parses the string into structured keyframes
- A unique `@keyframes` rule is generated and injected into the document
- A CSS class is created and assigned to the element
- Reused animations share the same class and rule
- Functions are tracked reactively and update the class when needed
