'use strict'

import { argv, check, ensureEqual, ensureFails, ensureFalse, ensureFileExists, ensureFileOrFolderExists, ensureFolderExists, ensureRoot, ensureString, ensureTrue, ensureTruthy, fail, fileCopy, getFolderSize, getInput, getIsoDateAndTime, green, guard, important, info, iterate, mainWrap, makeDirs, pass, purple, rsyncFolder, sleep, trim, ucFirst, userguard, warn, writeFile } from '@nocke/util'
import Member from './Member.js'


export default class Family {

  core = undefined
  members = new Map()

  constructor(core) {
    ensureEqual('string', typeof core, 'invalid core argument')
    this.core = core
  }

  add(member) {
    ensureTrue(member instanceof Member, 'can only add Members as member')
    ensureTrue(member.core === this.core)
    ensureTrue(member.dir.substring(0, 1) === '/', 'path is not absolute')
    // fully qualified absolute path incl. extension as unique key here
    ensureTrue(!this.members.has(member.fileName), `double filename '${member.fileName}'`)

    this.members.set(member.fileName, member)
  }

  remove(member) {
    ensureTrue(this.members.delete(member.fileName), `remove(): Family has no member ${member.fileName}`)
  }

  hasNonRaw = () => [...this.members.values()].some(m => m.isNonRaw)
  hasRaw = () => [...this.members.values()].some(m => m.isRaw)
  hasVideo = () => [...this.members.values()].some(m => m.isVideo)

  // in other words: only raw-leftovers that may be deleted?
  // at least one non-raw image file disqualifies
  hasLoneleyRaw = () => this.hasRaw() && !this.hasNonRaw()

  getAllMembers = () => [...this.members.values()]

  getCruftMembers = () => this.getAllMembers().filter(m => m.isCruft)

  /* basically all files, except video files (precaution, since no use case) */
  getLonelyMembers = () => (this.hasLoneleyRaw() ? this.getAllMembers() : [])
    .filter(m => m.isRaw || m.isSidecar)


  dump() {
    info(purple('=========================================='))
    info(purple('Family.dump(', `core: ${this.core}`))
    info(purple('numMembers:', this.members.size))
    info(purple('hasRaw:', this.hasRaw()))
    info(purple('hasNonRaw:', this.hasNonRaw()))
    info(purple('hasLoneleyRaw:', this.hasLoneleyRaw()))

    this.members.forEach((member) => {
      member.dump()
    })
  }

}
