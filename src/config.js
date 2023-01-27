'use strict'

import { info, pass, warn } from '../../barejs/util/util.js'  // TODO extract, what's needed
import { existsSync, readFileSync } from 'fs'

// “builtin config” -----------------------------------------
const acceptablePaths = [
  '/home',
  '/drive',
  '/depot',
  '/common',
  '/share',
  '/media'
]

const truth = 42 // used for testing

const configBuiltIn = {
  acceptablePaths,
  truth
}

// “custom config” ------------------------------------------
if (!!global.config) {
  warn('config already exists!')
  throw new Error('config already exists!')
}

global.config = await (async () => {
  // REF stackoverflow.com/a/65452698
  if (!existsSync(new URL('../config-custom.js',
    import.meta.url))) {
    return configBuiltIn
  }
  const configCustom = (await import(
    '../config-custom.js'
  )).default
  return { ...configBuiltIn, ...configCustom }
})()
