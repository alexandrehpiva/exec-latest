import execLatest from '../execLatest'
import timeoutLoop from 'timeout-loop'

type Exec = {
  loopCounter: number,
  execCounter: number
}

describe('Execute only the latest call received in a determined time in milliseconds', () => {
  it('Should execute only the latest call in 3 calls made in 100 milliseconds each', async () => {
    let loopCounter = 0
    let execCounter = 0
    const execTrace: Exec[] = []

    await new Promise(async resolveExecLatest => {
      await timeoutLoop(() => {
        loopCounter += 1

        execLatest(() => {
          execCounter += 1

          execTrace.push({ loopCounter, execCounter })
          resolveExecLatest()
        })
      }, 100, 3)
    })

    // Three executions
    expect(loopCounter).toEqual(3)

    // Only the latest call stored in execTrace
    expect(execTrace).toEqual([{ loopCounter: 3, execCounter: 1 }])
  })
})
