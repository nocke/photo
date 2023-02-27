
import { assert } from 'chai'
import sanitize from '../../src/commands/sanitize.js'
import { guard, warn } from '@nocke/util'
import path from 'path'


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

  it('trash deletion completed after await', async() => {
    const absDirPath = path.resolve('./TEST-FOLDER-SINGLE')
    const absFilePath = path.resolve(absDirPath + '/somecruft.lrf')

    guard(`mkdir -p ${absDirPath}`)
    guard(`rm -f ${absFilePath}`)

    assert.fileDoesNotExist(absFilePath)
    guard(`touch ${absFilePath}`)
    assert.fileExists(absFilePath)

    // REF trash(absDirPath)
    // REF fileUtils.deleteFile(absFilePath, true, false, 'testing')
    await sanitize({ live: true, verbose: true }, [absDirPath])
    assert.fileDoesNotExist(absFilePath) // ← *the* crucial test for regressing async-isses encountered (foreach insteadt of for ... of)

    guard(`rm -f ${absFilePath}`)
    assert.fileDoesNotExist(absFilePath)
    guard(`rmdir ${absDirPath}`)
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
