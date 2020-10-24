import timeoutLoop from '../timeoutLoop';

describe('Calls a function for a specified number of times', () => {
  it('Should run the specified number of times', async () => {
    let loopCounter = 0;

    await timeoutLoop(() => {
      loopCounter += 1
    }, 100, 3);

    expect(loopCounter).toEqual(3)
  })
})