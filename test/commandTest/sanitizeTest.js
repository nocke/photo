
import { assert } from 'chai'
import sanitize from '../../src/commands/sanitize.js'
/*
testing the sanitize command (but NOT going through the executable, that happens in executableTest)
 */

// helper routine for async throws testing
const assertThrowsAsync = async(fn, expectedMessage) => {
  try {
    await fn()
  } catch (err) {
    if (expectedMessage) {
      assert.include(err.message, expectedMessage, `Function failed as expected, but could not find message snippet '${expectedMessage}'`)
    }
    return
  }
  assert.fail('function did not throw as expected')
}


describe(autoSuiteName(
  import.meta.url),
() => {

  it('permitted path', () => {
    it('calling sanitize', () => {
      // not 'live', not recursive thus no danger here
      sanitize({}, '/media')
    })
  })

  // negative testing ===============================
  it('negative: inacceptable path', async() => {
    await assertThrowsAsync(async() => {
      await sanitize({}, ['/really/bad/path'])
    }, 'acceptable path')
  })

  it('negative: non-existing path', async() => {
    await assertThrowsAsync(async() => {
      await sanitize({}, ['/media/benign-path-but.non-existing-folder-here'])
    }, 'no such directory')
  })
})
