'use strict'

import fs, { readFileSync } from 'fs'
import path from 'path'
import { argv, check, ensureDirExists, ensureEqual, ensureFails, ensureFalse, ensureFileExists, ensureFileOrFolderExists, ensureRoot, ensureString, ensureTrue, ensureTruthy, fail, fileCopy, getFolderSize, getInput, getIsoDateAndTime, green, guard, important, info, iterate, mainWrap, makeDirs, pass, rsyncFolder, sleep, trim, ucFirst, userguard, warn, writeFile } from '/depot/barejs/util/util.js'
import { ensureAcceptablePath } from './common/utils.js'

export default (opts, filePath = '.') => {
    info(`COMMAND Sanitize ===============`)
    // info('options: ', opts)
    // info(`filePath: ${filePath}`)
    const absPath = path.resolve(filePath)
    info(`absPath: ${absPath}`)

    ensureAcceptablePath(absPath)
}
