import { createRef } from './createRef'
import { fastHashCode } from 'fast-hash-code'
import timeoutLoop from 'timeout-loop'

/**
 * Execute the latest call received in specified time (default 500 milliseconds). If another call is received using
 * the same callback function from the same place before the specified time finish, it will ignore the first execution
 * and restart the timeout.
 * @param {Function} callback Callback function to execute.
 * @param {Number} time Time in milliseconds to wait before execute.
 */
export const execLatest = createRef((objRef, resolve, callback, time = 500) => {
  if (typeof callback !== 'function') return

  // Verify if the function is equal and called from the same place
  const callbackHash = fastHashCode(
    callback.toString() + new Error().stack?.toString()
  )

  if (!objRef[callbackHash]) {
    objRef[callbackHash] = {}
  }

  objRef[callbackHash].timeoutToExec &&
    clearTimeout(objRef[callbackHash].timeoutToExec)
  objRef[callbackHash].timeoutToExec = setTimeout(() => {
    resolve(callback()) // TODO: Pass a function that allows you to execute immediately and call clearTimeout
    objRef[callbackHash].timeoutToExec = undefined
  }, time)
})

export default execLatest
