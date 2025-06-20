useTests("Type", () => {
  beforeEach(() => {
    Type.activeTypes = {};
  });

  useTests("creating instances of Types", () => {
    it("accepts init object", () => {
      const initObj = { a: 1, b: 2 };
      const A = new Type(initObj);
      const a = A.New();
      assert(a.matches(initObj));
    });
    it("accepts init fn that returns an object", () => {
      const initObj = { a: 1, b: 2 };
      const A = new Type(() => initObj);
      const a = A.New();
      assert(a.matches(initObj));
    });
    it(`works with .matches`, () => {
      const A = new Type({ a: 1, b: 2 });
      assert(A.New().matches(A.New()));
    });
    useTests(`Type.New()`, () => {
      it(`accepts init object which is merged`, () => {
        const A = new Type({ a: 100, b: 200 });

        const initObj = { a: 1, c: 3 };
        const a = A.New(initObj);
        assert(a.matches({ a: 1, b: 200, c: 3 }));
      });
      it(`runs init fn and merges returned object`, () => {
        const A = new Type({ a: 100, b: 200 });

        const initObj = { a: 1, c: 3 };
        const a = A.New(initObj);
        assert(a.matches({ a: 1, b: 200, c: 3 }));
      });
    });
  });
  it("constructor", () => {
    let i = 0;
    const A = new Type({ foo: "bar", $init: () => i++ });
    const a = A.New();

    assert(i === 1);
  });
  it("inheritance", () => {
    const A = new Type({
      foo: "bar",
    });
    const B = new Type({ biz: "wap" }, A);
    const b = B.New();

    assert(b.foo === "bar");
  });
  useTests("memos", () => {
    it("basic usage", async () => {
      const A = new Type({
        foo: 0,
        $memo_x: (_) => _.foo + 1,
      });
      const a = A.New();

      assert(a.x === 1);

      a.foo++;
      await defer();

      assert(a.x === 2);
    });
    it("does not trigger effect", async () => {
      // Because the memo fn is not re-run it loses dependencies

      const A = new Type({
        foo: 0,
        $memo_x: (_) => _.foo + 1,
      });
      const a = A.New();

      let i = 0;
      new Effect(() => {
        i++;
        a.x;
      });
      await defer();

      assert(a.x === 1);
      assert(i === 1);

      a.foo++;
      await defer();
      assert(a.x === 2);
      assert(i === 2);

      a.foo++;
      await defer();
      assert(a.x === 3);
      assert(i === 2);

      a.foo++;
      await defer();
      assert(a.x === 4);
      assert(i === 2);
    });
  });

  useTests("lists", () => {
    it("type init", () => {
      const A = new Type(["x", "y"]);
      const a = A.New();

      assert(Array.isArray(a));
      assert(a.matches(["x", "y"]));
    });
    it("instance init overrides type init", () => {
      const A = new Type(["x"]);
      const a = A.New(["y", "z"]);

      assert(Array.isArray(a));
      assert(a.matches(["y", "z"]));
    });
  });
  useTests("methods", () => {
    it("can operate on instance fields", () => {
      const A = new Type({
        x: 2,
        // methods should have UpperCase names
        PowX: (_, pow) => {
          return Math.pow(_.x, pow);
        },
        // _ is essentially `this`, it refers to the instance
      });
      const a = A.New();

      assert(a.PowX(3) === 8);
    });
    it("async: can operate on instance fields", async () => {
      const A = new Type({
        x: 2,
        // methods should have UpperCase names
        PowX: async (_, pow) => {
          await sleep(1);
          return Math.pow(_.x, pow);
        },
        // _ is essentially `this`, it refers to the instance
      });
      const a = A.New();

      const result = await a.PowX(3);
      assert(result === 8);
    });
    it("can access private _xyz fields", () => {
      const A = new Type({
        _x: 2,
        PowX: (_, pow) => Math.pow(_._x, pow),
      });
      const a = A.New();

      assert(a.PowX(3) === 8);
    });
    it("cannot be set", () => {
      const A = new Type({
        x: 2,
        Calculate: (_, value) => _.x * value, // Public method
      });

      const a = A.New();

      // Attempting to overwrite the method should throw an error
      let error;
      try {
        a.Calculate = () => 42; // Attempt to set a new function to `Calculate`
      } catch (e) {
        error = e;
      }

      assert(
        error.message === "method Calculate cannot be set.",
        "Overwriting a method should throw a ReferenceError"
      );

      // Ensure the method still works as originally defined
      const result = a.Calculate(3); // Should still calculate 2 * 3 = 6
      assert(
        result === 6,
        "Method retains original functionality after set attempt"
      );
    });
    it("private _Method", () => {
      const A = new Type({
        $get_x: (_) => _._Calculate(),
        _y: 2,
        _Calculate: (_) => _._y,
      });

      const a = A.New();

      assert(a.x === 2);

      // Attempting direct access to _Calculate should throw an error
      let error;
      try {
        console.log(a._doubleValue); // Direct access should be restricted
      } catch (e) {
        error = e;
      }

      assert(error.message);
    });
    it("handles errors and resets private locks", () => {
      const A = new Type({
        ThrowError: () => {
          throw new Error("Test error in synchronous method");
        },
      });
      const a = A.New();

      let error;
      try {
        a.ThrowError();
      } catch (e) {
        error = e;
      }

      assert(error.message === "Test error in synchronous method");

      // Test that private field is inaccessible after the async error
      let privateAccessError;
      try {
        a._x;
      } catch (e) {
        privateAccessError = e;
      }
      assert(privateAccessError, "private fields are inaccessible after error");
    });
    it("handles async errors and resets private locks", async () => {
      const A = new Type({
        _x: 2,
        ThrowErrorAsync: async () => {
          await sleep(1);
          throw new Error("Test error in async method");
        },
      });
      const a = A.New();

      let error;
      try {
        await a.ThrowErrorAsync();
      } catch (e) {
        error = e;
      }

      assert(error.message === "Test error in async method");

      // Test that private field is inaccessible after the async error
      let privateAccessError;
      try {
        a._x;
      } catch (e) {
        privateAccessError = e;
      }
      assert(privateAccessError, "private fields are inaccessible after error");
    });
  });
  useTests("get", () => {
    it("get a field", () => {
      const A = new Type({
        x: 1,
      });
      const a = A.New();

      assert(a.x === 1);
      assert(`x` in a);
    });
    it("cannot get private _xyz keys", () => {
      const A = new Type({
        _x: 1,
        $get_a: () => 3,
      });
      const a = A.New();

      assert(!(`_x` in a));

      let error;
      try {
        a._x;
      } catch (e) {
        error = e;
      }

      assert(error.message === `private field _x cannot be accessed.`);
    });
    useTests("getters", () => {
      it("computed field", () => {
        const i = 1;
        const A = new Type({
          $get_x: () => i,
        });
        const a = A.New();

        assert(a.x === i);
        assert({ ...a }.x === i);
      });
      it("derived field", () => {
        const A = new Type({
          i: 1,
          $get_x: (_) => _.i,
          // _ is essentially `this`, it refers to the instance
        });
        const a = A.New();

        assert(a.x === a.i);
      });
      it("intercepted field", () => {
        const A = new Type({
          x: 2,
          $get_x: (_) => _.x + 1, // when used in the getter _.x refers to the internal field
          // _ is essentially `this`, it refers to the instance
        });
        const a = A.New();

        assert(a.x === 3);

        a.x = 4; // setting works as usal
        assert(a.x === 5);
      });
      it("auto-generated intercepted field", () => {
        const A = new Type({
          $get_x: (_) => _.x + 1,
        });
        const a = A.New();

        assert(isNaN(a.x));
        a.x = 4; // setting here set's the target's _.x directly
        assert(a.x === 5);
      });
      it("lazy field", () => {
        const A = new Type({
          $get_x: (_) => {
            if (!_.x) _.x = 1;
            return _.x;
          },
        });
        const a = A.New();

        assert(a.x === 1);
        assert(a.x === 1); // No recalculation
      });
      it("private field", () => {
        const A = new Type({
          _x: 2,
          $get_y: (_) => _._x, // getters can access private fields
        });
        const a = A.New();

        assert(a.y === 2);
      });
      it("dependent field", () => {
        const A = new Type({
          $get_x: (_) => _.y + 1,
          $get_y: () => 3,
        });
        const a = A.New();

        assert(a.x === 4); // x depends on y
        assert(a.y === 3); // Independent check of y
      });
      it("deeply dependent field", () => {
        const A = new Type({
          $get_a: (_) => 1,
          $get_b: (_) => _.a + 1,
          $get_c: (_) => _.b + 1,
        });
        const a = A.New();

        assert(a.c === 3); // c depends on b, which depends on a
        assert(a.b === 2); // Intermediate check
        assert(a.a === 1); // Base value check
      });
      it("recursive field", () => {
        const A = new Type({
          x: 0,
          $get_y: (_) => {
            _.x++;
            if (_.x === 1) return _.z;
            else return _.x;
          },
          $get_z: (_) => _.y,
        });
        const a = A.New();

        assert(a.y === 2);
      });
      it("error handling", () => {
        const A = new Type({
          $get_x: () => {
            throw new Error("Failed to compute x");
          },
        });
        const a = A.New();

        let error;
        try {
          a.x; // Accessing x should throw the error
        } catch (e) {
          error = e;
        }

        assert(error && error.message === "Failed to compute x");
      });
    });
  });
  useTests("set", () => {
    it("set a field", () => {
      const A = new Type({
        x: 1,
      });
      const a = A.New();

      a.x = 2;
      a.y = 3;
      assert(a.x === 2);
      assert(a.y === 3);
      assert(`y` in a);
    });
    it("cannot set a private _xyz field", () => {
      const A = new Type({
        _x: 1,
      });
      const a = A.New();

      let error;
      try {
        a._x = 3;
      } catch (e) {
        error = e;
      }

      assert(error.message === `private field _x cannot be set.`);
    });
    useTests("setters ($set_xyz)", () => {
      it("named field", () => {
        const A = new Type({
          x: 1,
          $set_x: (_, x) => (_.x = x),
        });
        const a = A.New();

        a.x = 5;
        assert(a.x === 5);
      });
      it("auto-generated named field", () => {
        const A = new Type({
          $set_x: (_, x) => (_.x = x + 1),
        });
        const a = A.New();

        a.x = 3;
        assert(a.x === 4);
      });
      it("dependent field", () => {
        const A = new Type({
          i: 1,
          $set_x: (_, x) => (_.x = x + _.i),
        });
        const a = A.New();

        a.x = 3;
        assert(a.x === 4);
      });
      it("deeply dependent field", () => {
        const A = new Type({
          $set_a: (_, a) => (_.b = a + 1),
          $set_b: (_, b) => (_.c = b + 1),
          c: 0,
        });
        const a = A.New();

        a.a = 1;
        assert(a.c === 3); // a set cascades to c
      });
      it("lazy field", () => {
        const A = new Type({
          $set_x: (_, x) => {
            if (isNaN(_.x)) _.x = x;
            else _.x = 5;
          },
        });
        const a = A.New();

        a.x = 1;
        assert(a.x === 1); // First set, initializes value
        a.x = 2;
        assert(a.x === 5); // Subsequent sets don't change it
      });
      it("private field", () => {
        let _x;
        const A = new Type({
          _x: 2,
          $set_y: (_, y) => {
            _._x = y;
            _x = _._x; // need to do this to check in test (private fields cannot be accessed publicly)
          }, // setters can access private fields
        });
        const a = A.New();

        a.y = 10;
        assert(_x === 10); // y indirectly updates _x
      });
      it("recursive field", () => {
        const A = new Type({
          x: 0,
          $set_y: (_, y) => {
            _.x++;
            if (_.x === 1) _.z = 2;
            else _.y = _.x;
          },
          $set_z: (_) => (_.y = 3),
        });
        const a = A.New();

        a.y = 0;
        assert(a.y === 2); // Recursive dependency
      });
      it("error handling", () => {
        const A = new Type({
          $set_x: () => {
            throw new Error("Failed to set x");
          },
        });
        const a = A.New();

        let error;
        try {
          a.x = 5; // Setting x should throw an error
        } catch (e) {
          error = e;
        }

        assert(error && error.message === "Failed to set x");
      });
    });
  });
  useTests("delete", () => {
    it("delete a field", () => {
      const A = new Type({
        x: 1,
      });
      const a = A.New();

      assert(a.x === 1);
      assert(`x` in a);

      delete a.x;

      assert(a.x === undefined);
      assert(!(`x` in a));
    });
    it("cannot delete private _xyz keys", () => {
      const A = new Type({
        _x: 1,
      });
      const a = A.New();

      let error;
      try {
        delete a._x;
      } catch (e) {
        error = e;
      }

      assert(error.message === `private field _x cannot be deleted.`);
    });
    it("methods cannot be deleted", () => {
      const A = new Type({
        Calculate: (_, value) => value * 2,
      });
      const a = A.New();

      let error;
      try {
        delete a.Calculate;
      } catch (e) {
        error = e;
      }

      assert(error.message === "method Calculate cannot be deleted.");
    });
    useTests("deleters", () => {
      it("named field", () => {
        const A = new Type({
          x: 1,
          $delete_x: (_) => delete _.x,
        });
        const a = A.New();

        assert(a.x === 1);

        delete a.x;
        assert(a.x === undefined); // Field x should be deleted
        assert(!("x" in a));
      });
      it("non-existent field", () => {
        const A = new Type({
          $delete_x: (_) => {
            delete _._x;
          },
        });
        const a = A.New();

        delete a.x;
        assert(a.x === undefined);
        assert(!(`x` in a)); // Should be deleted
      });
      it("dependent field", () => {
        const A = new Type({
          i: 1,
          $delete_x: (_) => {
            delete _.i;
          },
        });
        const a = A.New();

        delete a.x;
        assert(a.i === undefined); // Deletes dependent field i
        assert(!(`i` in a));
      });
      it("deeply dependent field", () => {
        const A = new Type({
          $delete_x: (_) => {
            delete _.y;
          },
          $delete_y: (_) => {
            delete _.z;
          },
          z: 3,
        });
        const a = A.New();

        delete a.x; // Deleting x triggers deletion of y, which then deletes z
        assert(a.z === undefined);
        assert(!(`z` in a));
      });
      it("independent fields", () => {
        const A = new Type({
          x: 1,
          y: 2,
          $delete_x: (_) => {
            delete _.x;
          },
          $delete_y: (_) => {
            delete _.y;
          },
        });
        const a = A.New();

        delete a.x;
        assert(a.x === undefined);
        assert(!("x" in a));

        delete a.y;
        assert(a.y === undefined);
        assert(!("y" in a));
      });
      it("multiple fields", () => {
        const A = new Type({
          x: 1,
          y: 2,

          $delete_x: (_) => {
            delete _.x;
            delete _.y;
          },
        });
        const a = A.New();

        assert(a.x === 1);
        assert(a.y === 2);

        delete a.x; // Deleting x triggers deletion of y as well
        assert(a.x === undefined);
        assert(!(`x` in a));

        assert(a.y === undefined);
        assert(!(`y` in a));
      });
      it("lazy delete", () => {
        const A = new Type({
          $delete_x: (_) => {
            if (_._x !== undefined) delete _._x;
          },
          _x: 5,
        });
        const a = A.New();

        delete a.x;
        assert(a.x === undefined); // Only deletes if _x exists
      });
      it("conditional delete", () => {
        const A = new Type({
          x: 10,
          $delete_x: (_) => {
            if (_.x > 5) delete _.x;
          },
        });
        const a = A.New();

        delete a.x;
        assert(a.x === undefined);

        a.x = 4;
        delete a.x;
        assert(a.x === 4); // Does not delete since x is not > 5
      });
      it("private field", () => {
        const A = new Type({
          _x: 10,
          $delete_y: (_) => {
            delete _._x;
          },
          $get_private: (_) => _._x,
        });
        const a = A.New();

        delete a.y; // y’s delete removes private _x
        assert(a.private === undefined); // Private field _x should also be deleted
      });
      it("recursive delete", () => {
        const A = new Type({
          x: 0,
          $delete_y: (_) => {
            _.x++;
            if (_.x === 1) delete _.z;
            else delete _.y;
          },
          $delete_z: (_) => {
            delete _.y;
          },
        });
        const a = A.New();

        delete a.y; // Recursive dependency triggers deletes
        assert(a.y === undefined);
        assert(a.z === undefined);
        assert(a.x === 2);
      });
      it("error handling", () => {
        const A = new Type({
          $delete_x: () => {
            throw new Error("Failed to delete x");
          },
        });
        const a = A.New();

        let error;
        try {
          delete a.x; // Should throw an error
        } catch (e) {
          error = e;
        }

        assert(error && error.message === "Failed to delete x");
      });
    });
  });
  useTests(`getter, setter, deleter: integration`, () => {
    // checks to make sure that getters, setters and deleters of the same key are utilizing the interfaces instead of directly accessing the field.

    it("uses getter in setter/deleter", () => {
      let _set = 0;
      let _delete = 0;
      const A = new Type({
        x: 1,
        $get_x: () => 2,
        $set_x: (_) => (_set = _.x),
        $delete_x: (_) => (_delete = _.x),
      });

      const a = A.New();

      assert(a.x === 2);

      a.x = 5;
      assert(_set === 2);

      delete a.x;
      assert(_delete === 2);
    });
    it("uses setter in getter/deleter", () => {
      let _get = 0;
      let _delete = 0;
      const A = new Type({
        x: 1,
        $set_x: (_, val) => (_get = val + 10),
        $get_x: (_) => _get,
        $delete_x: (_) => (_delete = _get),
      });

      const a = A.New();

      a.x = 5;
      assert(a.x === 15);
      delete a.x;
      assert(_delete === 15);
    });
    it("uses deleter in setter/getter", () => {
      let _set = 0;
      let _get = 0;
      const A = new Type({
        x: 1,
        $delete_x: (_) => (_set = 100),
        $set_x: (_) => (_set += 10),
        $get_x: (_) => _set + _get,
      });

      const a = A.New();

      delete a.x;
      assert(_set === 100);
      a.x = 5;
      assert(a.x === 110);
    });
  });
  useTests(`finals`, () => {
    it(`get`, () => {
      const A = new Type({
        $final_x: 1,
      });
      const a = A.New();

      assert(a.x === 1);
    });
    it(`private field`, () => {
      const A = new Type({
        $final__x: 1,
        $get_x: (_) => _._x,
      });
      const a = A.New();

      assert(a.x === 1);
    });
    it(`cannot set`, () => {
      const A = new Type({
        $final_x: 1,
      });
      const a = A.New();

      assert(a.x === 1);

      let error;
      try {
        a.x = 2;
      } catch (e) {
        error = e;
      }

      assert(error.message === "final field x cannot be set.");
    });
    it(`cannot delete`, () => {
      const A = new Type({
        $final_x: 1,
      });
      const a = A.New();

      assert(a.x === 1);

      let error;
      try {
        delete a.x;
      } catch (e) {
        error = e;
      }

      assert(error.message === "final field x cannot be deleted.");
    });
    it(`cannot set on initialization`, () => {
      const A = new Type({
        $final_x: 1,
      });

      let error;
      try {
        A.New({ x: 2 });
      } catch (e) {
        error = e;
      }

      assert(error.message === "final field x cannot be set.");
    });
  });
  useTests("static", () => {
    // static utilizes Type (see implementation) so these are more to demonstrate how it's used, all of the core logic is tested in the normal Type tests

    it("get, set, delete", () => {
      const A = new Type({
        $static_x: 1,
      });

      assert(A.static.x === 1);

      A.static.x = 2;

      assert(A.static.x === 2);

      delete A.static.x;

      assert(A.static.x === undefined);
      assert(!(`x` in A.static));
    });
    it("private field", () => {
      const A = new Type({
        $static__x: 100, // private static field _x
      });

      // get
      let error = null;
      try {
        A.static._x;
      } catch (e) {
        error = e;
      }
      assert(error);

      // set
      error = null;
      try {
        A.static._x = 2;
      } catch (e) {
        error = e;
      }
      assert(error);

      // delete
      error = null;
      try {
        delete A.static._x;
      } catch (e) {
        error = e;
      }
      assert(error);
    });
    it("final field", () => {
      const A = new Type({
        $static_$final_x: 100, // static final field _x
      });

      assert(A.static.x === 100);
    });
    it("final private field", () => {
      const A = new Type({
        $static_$final__x: 100, // static final private field _x
        $static_$get_x: (_) => _._x,
      });

      assert(A.static.x === 100);
    });
    it("getters, setters, deleters", () => {
      const A = new Type({
        $static__x: 1,
        $static_$get_x: (_) => _._x + 2,
        $static_$set_x: (_, x) => (_._x = x + 3),
        $static_$delete_x: (_) => delete _._x,
      });

      assert(A.static.x === 3);

      A.static.x = 5;
      assert(A.static.x === 10);

      delete A.static.x;
      assert(isNaN(A.static.x)); // the getter resolves to `undefined + 2`
    });
    it("methods", () => {
      const A = new Type({
        $static_x: 2,
        $static_Calculate: (_) => _.x * 100,
        // _ here is A.static
      });

      assert(A.static.Calculate() === 200);
    });
  });
});
