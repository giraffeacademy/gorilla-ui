import "./index";

useTests("Integrations", () => {
  useTests("  Counter", () => {
    const Counter = () => {
      const _ = Make({ count: 0 });
      const spacing = 5;
      return (
        <counter s="flex a:center ">
          <display _a="0.3s |to| bg:gray" s="mr:.25em">
            {() => _.count}
          </display>
          <button s="bg:salmon r:.25em fc:white" onclick={() => _.count++}>
            +1
          </button>
        </counter>
      );
    };

    document.body.append(<Counter />);
  });
  useTests("   Todo List", () => {
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
              const value = e.target.value.trim();
              if (e.key === "Enter" && value) {
                todos.push(Make({ title: value, isComplete: false }));
                e.target.value = "";
              }
            }}
            s="r:.25em ol:none bg:salmon fc:white"
          />
          <list _={todos}>
            {(todo) => (
              <todo
                _s="bg:gray"
                s_fc={() => (todo.isComplete ? "green" : "red")}
              >
                <input
                  type="checkbox"
                  checked={() => todo.isComplete}
                  onclick={() => (todo.isComplete = !todo.isComplete)}
                />
                {todo.title} -{" "}
                {() => (todo.isComplete ? "complete" : "incomplete")}
              </todo>
            )}
          </list>
        </todo_list>
      );
    };

    document.body.append(<TodoList />);
  });
});
