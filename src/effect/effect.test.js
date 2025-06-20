useTests("Effect", () => {
  beforeEach(() => {
    Type.activeTypes = {};
  });

  // NOTE: some async effects use defer() twice because of microtask enqeues
  it("simple", () => {
    const A = new Type();
    const a = A.New({ foo: 0 });

    new Effect(() => {
      a.foo;
    });

    a.foo++;
  });
  it("sync set effect", async () => {
    const A = new Type("A");
    const a = A.New({ foo: 0 });

    let i = 0;
    let runCount = null;
    new Effect((_) => {
      console.log(a.foo);
      a.foo;
      i++;
      runCount = _;
    });

    await defer();
    assert(i === 1);
    assert(runCount === 0);

    a.foo = 10;
    await defer();

    assert(i === 2);
    assert(runCount === 1);
    assert(a.foo === 10);
  });
  it("async set effect", async () => {
    const A = new Type("A");
    const a = A.New({ foo: 0 });

    let i = 0;
    new Effect(async () => {
      await defer();
      a.foo;
      i++;
    });

    await defer();
    await defer();

    assert(i === 1);

    a.foo++;
    await defer();
    await defer();

    assert(i === 2);
    assert(a.foo === 1);
  });
  it("sync delete effect", async () => {
    const A = new Type("A");
    const a = A.New({ foo: 0 });

    let i = 0;
    new Effect(() => {
      a.foo;
      i++;
    });

    await defer();
    assert(i === 1);

    delete a.foo;
    await defer();
    assert(i === 2);
    assert(a.foo === undefined);
  });
  it("async delete effect", async () => {
    const A = new Type("A");
    const a = A.New({ foo: 0 });

    let i = 0;
    new Effect(async () => {
      await defer();
      a.foo;
      i++;
    });

    await defer();
    await defer();

    assert(i === 1);

    delete a.foo;
    await defer();
    await defer();

    assert(i === 2);
    assert(a.foo === undefined);
  });
  useTests("lists", () => {
    // lists should be their own type
    it("adding elements", async () => {
      const A = new Type([]);
      const a = A.New();

      let i = 0;
      new Effect(() => {
        i = a.length;
      });
      assert(i === 0);

      a.push("x");
      await defer();

      assert(a.matches(["x"]));
      assert(i === 1);

      a.push("y", "z");
      await defer();

      assert(a.matches(["x", "y", "z"]));
      assert(i === 3);
    });
    it("removing elements", async () => {
      const A = new Type([]);
      const a = A.New(["x", "y", "z"]);

      let i = 0;
      new Effect(() => {
        i = a.length;
      });
      await defer();

      assert(i === 3);

      a.pop();
      await defer();

      assert(a.matches(["x", "y"]));
      assert(i === 2);

      a.splice(1);
      await defer();

      assert(a.matches(["x"]));
      assert(i === 1);
    });
  });
  it("dynamic accessor", async () => {
    const A = new Type("A");
    const a = A.New({ foo: 0 });

    const target = a;
    const key = "foo";

    let i = 0;
    new Effect(() => {
      target[key];
      i++;
    });

    await defer();
    assert(i === 1);

    target[key] = 10;
    await defer();
    assert(i === 2);
    assert(target[key] === 10);
  });
  it("ignores reserved object keys", async () => {
    const A = new Type("A");
    const a = A.New({ foo: 0 });

    let i = 0;
    new Effect(() => {
      i++;
      a.constructor;
    });

    await defer();
    assert(i === 1);

    a.constructor = "a";
    await defer();
    assert(i === 1);
  });
  it("unsubscribe from effect", async () => {
    const A = new Type("A");
    const a = A.New({ foo: 0 });

    let i = 0;
    const unsubscribe = new Effect(async () => {
      await defer();
      a.foo;
      i++;
    });
    await defer();
    await defer();

    assert(i === 1);

    a.foo++;
    await defer();
    await defer();

    assert(i === 2);
    assert(a.foo === 1);

    unsubscribe();

    a.foo++;
    await defer();
    assert(i === 2);
    assert(a.foo === 2);
  });
  it("cleans up between effects", async () => {
    const A = new Type("A");
    const a = A.New({ x: 0, y: 10, z: 100 });

    let i = 0;
    let j = 0;
    new Effect(() => {
      j++;
      if (i === 0) return a.x;
      else if (i === 10) a.y;
      else a.z;
    });

    await defer();
    assert(j === 1);

    i = 10;
    a.x++;
    await defer();
    assert(j === 2);

    a.x++;
    await defer();
    assert(j === 2);

    a.y++;
    await defer();
    assert(j === 3);

    i = 100;
    a.y++;
    await defer();
    assert(j === 4);

    a.y++;
    a.x++;
    await defer();
    assert(j === 4);
  });
  it("doesn't register for assignment", async () => {
    const A = new Type("A");
    const a = A.New({ foo: 0 });

    let i = 0;
    new Effect(() => {
      i++;
      a.foo = 3;
    });

    await defer();
    assert(i === 1);
    assert(a.foo === 3);

    a.foo = 10;

    await defer();
    assert(i === 1);
    assert(a.foo === 10);
  });
  it("doesn't trigger effect for unchanged function", async () => {
    const A = new Type("A");
    const a = A.New({ foo: () => true });

    let i = 0;
    new Effect(() => {
      i++;
      a.foo;
    });

    await defer();
    assert(i === 1);

    a.foo = () => true;
    await defer();
    assert(i === 1);

    a.foo = () => false;
    await defer();
    assert(i === 2);
    assert(a.foo.toString() === `() => false`);
  });
  it("doesn't trigger effect for unchanged primitives", async () => {
    const A = new Type("A");
    const a = A.New({ foo: "a" });

    let i = 0;
    new Effect(() => {
      i++;
      a.foo;
    });

    await defer();
    assert(i === 1);

    a.foo = "a";
    await defer();
    assert(i === 1);

    a.foo = "b";
    await defer();
    assert(i === 2);
    assert(a.foo === `b`);
  });
  it("works with DOM", async () => {
    const A = new Type("A");
    const a = A.New({ foo: "bar" });

    new Effect(() => {
      div.id = a.foo;
    });

    await defer();
    assert(div.id === "bar");

    a.foo = "finny";
    await defer();
    assert(div.id === "finny");
  });
  it(`Root: calls the function inside`, () => {
    let i = 0;
    Effect.Root(() => i++);
    assert(i === 1);
  });
  it(`Root: isolates the function from the Effect's observers`, async () => {
    const A = new Type("A");
    const a = A.New({ name: "a" });

    let i = 0;
    new Effect(() => {
      i++;
      Effect.Root(() => a.name);
    });
    a.name = "finn";
    await defer();
    assert(i === 1);
  });
  useTests("link", () => {
    beforeEach(() => {
      Type.activeTypes = {};
    });

    it("links type field to object", async () => {
      const A = new Type("A");
      const a = A.New({ foo: 3 });
      const obj = { count: 88 };

      obj.link("count", a, "foo");

      await defer();
      assert(obj.count === 3);

      a.foo = 10;
      await defer();
      assert(obj.count === 10);
      assert(a.foo === 10);

      a.foo = "a";
      await defer();
      assert(obj.count === "a");
      assert(a.foo === "a");
    });
    it("links DOM elements and cleans up on unmount", async () => {
      const A = new Type("A");
      const a = A.New({ foo: "bar" });
      const el = document.createElement("ul");

      el.link("id", a, "foo");
      div.append(el);

      await defer();
      assert(el.id === "bar");

      a.foo = "finny";
      await defer();
      assert(el.id === "finny");

      el.remove();
      await defer();

      a.foo = "removed";
      await defer();

      assert(a.foo === "removed");
      assert(el.id === "finny");
    });
  });
});
