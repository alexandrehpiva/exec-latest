# exec-latest
Execute the latest call received in specified time (default 500 milliseconds). If another call is received using the same callback function from the same place before the specified time finish, it will ignore the first execution and restart the timeout.


# What for?
It can be used in onChange handlers (form inputs) that have a high processing cost. execLatest will wait for the user to finish typing before executing the handler/callback function.

And many other real applications!


# Installation
```
yarn add exec-latest
```


# Dist target
- The 1.6.0 version was released in ES5 for compatibility (previous versions were targeted to ESNext). 
- 2.0.0 version is targeting ES6.


# Examples

Simple:

```js
import execLatest from 'exec-latest'

execLatest(() => {
  // Your code
}, 1000)
```


Forms in React:

```jsx
import React, { useState, useEffect } from 'react'
import execLatest from 'exec-latest'

function FormField() {
  const [name, setName] = useState('')

  const expensiveOnChangeHandler = () => {
    // Do an expensive operation with name. This will not reduce user typing experience.
    console.log('Execution an expensive operation...')
  }

  useEffect(() => {
    // Waiting for user to stop typing
    execLatest(expensiveOnChangeHandler, 500)
  }, [name])

  return (
    <div>
      <input type="text" name="name" value={name} onChange={e => setName(e.target.value)} />
    </div>
  )
}

export default FormField
```


More elaborated example using timeoutLoop for test the function:

```js
import execLatest from 'exec-latest'
import timeoutLoop from 'timeout-loop'

(async () => {
  let loopCounter = 0
  let execCounter = 0
  const execTrace = []
  const loopsToMake = 3

  await new Promise(resolve => {
    timeoutLoop(() => {
      loopCounter += 1

      // Calling callback function with 1 second timeout. If the function is re-called (from the same place)
      // in less than 1 second, the first call will be ignored.
      execLatest(() => {
        execCounter += 1

        execTrace.push({ loopCounter, execCounter })

        // Resolve only if in the last loop
        if (loopCounter === loopsToMake) {
          resolve()
        }
      }, 1000)
    }, 100, loopsToMake)
  })

  console.log({
    loopCounter, // 3
    execCounter, // 1
    execTrace // [{ 3, 1 }] -> Only push the last object to execTrace array (means loop number 3 and is the 1st execution)
  })
})()
```
