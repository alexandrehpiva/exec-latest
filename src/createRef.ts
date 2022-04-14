export type ObjRef = {
  [key: string]: {
    timeoutToExec?: any
  }
}

export type RefConfigFunction<P extends Array<any> = any[], R = any> = (
  objRef: ObjRef,
  resolve: (value?: unknown) => void,
  callback: () => R,
  ...additionalParams: P
) => void

/**
 * Create a global scope object reference.
 * @param {Function} func Function that will receive the object reference.
 */
export const createRef = function (func: RefConfigFunction) {
  const objRef: ObjRef = {}

  return function <T>(callback: () => T, ...additionalParams: any[]) {
    return new Promise(resolve => {
      func(objRef, resolve, callback, ...additionalParams)
    }) as unknown as T
  }
}
