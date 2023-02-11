import { ensureFolderExists, info } from '@nocke/util'
import { assert } from 'chai'

/*
some sanity testing and idioms
 */

describe(autoSuiteName(import.meta.url),
  () => {

    describe('just some selftesting', () => {

      it('config works', () => {
        assert.equal(global.config.truth, 42, 'global.config works (with `global.`)')
        assert.equal(config.truth, 42, 'global.config works (without `global.`)')
      })

      it('assert throws', () => {
        assert.throws(() => {
          assert.equal(1 + 1, 42)
        })
      })

      it('“new” utils', () => {
        console.log('Ja.')
        info('new info')
        ensureFolderExists('./src')
        assert.throw(() => {
          ensureFolderExists('./marsupilami')
        }, 'no such')

      })

    })

  })
