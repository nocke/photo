'use strict'

import { argv, check, ensureDirExists, ensureEqual, ensureFails, ensureFalse, ensureFileExists, ensureFileOrFolderExists, ensureRoot, ensureString, ensureTrue, ensureTruthy, fail, fileCopy, getFolderSize, getInput, getIsoDateAndTime, green, guard, important, info, iterate, mainWrap, makeDirs, pass, rsyncFolder, sleep, trim, ucFirst, userguard, warn, writeFile } from '/depot/barejs/util/util.js'

const config = global.config

export const ensureAcceptablePath = (absPath) => {

    ensureTrue(global.config.acceptablePaths.some(path => absPath.startsWith(path)),
      `'${absPath}' is not an acceptable path`
    )

}

export default {
    ensureAcceptablePath
}
