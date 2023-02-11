import { assert } from 'chai'
import esmock from 'esmock'
import sinon from 'sinon'

import { warn } from '@nocke/util'

describe(autoSuiteName(import.meta.url),
  () => {

    it('test one', async() => {
      const barSpy = sinon.spy(() => { testSon.third() })

      // reuse directly below within esmocked TestDad:
      const testSon = await esmock('../../src/commands/testSon.js')

      const TestDad = await esmock('../../src/commands/TestDad.js', {
        '../../src/commands/testSon.js': {
          // REF simple override → sonBar: () => { console.log('STEPSON Bar') }
          // REF ↓ retrofitted (of submodule, not possible within!) for spying
          sonBar: barSpy
        }
      })

      // indendent check
      const foo = () => {}
      const fooSpy = sinon.spy(foo)

      fooSpy()
      fooSpy()
      fooSpy()

      // eslint-disable-next-line no-new
      new TestDad()

      // REF https://www.chaijs.com/api/assert/#method_assert
      // REF https://sinonjs.org/releases/latest/spies/

      // various assertion styles:
      assert(fooSpy.calledThrice)
      // same thing:
      assert.strictEqual(fooSpy.callCount, 3)

      assert(barSpy.calledOnce)
      // same thing:
      assert.strictEqual(barSpy.callCount, 1)

    })
  })
