useTests("Engine", () => {
  it("runs task", async () => {
    let i = 0;
    let j = 0;
    RUN_TASKS(
      () => i++,
      () => j++
    );

    await defer();
    assert(i === 1);
    assert(j === 1);
  });
});
