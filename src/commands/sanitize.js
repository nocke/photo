'use strict'

import fs from 'fs'
import path from 'path'
import { ensureEqual, ensureFileOrFolderOrLinkExists, ensureFolderExists, ensureTrue, important, info, isFile, purple, warn } from '@nocke/util'
import { ensureAcceptablePath } from '../common/utils.js'
import { getCoreAndExt } from '../model/modelUtils.js'
import Family from '../model/Family.js'
import Member from '../model/Member.js'
import fileUtils from './fileUtils.js'

export default (opts, filePath = '.') => {
  // DEBUG info('options: ', opts)
  // eslint-disable-next-line unused-imports/no-unused-vars
  const live = !!opts.live
  // eslint-disable-next-line unused-imports/no-unused-vars
  const verbose = !!opts.verbose

  verbose && info('COMMAND Sanitize ===============')

  const absDirPath = path.resolve(filePath)
  // DEBUG info(`absPath: ${absDirPath}`)
  ensureTrue(absDirPath.startsWith('/'), `not an absolute path ${absDirPath}`)

  ensureAcceptablePath(absDirPath)
  ensureFolderExists(absDirPath, `could not read directoy '${absDirPath}'`)
  const filePaths = fs.readdirSync(absDirPath)

  const families = new Map()

  // --------------------------------------------------
  // Parse Files into families and members
  // --------------------------------------------------
  // filePath(s) ist just shallow fileNam(s), no recursion into subfolders yet
  for (const filePath of filePaths) {
    const absFilePath = absDirPath + '/' + filePath
    ensureFileOrFolderOrLinkExists(absFilePath)

    if (!isFile(absFilePath)) {
      continue
    }

    const { core, fileName, extSan } = getCoreAndExt(absFilePath)
    ensureEqual(filePath, fileName, 'sanity') // ‘roundtrip’ sanity

    important(absFilePath, '   ---   ', purple(core, fileName, extSan, extSan === ''))
    if ( // leave alone...
      ['.', '~'].includes(fileName.substring(0, 1)) || // ...hidden and temp files
      extSan === '' // ...extensionless files( COULDDO: `mimetype` one day)
      // ↑ and thereby also irrelevant files (which do not get an extSan)
    ) {
      continue
    }

    // basename taken as core for “Singles”
    // open new Family if needed
    let family = families.get(core)
    if (!family) {
      // DEBUG warn(`creating family for  ${core}`)
      family = new Family(core)
      families.set(core, family)
    }

    family.add(new Member(absFilePath))
  }

  // --------------------------------------------------
  warn('execute sanitation ( dry or live ) ============')
  // --------------------------------------------------

  const stats = {
    lonelyDeleted: 0,
    cruftRemoved: 0,
    filesRenamed: 0
  }

  // important('DUMP FAMILY ================')
  // families.forEach((family) => {
  //   family.dump()
  // })

  important('execute pruning')
  warn('------------------------------------')
  warn('------------------------------------')

  families.forEach((family /*, core */) => {
    verbose && important(`Family ${family.core}(${family.members.size})`)
    let dirty = false

    // 1) prune lonely RAWs (and lonely sidecars!)
    if (family.hasLoneleyRaw()) {
      family.getLonelyMembers().forEach(m => {
        fileUtils.deleteFile(m.dir + '/' + m.fileName, live, verbose, 'lonely')
        stats.lonelyDeleted++
        dirty = true
        family.remove(m)
      })
    }

    // 2) cruft removal
    family.getCruftMembers().forEach(m => {
      fileUtils.deleteFile(m.dir + '/' + m.fileName, live, verbose, 'cruft')
      stats.cruftRemoved++
      dirty = true
      family.remove(m)
    })

    // 3) lowercase rename
    family.getAllMembers().filter(m => m.extSan.length > 0).forEach(m => {
      const srcName = m.fileName
      const destName = m.base + '.' + m.extSan

      if (srcName !== destName) {
        fileUtils.renameFile(absDirPath, srcName, destName, live, verbose, 'sanitation rename')
        stats.filesRenamed++
        dirty = true
      }
    })

    !dirty && verbose && info(`(unchanged)`)
  })

  info(
    `stats: \n`,
    stats, `\n` // TODO: this is nicely testable!
  )
}
