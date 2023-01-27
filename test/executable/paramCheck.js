import { assert } from 'chai'

import { argv, check, trim, ensureFails, ensureRoot, ensureString, ensureTrue, ensureFalse, ensureTruthy, fail, getInput, guard, userguard, important, info, rsyncFolder, mainWrap, iterate, pass, warn, writeFile, ensureEqual, fileCopy, getFolderSize, makeDirs, ucFirst, sleep, ensureFileOrFolderExists, ensureDirExists, ensureFileExists, getIsoDateAndTime } from '/depot/barejs/util/util.js'

/*
Test, if parameter calling (the wirings of Commander) is halfway reasonable
 */

describe(autoSuiteName(
    import.meta.url), () => {
    it("truly get help", () => {
        const r = guard('./photo --help', { mute: true })
        assert.include(r, 'Usage:', `help does not contain 'Usage:'`)
    })

    it.skip("nonsense command must not return 0", () => {
        // since there's an optional command (sanitize),
        // it will be regarded a directory and fail _then...
        guard('.photo totalnonsense')
    })
})
