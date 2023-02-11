import { assert } from 'chai'
import modelUtils from '../../src/model/modelUtils.js'
import { purple, warn } from '@nocke/util'

/*
Test, if property and core creation works for all those edge cases
 */

describe(autoSuiteName(
  import.meta.url),
() => {

  [
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/LoNe.ly.CR2',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'LoNe.ly.CR2', core: 'LoNe.ly', base: 'LoNe.ly', extLast: 'CR2', extFull: 'CR2', extSan: 'cr2' }
    },
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/LoNe.ly.xMp',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'LoNe.ly.xMp', core: 'LoNe.ly', base: 'LoNe.ly', extLast: 'xMp', extFull: 'xMp', extSan: 'xmp' }
    },
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/LoNe.ly.Cr.XmP',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'LoNe.ly.Cr.XmP', core: 'LoNe.ly', base: 'LoNe.ly', extLast: 'XmP', extFull: 'Cr.XmP', extSan: 'cr.xmp' }
    },
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/@LoNe.ly.DOP',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: '@LoNe.ly.DOP', core: '@LoNe.ly', base: '@LoNe.ly', extLast: 'DOP', extFull: 'DOP', extSan: 'dop' }
    },
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/DJI_123456-gt_02öäüß.pNg.Xmp',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'DJI_123456-gt_02öäüß.pNg.Xmp', core: 'DJI_123456', base: 'DJI_123456-gt_02öäüß', extLast: 'Xmp', extFull: 'pNg.Xmp', extSan: 'png.xmp' }
    },
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/org_photo_6619360_1644333156000gt.tiFF',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'org_photo_6619360_1644333156000gt.tiFF', core: 'org_photo_6619360_1644333156000', base: 'org_photo_6619360_1644333156000gt', extLast: 'tiFF', extFull: 'tiFF', extSan: 'tif' }
    },
    {
      filePath: '/home/DSCN9099_small/søme.päth.cr2.xmp/PM5A4711.gt.tIff.DOP',
      should: { dir: '/home/DSCN9099_small/søme.päth.cr2.xmp', fileName: 'PM5A4711.gt.tIff.DOP', core: 'PM5A4711', base: 'PM5A4711.gt', extLast: 'DOP', extFull: 'tIff.DOP', extSan: 'tif.dop' }
    },
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/LoNe.ly',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'LoNe.ly', core: 'LoNe.ly', base: 'LoNe.ly', extLast: '', extFull: '', extSan: '' }
    },
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/LoNe.lypNgxmp',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'LoNe.lypNgxmp', core: 'LoNe.lypNgxmp', base: 'LoNe.lypNgxmp', extLast: '', extFull: '', extSan: '' }
    },
    { // yes, no dot (thus must not match)
      filePath: '/home/foo/@søme.päth.cr2.xmp/somethingjpg',
      should: { dir: '/home/foo/@søme.päth.cr2.xmp', fileName: 'somethingjpg', core: 'somethingjpg', base: 'somethingjpg', extLast: '', extFull: '', extSan: '' }
    },
    { // yes, oddity
      filePath: '/home/foo/søme.päth.cr2.xmp/dotty.ly.',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'dotty.ly.', core: 'dotty.ly.', base: 'dotty.ly.', extLast: '', extFull: '', extSan: '' }
    },
    {
      filePath: '/home/foo/søme.päth.cr2.xmp/DSCN9099_small.jPG',
      should: { dir: '/home/foo/søme.päth.cr2.xmp', fileName: 'DSCN9099_small.jPG', core: 'DSCN9099', base: 'DSCN9099_small', extLast: 'jPG', extFull: 'jPG', extSan: 'jpg' }
    }
  ]
    .forEach((c) => {
      it(`getCoreAndExt ${c.filePath}`, () => {
        const is = modelUtils.getCoreAndExt(c.filePath)
        // DEBUG warn(purple(is))
        assert.strictEqual(c.should.dir, is.dir, `asserting 'dir'`)
        assert.strictEqual(c.should.fileName, is.fileName, `asserting 'fileName'`)
        assert.strictEqual(c.should.core, is.core, `asserting 'core'`)
        assert.strictEqual(c.should.base, is.base, `asserting 'base'`)
        assert.strictEqual(c.should.extLast, is.extLast, `asserting 'extLast'`)
        assert.strictEqual(c.should.extFull, is.extFull, `asserting 'extFull'`)
        assert.strictEqual(c.should.extSan, is.extSan, `asserting 'extSan'`)

        // and some more inherent sanity
        // • file must add up (trailing dot on fileName minor exception on adding)
        assert.strictEqual(
          is.fileName,
          is.base + ((is.extFull.length > 0) ? `.${is.extFull}` : '')
        )
      }) // it
    })

})
