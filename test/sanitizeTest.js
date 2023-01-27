import path from 'path'

import { argv, check, trim, ensureFails, ensureRoot, ensureString, ensureTrue, ensureFalse, ensureTruthy, fail, getInput, guard, userguard, important, info, rsyncFolder, mainWrap, iterate, pass, warn, writeFile, ensureEqual, fileCopy, getFolderSize, makeDirs, ucFirst, sleep, ensureFileOrFolderExists, ensureDirExists, ensureFileExists, getIsoDateAndTime } from '/depot/barejs/util/util.js'
import sanitize from '../src/sanitize.js'

// import sanitize from '../../src/sanitize'
/*
Test, if parameter calling (the wirings of Commander) is halfway reasonable
 */

describe.only(autoSuiteName(
        import.meta.url),
    () => {
        it("calling sanitize", () => {
          sanitize({},'really/bad/path')
          assert.isTrue(true)
        })

    })
