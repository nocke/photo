/*
 * file Utilities (delete, rename) for use by the commands
 *
 * benefits of having this:
 * • “outsourcing” is most useful for testing
 * • verbosity flag
 * • live flag (aka “not dry-run”)
 * • some assertion, no accidental wildcards, etc
 * • all async (for now)
 * • wrapping recycle-bin functionality
 * • throwing on failure (not returning false and putting that bloat onto the caller)
 *
 */
'use strict'

import trash from 'trash'
import fs from 'fs'
import { ensureFalse, ensureTrue, warn } from '@nocke/util'

export const deleteFile = async(absPath, live, verbose, reason) => {

  ensureTrue(live !== undefined && verbose !== undefined && reason !== undefined, 'must specify all parameters')
  ensureTrue(absPath.startsWith('/'), `not an absolute path '${absPath}'`)
  ensureFalse(absPath.includes('*'), `no wildcards allowed in '${absPath}'`)

  verbose && warn(`delete file '${reason}':`, absPath)
  live && await trash([absPath])
}

export const renameFile = (dir, srcName, destName, live, verbose, reason) => {
  verbose && warn(`rename file '${reason}':`, dir + '/' + srcName, ' →to→ ', dir + '/' + destName)
  live && fs.renameSync(dir + '/' + srcName, dir + '/' + destName)
}

export default {
  deleteFile,
  renameFile
}
