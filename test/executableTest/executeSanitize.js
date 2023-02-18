import fs from 'fs'
import { assert } from 'chai'
import { ensureEqual, ensureFolderExists, guard, pass } from '@nocke/util'

this.timeout(1500)

describe(autoSuiteName(
  import.meta.url),
() => {

  const src = './node_modules/photo-testfiles/ørig'
  const testfolder = './TEST-FOLDER'
  const numTestFilesTotal = 31

  const lonelyDeleted = 5
  const cruftRemoved = 4
  const filesRenamed = 14

  beforeEach(async() => {
    ensureFolderExists(src, `could not find testfiles in '${src}', have you done 'npm i'?`)
    guard(`rsync -rtogp --exclude='.git' --inplace --delete "${src}/" "${testfolder}"`)
    const filePaths = fs.readdirSync(testfolder)
    ensureEqual(numTestFilesTotal, filePaths.length, `A after rsync, there are too few or too many files`)
    pass('rsync’ed TEST-FILDER...')
  })

  it('perform sanitize - not live', () => {
    const r = guard(`./photo sanitize ${testfolder}`, { mute: true })
    // DEBUG info(r)

    // assert certain stats output
    assert.include(r, `lonelyDeleted: ${lonelyDeleted}`)
    assert.include(r, `cruftRemoved: ${cruftRemoved}`)
    assert.include(r, `filesRenamed: ${filesRenamed}`)

    // ...and that nothing actually happened
    ensureEqual(
      numTestFilesTotal, fs.readdirSync(testfolder).length,
      `if not live, number of test files must remain the same`
    )
  })

  it('perform sanitize - verbose, live', () => {

    const r = guard(`./photo sanitize -v -l ${testfolder}`, { mute: true })
    // DEBUG info(purple(r))

    // assert certain stats output
    assert.include(r, `lonelyDeleted: ${lonelyDeleted}`)
    assert.include(r, `cruftRemoved: ${cruftRemoved}`)
    assert.include(r, `filesRenamed: ${filesRenamed}`)

    // ...and that the right thing actually happened
    ensureEqual(
      numTestFilesTotal - lonelyDeleted - cruftRemoved, fs.readdirSync(testfolder).length,
      `if not live, number of test files must remain the same`
    )
  })
})

// guard(`rm '${testfolder}/DJI_0227.JPG'`)
