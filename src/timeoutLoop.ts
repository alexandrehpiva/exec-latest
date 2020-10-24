
// Loop test function
function genLoop(
  fn: (...params: any) => void,
  timeout: number,
  times: number,
  resolve?: (value?: unknown) => void
) {
  return setTimeout(() => {
    if (times > 0) {
      fn();
      genLoop(fn, timeout, times - 1, resolve);
    } else {
      resolve && resolve();
    }
  }, timeout);
}

/**
 * Calls a function for a specified number of times
 * @param fn Function to call
 * @param timeout Timeout between calls im milliseconds
 * @param times Amount of times to call the function
 */
const timeoutLoop = async (
  fn: (...params: any) => void,
  timeout = 100,
  times = 1
) => await new Promise(resolveTimeoutLoop => {
  genLoop(fn, timeout, times, resolveTimeoutLoop)
})

export default timeoutLoop;
