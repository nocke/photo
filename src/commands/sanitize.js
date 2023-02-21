'use strict'

import fs from 'fs'
import path from 'path'
import { ensureEqual, ensureFileOrFolderOrLinkExists, ensureFolderExists, ensureTrue, important, info, isFile, pass, purple, red, sleepWithKeypress, warn } from '@nocke/util'
import { ensureAcceptablePath } from '../common/utils.js'
import { getCoreAndExt } from '../model/modelUtils.js'
import Family from '../model/Family.js'
import Member from '../model/Member.js'
import fileUtils from './fileUtils.js'

const nothingToDo = (stats) => (
  stats.filesRenamed === 0 &&
  stats.lonelyDeleted === 0 &&
  stats.cruftRemoved === 0)

export default async(opts, folderPaths) => {
  // DEBUG
  info('options: ', opts)

  // TODO
  ensureTrue(folderPaths.length === 1, 'currently only 1 path supported')
  const folderPath = folderPaths[0]

  // eslint-disable-next-line unused-imports/no-unused-vars
  const live = !!opts.live
  // eslint-disable-next-line unused-imports/no-unused-vars
  const verbose = !!opts.verbose
  const wait = (!opts.wait)
  // by default: show stats on dry run, not on live
  const showStats = (opts.stats === undefined) ? !live : opts.stats

  verbose && info('COMMAND Sanitize ===============')

  // NEXT:  on live, have two runs with
  //  sleepWithKeypress
  if (!live) {
    const run = sanitizeFolders(folderPath, false, verbose, showStats)

    if (nothingToDo(run)) {
      pass(`Done dry-run. Nothing to do on '${folderPath}'`, run)
      return
    }
    info('Done dry-run. use `--live` to actually perform deletion')

  } else {

    const preRun = sanitizeFolders(folderPath, false, false, showStats)

    if (nothingToDo(preRun)) {
      pass(`Nothing to do on '${folderPath}'`, preRun)
      return
    }

    if (wait) {
      warn('press any letter within 3 seconds to not perform live')
      const char = await sleepWithKeypress(3000)
      if (char !== '') {
        warn('live execution aborted')
        return
      }
    }

    sanitizeFolders(folderPath, true, verbose, false)
  }
}

const sanitizeFolders = (folderPath, live, verbose, showStats) => {

  ensureTrue(folderPath === '.' ||
        folderPath.startsWith('./') ||
        folderPath.startsWith('../') ||
        folderPath.startsWith('/'),
        `folderPath '${folderPath}' must begin with '.','./','../' or '/' (absolute path)`
  )

  const absDirPath = path.resolve(folderPath)
  // DEBUG info(`absPath: ${absDirPath}`)
  ensureTrue(absDirPath.startsWith('/'), `not an absolute path ${absDirPath}`)
  ensureAcceptablePath(absDirPath) // nothing crazy like '/' or system dirs

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

    // DEBUG important(absFilePath, '   ---   ', purple(core, fileName, extSan, extSan === ''))
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
  verbose && info(`execute sanitation ( ${!live ? 'dry-run' : red('LIVE')} ) ============`)
  // --------------------------------------------------

  const stats = {
    lonelyDeleted: 0,
    cruftRemoved: 0,
    filesRenamed: 0
  }

  // DEBUG important('DUMP FAMILY ================')
  // families.forEach((family) => {
  //   family.dump()
  // })

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

  showStats && info(
    `stats: \n`,
    stats, `\n` // TODO: this is nicely testable!
  )
  return stats
}
