export function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

export function easeInOutCubic(x) {
  return x < 0.5
    ? 4 * x * x * x
    : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function animate(updateFn, duration, easingFn = easeOutCubic) {
  return new Promise((resolve) => {
    const startTime = performance.now();

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easingFn(progress);

      updateFn(eased);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }

    requestAnimationFrame(step);
  });
}

export function randomDelay(maxDelay) {
  const delay = Math.random() * maxDelay;
  return new Promise((resolve) => setTimeout(resolve, delay));
}

