'use strict'
import path from 'path'
import { ensureTrue, warn } from '@nocke/util'

// canonicalizing odd (4-letter) extensions, lowercase
const canonicalizeExt = (ext) => ((config.extSimplifyMap[ext]) ? config.extSimplifyMap[ext] : ext).toLowerCase()

/*
 * @returns
*    base     – everything before extFull (1 or 2 legit extensions)
 *   core     – the matching „name heart“, otherwise everything before extFull and the dot
 *   extLast  – very last extension of file, if any (.JPG, .tiff, .CR2)
 *   extFull  – same as extLast, except on Regular+Sidecar (.JPG.XMP, ...)
 *   extSan   – same as extFull, certainly same lenght, but: lowercased and canonicalized (tiff→tif,…)
 *
 *   NOTE: unknown irrelevant extensions are consided no extension (but part of the filename)
 */
export const getCoreAndExt = (filePath) => {
  const dir = path.dirname(filePath)
  const fileName = path.basename(filePath)

  // assume for now
  let base = fileName
  let extLast = ''

  // correct to base + extension
  const tempFileNameLC = fileName.toLowerCase()
  let extSan = config.extAllRelevant.find((extCandidate) => tempFileNameLC.endsWith('.' + extCandidate)) ?? ''
  if (extSan !== '') {
    base = fileName.substring(0, fileName.length - extSan.length - 1)
    extLast = fileName.substring(fileName.length - extSan.length)
  }

  // assume for now
  let extFull = extLast
  extSan = canonicalizeExt(extSan)

  // hunt for secondary extension
  const tempCoreLC = base.toLowerCase()
  const extSecondLC = config.extAllRelevant.find((extCandidate) => tempCoreLC.endsWith('.' + extCandidate)) ?? ''
  if (extSecondLC !== '') {
    base = fileName.substring(0, fileName.length - extSecondLC.length - extLast.length - 2)
    extFull = fileName.substring(fileName.length - extSecondLC.length - extLast.length - 2 + 1)
    extSan = canonicalizeExt(extSecondLC) + '.' + extSan
  }

  // does core === base hold, or is there a tighter core, based on camera naming rules?
  let match
  config.coreMatchers.find((scheme) => {
    match = base.match(scheme)
    return match !== null
  })
  const core = (match !== null) ? match[1] : base
  ensureTrue(core.length > 0)

  return { dir, fileName, base, core, extLast, extFull, extSan }
}

export default {
  getCoreAndExt
}
