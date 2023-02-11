'use strict'
import path from 'path'
import { ensureTrue, ensureTruthy, info, warn, xor } from '@nocke/util'
import modelUtils from './modelUtils.js'

export default class Member {

  dir
  fileName
  base
  core // everything before extFull and the dot
  extLast // very last extension of file, if any (.JPG, .tiff, .CR2)
  extFull // same as extLast, except on Regular+Sidecar (.JPG.XMP, ...)
  extSan // same as extFull, certainly same lenght, but: lowercased and canonicalized (tiff→tif,…)

  isImage
  isRaw // known raw format (false for anything not being an image)
  isNonRaw // is nonRaw-Image? (false for anything not being an image)
  isVideo
  isMedia // is image or video file
  isSidecar
  isCruft // tempory files (to be deleted)

  constructor(absFilePath) {
    // DEBUG info('Member()', absFilePath)

    // type 'safety'
    ensureTrue(typeof absFilePath === 'string', 'filePath given is not a string')
    ensureTrue(absFilePath.startsWith('/'), `filePath given is not absolut (starting with '')`)

    Object.assign(this, modelUtils.getCoreAndExt(absFilePath))
    ensureTrue(!this.fileName.startsWith('.'), 'no linux hidden files')
    ensureTrue(!this.fileName.startsWith('~'), 'no backup files starting with ~')

    const extLastLC = this.extLast.toLowerCase()

    this.isImage = config.extImages.includes(extLastLC)
    this.isRaw = config.extImagesRaw.includes(extLastLC)
    this.isNonRaw = config.extImagesNonRaw.includes(extLastLC)
    ensureTrue(!this.isImage || xor(this.isRaw, this.isNonRaw), 'not an image, or clear raw detection')

    this.isVideo = config.extVideo.includes(extLastLC)
    this.isMedia = this.isImage || this.isVideo // couldo one day: … || this.isAudio

    this.isSidecar = config.extSidecars.includes(extLastLC)
    this.isCruft = config.extCruft.includes(extLastLC)
  }

  dump() {
    info('Member.dump()', this)
  }

}
