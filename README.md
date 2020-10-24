# exec-latest
Execute the latest call received. If another call is received using the same callback function from the same place before the specified time finish, it will ignore the first execution and restart the timeout.

## Example

```js
setTimeout(() => {
  
}, 100);

function timeoutLoop = (fn) => setTimeout(() => {
  fn();
  timeoutLoop
}, 100);

const testOne = execLatest<Promise<boolean>>(async () => {
  return await new Promise<boolean>((resolve) => {
    resolve(true)
  })
}, 1000)

const testTwo = execLatest<number>(() => {
  return 10
})

```