import fs from 'fs'
import { assert } from 'chai'
import modelUtils from '../../src/model/modelUtils.js'
import { purple, warn } from '@nocke/util'
import fileUtils from '../../src/commands/fileUtils.js'
import path from 'path'

/*
* Test, if wrapped file utilties do their job
*/


describe(autoSuiteName(
  import.meta.url),
() => {

  const dirName = `test_dir–søme.päth_${Math.floor(Math.random() * 9000 + 1000)}`
  const testFile1 = `./${dirName}/test1™.txt`
  const testFile2 = `./${dirName}/@test2😬.txt`

  let hook

  beforeEach(() => {
    fs.mkdirSync(dirName)
    fs.writeFileSync(testFile1, 'Test File 1')
    fs.writeFileSync(testFile2, 'Test File 2')
  })

  afterEach(() => {
    fs.rmSync(dirName, { recursive: true })
    assert(!fs.existsSync(dirName), `afterEach(): folder '${dirName}' not gone`)
  })

  it('demo', () => {
    const files = fs.readdirSync(`./${dirName}`)
    assert.equal(files.length, 2)

    // spy on
    hook = global.captureStream(process.stdout)
    hook.unhook()
    warn('captured', hook.captured() && 'nothing')
    assert.strictEqual(hook.captured(), '')
  })


  it('delete File', async() => {
    const absDirPath1 = path.resolve(testFile1)
    const absDirPath2 = path.resolve(testFile2)

    // console.log(absDirPath1)

    await fileUtils.deleteFile(absDirPath1, false, false, 'testing not live ...')
    await fileUtils.deleteFile(absDirPath2, false, false, 'testing not live ...')

    assert(fs.existsSync(testFile1), 'testFile1 deleted despite non-live')
    assert(fs.existsSync(testFile2), 'testFile2 deleted despite non-live')

    await fileUtils.deleteFile(absDirPath1, true, false, 'testing...')
    await fileUtils.deleteFile(absDirPath2, true, false, 'testing...')

    assert(!fs.existsSync(testFile1), 'testFile1 not deleted')
    assert(!fs.existsSync(testFile2), 'testFile2 not deleted')
  })

  // negative testing
  // • no abs path
  // • no *
  // • file not existing
  // • ...
  // rename:  existing target (sidestap must be by callee)
  // • ...
  //

})
