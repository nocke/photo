import path from 'path'
import { assert } from 'chai'

import { argv, check, ensureFolderExists, ensureEqual, ensureFails, ensureFalse, ensureFileExists, ensureFileOrFolderExists, ensureRoot, ensureString, ensureTrue, ensureTruthy, fail, fileCopy, getFolderSize, getInput, getIsoDateAndTime, guard, important, info, iterate, mainWrap, makeDirs, pass, purple, rsyncFolder, sleep, trim, ucFirst, userguard, warn, writeFile } from '@nocke/util'
import sanitize from '../../src/commands/sanitize.js'
import Member from '../../src/model/Member.js'

describe(autoSuiteName(
  import.meta.url),
() => {

  [
    {
      filePath: '/home/memberTest/some.path.cr2.xmp/org_photo_6619360_1644333156000.LoNe.ly.tiFF',
      result: {
        dir: '/home/memberTest/some.path.cr2.xmp',
        fileName: 'org_photo_6619360_1644333156000.LoNe.ly.tiFF',
        base: 'org_photo_6619360_1644333156000.LoNe.ly',
        core: 'org_photo_6619360_1644333156000',
        extLast: 'tiFF',
        extFull: 'tiFF',
        extSan: 'tif',

        isImage: true,
        isRaw: false,
        isNonRaw: true,
        isVideo: false,
        isMedia: true,
        isSidecar: false,
        isCruft: false
      }
    },
    {
      filePath: '/home/DSCN9099_small/some.path.mp4/PM5A4711gt.mPg',
      result: {
        dir: '/home/DSCN9099_small/some.path.mp4',
        fileName: 'PM5A4711gt.mPg',
        base: 'PM5A4711gt',
        core: 'PM5A4711',
        extLast: 'mPg',
        extFull: 'mPg',
        extSan: 'mpeg',

        isImage: false,
        isRaw: false,
        isNonRaw: false,
        isVideo: true,
        isMedia: true,
        isSidecar: false,
        isCruft: false
      }
    },
    {
      filePath: '/home/DSCN9099_small/some.path.cr2.xmp/PM5A4711gt.mp4.Xmp',
      result: {
        dir: '/home/DSCN9099_small/some.path.cr2.xmp',
        fileName: 'PM5A4711gt.mp4.Xmp',
        base: 'PM5A4711gt',
        core: 'PM5A4711',
        extLast: 'Xmp',
        extFull: 'mp4.Xmp',
        extSan: 'mp4.xmp',

        isImage: false,
        isRaw: false,
        isNonRaw: false,
        isVideo: false,
        isMedia: false,
        isSidecar: true,
        isCruft: false
      }
    },
    {
      filePath: '/home/bänänä/DJI_12345löp.LrF',
      result: {
        dir: '/home/bänänä',
        fileName: 'DJI_12345löp.LrF',
        base: 'DJI_12345löp',
        core: 'DJI_12345',
        extLast: 'LrF',
        extFull: 'LrF',
        extSan: 'lrf',

        isImage: false,
        isRaw: false,
        isNonRaw: false,
        isVideo: false,
        isMedia: false,
        isSidecar: false,
        isCruft: true
      }
    }
  ]
    .forEach((c) => {
      it(`getCoreAndExt ${c.filePath}`, () => {

        const m = new Member(c.filePath)
        // DEBUG info(m)
        // DEBUG info(purple(c.result))

        assert.deepStrictEqual(m, c.result)
      }) // it
    })

  it(`negative testing: not an absolute path`, () => {

    assert.throws(() => {
      // eslint-disable-next-line no-new
      new Member('foobar.jpg')
    })
  })

  it(`negative testing: tempfile`, () => {

    assert.throws(() => {
      // eslint-disable-next-line no-new
      new Member('/home/frank/~tempfile.jpg')
    })
  })

  it(`negative testing: hidden file`, () => {

    assert.throws(() => {
      // eslint-disable-next-line no-new
      new Member('/home/frank/.hidden.jpg')
    })

    assert.throws(() => {
      // eslint-disable-next-line no-new
      new Member('/home/frank/.hidden')
    })

  })

})
