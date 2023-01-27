import { assert } from 'chai'
import '../src/config.js'
// ↑ all tests need the omnipresent [global.]config
// ↑ also no point in importing assertion lib time and again

global.assert = assert // shorthand
global.autoSuiteName=(name) => name.split('/test/',2)[1]

// export const mochaHooks = {
//   beforeEach(done) {
//     console.log('beforeEach hook')
//     const suiteTitle = this.currentTest.parent.title // (too late for modifications)
//     done();
//   }
// }
