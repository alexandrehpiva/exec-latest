import execLatest from '../execLatest'
import timeoutLoop from 'timeout-loop'

describe('Execute only the latest call received in a determined time in milliseconds', () => {
  it('Should execute only the latest call in 3 calls made in 100 milliseconds each', async () => {
    let loopCounter = 0
    let execCounter = 0

    await new Promise(async resolveExecLatest => {
      await timeoutLoop(() => {
        execLatest(() => {
          execCounter += 1
          resolveExecLatest()
        })

        loopCounter += 1
      }, 100, 3)
    })

    expect(loopCounter).toEqual(3)
    expect(execCounter).toEqual(1)
  })
})
