window.REFRESH_RATE = 1000 / 60;
window.TICK_TIME = REFRESH_RATE * 0.7; // assumes 60fps

const taskQueue = new Set();
let isRunning = false;

window.RUN_TASKS = async (...tasks) => {
  tasks.forEach((task) => taskQueue.add(task));
  if (isRunning) return;

  queueMicrotask(() => {
    taskQueue.forEach((task) => {
      task();
      taskQueue.delete(task);
    });

    isRunning = false;
  });

  isRunning = true;
};
