/**
 * Gets the execution place in execution stack.
 */
export const stackTrace = () => (new Error())?.stack?.split('\n').reverse().slice(0, -2).reverse().join('\n')
