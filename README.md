# exec-latest
Execute the latest call received in specified time (default 500 milliseconds). If another call is received using the same callback function from the same place before the specified time finish, it will ignore the first execution and restart the timeout.


# Installation
```
yarn add exec-latest
```


# Example

```js
import execLatest from 'exec-latest'

execLatest(() => {
  // Your code
}, 1000)
```