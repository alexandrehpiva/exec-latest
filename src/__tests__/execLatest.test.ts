import timeoutLoop from 'timeout-loop'
import execLatest from '../execLatest'

type Exec = {
  loopCounter: number,
  execCounter: number
}

describe('Execute only the latest call received in a determined time in milliseconds', () => {
  it('Should execute only the latest call when setting the timeout greater than call time', async () => {
    let loopCounter = 0
    let execCounter = 0

    // Number of calls
    const loopsToMake = 3

    const execTrace: Exec[] = []

    await new Promise(resolve => {
      timeoutLoop(() => {
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

    // Prove that execLatest is being called all times
    expect(loopCounter).toEqual(loopsToMake)

    // Only the latest call stored in execTrace
    expect(execTrace).toEqual([
      { loopCounter: loopsToMake, execCounter: 1 }
    ])
  })

  it('Should execute all calls when setting the timeout less than the call time', async () => {
    let loopCounter = 0
    let execCounter = 0

    // Number of calls
    const loopsToMake = 3

    const execTrace: Exec[] = []

    await new Promise(resolve => {
      timeoutLoop(() => {
        loopCounter += 1

        // execLatest will wait 50 millisecond to execute the callback function. As the loop is
        // re-calling it after this configured time, all executions will be made.
        execLatest(() => {
          execCounter += 1

          execTrace.push({ loopCounter, execCounter })

          if (loopCounter === loopsToMake) {
            resolve()
          }
        }, 50)
      }, 100, loopsToMake)
    })

    // Prove that execLatest is being called all times
    expect(loopCounter).toEqual(loopsToMake)

    // All calls must be stored in execTrace
    expect(execTrace).toEqual([
      { loopCounter: 1, execCounter: 1 },
      { loopCounter: 2, execCounter: 2 },
      { loopCounter: 3, execCounter: 3 }
    ])
  })

  test('Two identical functions called from different places must not interfere with each other', async () => {
    let loopCounter = 0
    let execCounter = 0

    // Number of calls
    const loopsToMake = 10

    const execTrace: Exec[] = []

    const fnTest = (resolve: (value?: unknown) => void) => () => {
      execCounter += 1

      execTrace.push({ loopCounter, execCounter })

      setTimeout(() => {
        resolve()
      }, 1000);
    }

    await new Promise(resolve => {
      timeoutLoop(() => {
        loopCounter += 1

        // 1st call
        execLatest(fnTest(resolve), 100)

        // 2st call
        execLatest(fnTest(resolve), 150)
      }, 50, loopsToMake)
    })
    
    // Prove that execLatest is being called all times
    expect(loopCounter).toEqual(loopsToMake)

    // The latest call of each call stored in execTrace
    expect(execTrace).toEqual([
      { loopCounter: loopsToMake, execCounter: 1 },
      { loopCounter: loopsToMake, execCounter: 2 }
    ])
  })
})
