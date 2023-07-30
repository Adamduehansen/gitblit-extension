export function wait(seconds: number): Promise<void> {
  return new Promise<void>((resolve) => {
    const intervalId = window.setInterval(() => {
      clearInterval(intervalId);
      resolve();
    }, 1000 * seconds);
  });
}
