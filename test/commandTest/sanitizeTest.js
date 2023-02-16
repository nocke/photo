import path from 'path'
import { assert } from 'chai'

import { argv, check, ensureEqual, ensureFails, ensureFalse, ensureFileExists, ensureFileOrFolderExists, ensureFolderExists, ensureRoot, ensureString, ensureTrue, ensureTruthy, fail, fileCopy, getFolderSize, getInput, getIsoDateAndTime, guard, important, info, iterate, mainWrap, makeDirs, pass, rsyncFolder, sleep, trim, ucFirst, userguard, warn, writeFile } from '@nocke/util'
import sanitize from '../../src/commands/sanitize.js'
/*
testing the sanitize command (but NOT going through the executable, that happens in executableTest)
 */

describe(autoSuiteName(
  import.meta.url),
() => {

  it('permitted path', () => {
    it('calling sanitize', () => {
      sanitize({}, '/media')
    })
  })

  // negative testing ===============================

  it('negative: inacceptable path', () => {
    assert.throws(
      () => {
        sanitize({}, '/really/bad/path')
      },
      'not an acceptable path' // words that need to be contained in exception thrown
    )
  })

  it('negative: non-existing path', () => {
    assert.throws(
      () => {
        sanitize({}, '/media/notanexistingfolderhere671056710')
      },
      'no such directory'
    )
  })


})
