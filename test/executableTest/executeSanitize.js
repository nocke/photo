import fs from 'fs'
import { assert } from 'chai'
import { ensureEqual, ensureFolderExists, guard, pass, warn } from '@nocke/util'
import { info } from 'console'

// REF for manual regression
// rsync found in ./script/sync-testfiles

// test, fully executing the command line command
// • no async, no wait for that very reason!

describe(autoSuiteName(
  import.meta.url),
function() {
  this.timeout(2000)

  const src = './node_modules/photo-testfiles/ørig'
  const testfolder = './TEST-FOLDER'

  const numTestFilesTotal = 36 + 2
  const lonelyDeleted = 7
  const cruftRemoved = 5
  const filesRenamed = 16

  beforeEach(async() => {
    ensureFolderExists(src, `could not find testfiles in '${src}', have you done 'npm i'?`)
    guard(`rsync -rtogp --exclude='.git' --inplace --delete "${src}/" "${testfolder}"`)
    guard(`ln -sf ../README.md ${testfolder}/DJI_6665validLinkButLinkEh.jpg`)
    guard(`ln -sf /road/to/nowhere ${testfolder}/DJI_6666.jpeg`)
    const filePaths = fs.readdirSync(testfolder)

    ensureEqual(numTestFilesTotal, filePaths.length, `A after rsync, there are too ${numTestFilesTotal > filePaths.length ? 'few' : 'many'} files. ${filePaths.length} instead of ${numTestFilesTotal}`)

    pass('rsync’ed TEST-FILDER...')
  })

  it('perform sanitize - not live', () => {
    // stats on by default
    const r = guard(`./photo sanitize ${testfolder}`, { mute: true })
    // DEBUG  info(r)

    // assert stats output
    assert.include(r, `totalFilesBefore: ${numTestFilesTotal}`)
    assert.include(r, `lonelyDeleted: ${lonelyDeleted}`)
    assert.include(r, `cruftRemoved: ${cruftRemoved}`)
    assert.include(r, `filesRenamed: ${filesRenamed}`)
    assert.notInclude(r, `totalFilesAfter:`) // no effective total when not live

    // ...and that nothing actually happened
    ensureEqual(
      numTestFilesTotal, fs.readdirSync(testfolder).length,
      `if not live, number of test files must remain the same`
    )
  })

  it('perform sanitize - verbose, live', () => {

    // `-s` → need stats!
    const r = guard(`./photo sanitize -vsl ${testfolder}`, { mute: true })
    // DEBUG info(purple(r))

    // assert certain stats output
    assert.include(r, `totalFilesBefore: ${numTestFilesTotal}`)
    assert.include(r, `lonelyDeleted: ${lonelyDeleted}`)
    assert.include(r, `cruftRemoved: ${cruftRemoved}`)
    assert.include(r, `filesRenamed: ${filesRenamed}`)

    // totalFilesAfter: check stats speak truth and actual files speak truth:
    const numFilesAfter = numTestFilesTotal - lonelyDeleted - cruftRemoved
    assert.include(r, `totalFilesAfter: ${numFilesAfter}`)

    // ...and that the right thing actually happened
    const isFiles = fs.readdirSync(testfolder)
    ensureEqual(
      numFilesAfter, isFiles.length,
      `if not live, number of test files must remain the same`
    )

    // ensure en detail
    const shouldFiles = [
      '20190723_190709.jpg',
      '20200814_153902 Alpenpass.jpg',
      'DJI_0123.jpg',
      'DJI_0222 Skiing.MP4.x264.crf28.mute.mp4',
      'DJI_0222 Skiing.MP4.x264.crf28.mute.mp4.xmp',
      'DJI_0222 Ski.mp4',
      'DJI_0222 Ski.xmp',
      'DJI_0227gt.jpg',
      '~DJI_0227.jpg',
      'DJI_0227.jpg',
      'DJI_0227.TXT',
      'DSCN0179.mov',
      'DSCN0179.mov.xmp',
      'DSCN1234.tiff',
      'DSCN9099_small.jpg',
      'DSCN9099.dop',
      'DSCN9099.cr2.dop',
      'fiesch.png',
      'fully-tagged.jpg',
      'org_photo_6619372_1644334370000.gt.jpg',
      'Thumbs.db',
      'Thumbs.db:encryptable',
      'TÏschlérn2.tif',
      'TÏschlérn.tif',
      'DJI_6665validLinkButLinkEh.jpg',
      'DJI_6666.jpeg'
    ]

    // merge, avoid duplicats, sort (case-insensitive)
    const bothFiles = [...new Set([...isFiles, ...shouldFiles])].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))

    const missing = []

    bothFiles.forEach(f => {
      if (!isFiles.includes(f)) {
        missing.push(`shouldFile '${f}' missing in actually remaining files`)
      }
      if (!shouldFiles.includes(f)) {
        missing.push(`actually found File '${f}' not anticipated`)
      }
    })

    // output any discrepancies en bloc
    assert(missing.length === 0, '\n' + missing.join('\n'))
  })
})
