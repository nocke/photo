import fs from 'fs'
import { assert } from 'chai'
import { check, ensureEqual, ensureFolderExists, guard, info, warn } from '@nocke/util'

const src = './node_modules/photo-testfiles/ørig'
const testfolder = './TEST-FOLDER'

beforeEach(async() => {
  info('before')
  ensureFolderExists(src, `could not find testfiles in '${src}', have you done 'npm i'?`)
  const r = guard(`rsync -rtogp --dry-run --exclude='.git' --inplace --delete "${src}/" "${testfolder}"`)
  warn(r)

  const filePaths = fs.readdirSync(testfolder)
  ensureEqual(filePaths.length, 22, `after rsync, there are too few or too many files`)
})


afterEach(async() => {
  info('after')
  const filePaths = fs.readdirSync(testfolder)
  ensureEqual(filePaths.length, 22, `after rsync, there are too few or too many files`)


})


describe.only(autoSuiteName(
  import.meta.url),
() => {

  it('just list', () => {


    guard(`rm '${testfolder}/DJI_0227.JPG'`)


  })


})
