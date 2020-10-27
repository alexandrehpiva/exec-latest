# exec-latest
Execute the latest call received in specified time (default 500 milliseconds). If another call is received using the same callback function from the same place before the specified time finish, it will ignore the first execution and restart the timeout.


# What for?
It can be used in onChange handlers (form inputs) that have a high processing cost. execLatest will wait for the user to finish typing before execute the handler function. And lots of real applications!


# Installation
```
yarn add exec-latest
```


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
import React, {useState, useEffect} from 'react'
import execLatest from 'exec-latest'

function FormField() {
  const [name, setName] = useState('')

  const expensiveOnChangeHandler = () => {
    // Do an expensive operation with name. This will not reduce user typing experience.
  }

  useEffect(() => {
    // Waiting for user to stop typing 
    execLatest(expensiveOnChangeHandler, 500)
  }, [name])

  return (
    <div>
      <input type="text" name="name" value={name} onChange={setName} />
    </div>
  )
}

export default FormField
```


More elaborated example using timeoutLoop for test the function:

```js
import execLatest from 'exec-latest'
import timeoutLoop from 'timeout-loop'

await new Promise(async resolve => {
  await timeoutLoop(() => {
    loopCounter += 1

    // Calling callback function with 1 second timeout. If the function is re-called (from the same place)
    // in less than 1 second, the first call will be ignored.
    execLatest(() => {
      execCounter += 1

      execTrace.push({ loopCounter, execCounter })

      if (loopCounter === loopsToMake) {
        resolve()
      }
    }, 1000)

  }, 100, loopsToMake)
})
```
