import { assert } from 'chai'
import { check, guard, warn } from '@nocke/util'

/*
  Testing by indeed calling the command on the test folder:
 */

describe(autoSuiteName(
  import.meta.url),
() => {
  it('help string sanity test', () => {
    const r = guard('./photo', { mute: true })
    assert(r.includes('help for help'), 'just brief message on parameterless')
    const numNewLines = r.split('\n').length - 1
    assert.isBelow(numNewLines, 6, `parameterless \`photo\` should only yield version and one-line help message`)
  })

  it('help string sanity test', () => {
    const r = guard('./photo --help', { mute: true })
    assert.include(r, 'Usage:')
  })

  it('regular sanitize run /w sanitize keyword', () => {
    const r = guard('./photo -v sanitize ./TEST-FOLDER', { mute: true })
    assert.include(r, 'lonelyDeleted:', 'no stats mentioned')
  })

  it('regular sanitize run w/o sanitize keyword', () => {
    // and verbose param last (just for kicks)
    const r = guard('./photo ./TEST-FOLDER -v', { mute: true })
    assert.include(r, 'lonelyDeleted:', 'no stats mentioned')
  })

  // negative testing
  it('nonsense command must not return 0', () => {
    // since there's an optional command (sanitize),
    // totalnonsense will be regarded a directory and fail _then_ ...
    assert.notEqual(0, check('./photo totalnonsense', { mute: true }))
  })

})
