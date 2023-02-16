import { assert } from 'chai'
import { check, guard, warn } from '@nocke/util'

/*
  Testing by indeed calling the command on the test folder:
 */

describe(autoSuiteName(
  import.meta.url),
() => {
  it('help string sanity test', () => {
    const r = guard('./photo --help', { mute: true })
    assert(r.includes('Usage:'), 'help does not contain \'Usage:\'')
  })

  it('regular sanitize run', () => {
    const r = guard('./photo -v sanitize ./TEST-FOLDER', { mute: true })
    assert(r.includes('stats'), 'no stats mentioned')
  })

  // negative testing
  it('nonsense command must not return 0', () => {
    // since there's an optional command (sanitize),
    // totalnonsense will be regarded a directory and fail _then_ ...
    assert.notEqual(0, check('./photo totalnonsense', { mute: true }))
  })

})
