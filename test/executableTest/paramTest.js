import { assert } from 'chai'
import { check, guard } from '@nocke/util'

/*
Testing, if parameter calling (the wirings of Commander) is halfway reasonable
 */


describe(autoSuiteName(
  import.meta.url),
() => {

  it('help string sanity test', () => {
    const r = guard('./photo --help', { mute: true })
    assert(r.includes('Usage:', 'help does not contain \'Usage:\''), 'help string sanity test')
  })

  it.skip /*TODO*/('regular sanitize run', () => {
    // yes, this may run on the ORIG folder, as I am not going live...
    const r = guard('./photo -v sanitize ../../../common/images/TEST-FOLDER', { mute: true })
    assert(r.includes('Usage:', 'help does not contain \'Usage:\''), 'help string sanity test')
  })





  // negative testing

  it('nonsense command must not return 0', () => {
    // since there's an optional command (sanitize),
    // totalnonsense will be regarded a directory and fail _then_ ...
    assert.notEqual(0, check('./photo totalnonsense', { mute: true }))
  })

})
