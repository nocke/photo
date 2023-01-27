import path from 'path'

import { argv, check, trim, ensureFails, ensureRoot, ensureString, ensureTrue, ensureFalse, ensureTruthy, fail, getInput, guard, userguard, important, info, rsyncFolder, mainWrap, iterate, pass, warn, writeFile, ensureEqual, fileCopy, getFolderSize, makeDirs, ucFirst, sleep, ensureFileOrFolderExists, ensureDirExists, ensureFileExists, getIsoDateAndTime } from '/depot/barejs/util/util.js'

import sanitize from '../src/sanitize.js'

/*
Test, if parameter calling (the wirings of Commander) is halfway reasonable
 */

describe.only(autoSuiteName(import.meta.url),
    () => {

      describe("just some selftesting", () => {

        it.skip("dump global", () => {
          console.warn('global.config:', global.config)
        })

        it("testing", () => {
          sanitize({},'really/bad/path')
          assert.isTrue(true)
        })

        it("basic math", () => {
          assert.equal(1 + 1, 2, 'yeah, math works.')
          assert.equal(global.config.truth, 42, 'global.config works (with `global.`)')
          assert.equal(config.truth, 42, 'global.config works (without `global.`)')
        })

        it.skip("never executed", () => {
          assert.equal(1 + 1, 42, 'Ja, that\'s wrong')
        })
      })

    })
autoSuiteName(import.meta.url)
