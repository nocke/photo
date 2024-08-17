'use strict'

import { info, pass, warn } from '@nocke/util' // TODO extract, what's needed to non-external include
import { existsSync, readFileSync } from 'fs'

// “builtin config” -----------------------------------------

// safety measure to only work in subfolders TODO of dedicated places (thus not too broad, in pruning)
const acceptablePaths = [
  '/home',
  '/drive',
  '/depot',
  '/common',
  '/mnt',
  '/share',
  '/media'
]

// REF /depot/script/ts/pruneraw/config.ts

// must be lowercase here for propert comparision
const extVideo = ['mp4', 'avi', 'wmv', 'mov', 'flv', 'mpg', 'mpeg', 'm4v', 'webm', 'vob']
const extImagesNonRaw = ['jpg', 'jpeg', 'png', 'tif', 'tiff', 'gif', 'psd']
const extImagesRaw = ['cr', 'raw', 'cr2', 'cr3', 'dng', 'nef']
const extImages = [...extImagesNonRaw, ...extImagesRaw]
const extMedia = [...extImages, ...extVideo]
const extSidecars = ['xmp', 'dop'] // adobe sidecar, dxo sidecar
const extCruft = ['lrf', 'html'] // DJI low-res previews, DJI Panorama accompaigning html

const extAllRelevant = [...extVideo, ...extImages, ...extSidecars, ...extCruft]

const extSimplifyMap = {
  jpeg: 'jpg',
  tiff: 'tif',
  mpg: 'mpeg' // (sic, 3→4)
}

/**
 * DSC_\d{4} - This is a pattern used by Nikon digital cameras where the filename consists of 4 digits after DSC_.

IMG_\d{4} - This is a pattern used by Canon digital cameras where the filename consists of 4 digits after IMG_.

PM5A\d{4} - This is a pattern used by Pentax digital cameras where the filename consists of 4 digits after PM5A.

DJI_\d{4} - This is a pattern used by DJI drones where the filename consists of 4 digits after DJI_.

P\d{4} or PANO\d{4} - This is a pattern used by some Panasonic digital cameras where the filename consists of 4 digits after P or PANO.

S\d{4} or SONY\d{4} - This is a pattern used by Sony digital cameras where the filename consists of 4 digits after S or SONY.

_MG\d{4} or MVC\d{4} - This is a pattern used by some Olympus digital cameras where the filename consists of 4 digits after _MG or MVC.

GOPR\d{6} - This is a pattern used by GoPro action cameras where the filename consists of 6 digits after GOPR.
 */

// list of core matchers
// • priority does matter, first one wins (i.e Android-date before Android-generic).
export const coreMatchers = [
  // Android-date
  /^(20\d\d[_-]\d\d[_-]\d\d[_-]\d{4,8})(.*)$/i,

  // Android tighter date
  /^(20[0-5]\d[0-1]\d[0-3]\d[_-]\d{6})(.*)$/i,

  // Android-generic
  /^(IMG_?\d{4,8})(.*)$/i,

  // Canon-AdobeRGB
  /^(_MG_\d{4,8})(.*)$/i,

  // Canon-sRGB (normal)
  /^(IMGSX\d{4,8})(.*)$/i,

  // Canon Compact Cam
  /^(DSCN\d{3,8})(.*)$/i,

  // Canon DSLR - 5D mk iii
  /^(PM5A\d{3,6})(.*)$/i,

  // also DJI
  /^(org_photo_\d{6,8}_\d{12,14})(.*)$/i,

  // DJI  (natural or active rename)
  /^(DJI_\d{3,6})(.*)$/i
]

const configBuiltIn = {
  acceptablePaths,

  extVideo,
  extImagesNonRaw,
  extImagesRaw,
  extImages,
  extMedia,
  extSidecars,
  extCruft,
  extAllRelevant,

  extSimplifyMap,

  coreMatchers,

  truth: 'to be overriden in custom config' // used for testing, leave alone
}

// adding in “custom config” ------------------------------------------
if (!!global.config) {
  warn('config already exists!')
  throw new Error('config already exists!')
}

global.config = await (async() => {
  // REF stackoverflow.com/a/65452698
  if (!existsSync(new URL('../config-custom.js',
    import.meta.url))) {
    return configBuiltIn
  }
  const configCustom = (await import(
    '../config-custom.js'
  )).default
  return { ...configBuiltIn, ...configCustom }
})()
