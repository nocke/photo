import { assert } from 'chai'
import { purple, warn } from '@nocke/util'
import Family from '../../src/model/Family.js'
import Member from '../../src/model/Member.js'

const addMembers = (family, ...memberPaths) => {
  for (const memberPath of memberPaths) {
    family.add(new Member(memberPath))
  }
}

describe(autoSuiteName(import.meta.url), () => {
  it('family creation', () => {

    const family = new Family('_MG_1234')
    assert(family instanceof Family, 'instance wrong (wtf?)')

    /* two RAWs (yeah, hypothetical), still: 'lonely'
     * one cruft (lrf), one irrelevant (txt), one sidevar (dop)
     */
    addMembers(
      family,
      '/home/DSCN9099_small/some.path/_MG_1234-Smørrebröd.CR2',
      '/home/DSCN9099_small/some.path/_MG_1234-Smørrebröd.DNG',
      '/home/DSCN9099_small/some.path/_MG_1234-Smørrebröd.txt',
      '/home/DSCN9099_small/some.path/_MG_1234-Smørrebröd.lrF',
      '/home/DSCN9099_small/some.path/_MG_1234-Smørrebröd.dOP'
    )

    assert.equal(family.getAllMembers().length, 5)
    assert.equal(family.getCruftMembers().length, 1)
    assert.equal(family.getLonelyMembers().length, 3)

    assert.isTrue(family.hasRaw())
    assert.isTrue(family.hasLoneleyRaw())
    assert.isTrue(!family.hasNonRaw())
    assert.isTrue(!family.hasVideo())
    assert.isTrue(family.hasLoneleyRaw())
  })

  // negative testing ===================================================

  it('negative: core contained does not match', () => {

    const family = new Family('_MG_1234')

    assert.throws(() => {
      addMembers(family, '/home/DSCN9099_small/some.path/_MG_2345-Smørrebröd.CR2')
    })
  })

  it('negative: path is not absolute', () => {
    const family = new Family('_MG_1234')
    const m = new Member('/some.path/_MG_1234-Smørrebröd.CR2')
    m.dir = m.dir.substring(1)
    warn(purple(m.dir))

    assert.throws(() => {
      family.add(m)
    }, 'absolute')
  })

  it('negative: double add (noticable by path as primary key)', () => {

    const family = new Family('_MG_1234')

    assert.throws(() => {
      addMembers(
        family,
        '/home/DSCN9099_small/some.path/_MG_1234-Smørrebröd.CR2',
        '/home/DSCN9099_small/some.path/_MG_1234-Smørrebröd.CR2' // ← bad double add()
      )
    }, 'double')
  })

})
