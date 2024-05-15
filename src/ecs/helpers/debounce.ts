/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Debounces a function, ensuring it is not called repeatedly within a specified time interval.
 * @template F The type of the function to debounce.
 * @template Args The type of arguments accepted by the debounced function.
 * @param {F} fn The function to debounce.
 * @param {number} wait The time to wait (in milliseconds) before calling the debounced function.
 * @returns {(...args: Args[]) => void} A debounced version of the input function.
 */
export default function debounce<F extends (...args: any[]) => any, Args extends any[],>(fn: F, wait: number): (...args: Args | [Args]) => void {
  let timer: ReturnType<typeof setTimeout>;

  return function (...args: Args | [Args]) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}
