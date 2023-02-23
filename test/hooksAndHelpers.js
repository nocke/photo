import '../src/config.js'
// ↑ all tests need the omnipresent [global.]config

global.autoSuiteName = (name) => name.split('/test/', 2)[1]

// export const mochaHooks = {
//   beforeEach(done) {
//     console.log('beforeEach hook')
//     const suiteTitle = this.currentTest.parent.title // (too late for modifications)
//     done();
//   }
// }

// REF stackoverflow.com/a/18543419
global.captureStream = (stream) => {
  const oldWrite = stream.write
  let buf = ''
  stream.write = function(chunk, _encoding, _callback) {
    buf += chunk.toString() // chunk is a String or Buffer
    oldWrite.apply(stream, arguments)
  }

  return {
    unhook: function unhook() {
      stream.write = oldWrite
    },
    captured: function() {
      return buf
    }
  }
}

// to skip certain things (i.e. wait depending on TTY)
process.env.mochaRunning = '1'
