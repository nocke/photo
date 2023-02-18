#!/usr/bin/env node
'use strict'

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import path from 'path'
import sanitize from './commands/sanitize.js'

import './config.js'

import { argv, blue, check, ensureEqual, ensureFails, ensureFalse, ensureFileExists, ensureFileOrFolderExists, ensureFolderExists, ensureRoot, ensureString, ensureTrue, ensureTruthy, fail, fileCopy, getFolderSize, getInput, getIsoDateAndTime, green, guard, important, info, iterate, mainWrap, makeDirs, pass, purple, red, rsyncFolder, sleep, trim, ucFirst, userguard, validateOptions, warn, writeFile, yellow } from '@nocke/util'

import { Command } from 'commander'
import TestDad from './commands/TestDad.js'
import { sonFoo } from './commands/testSon.js'
// DEBUG  info(purple(config))

const program = new Command()

// grab version from package.json
const pkg = JSON.parse(
  readFileSync(new URL('../package.json',
    import.meta.url))
)
info(`photo v${pkg.version}`)

program
  .version(pkg.version)
  .option('-v, --verbose', 'log more details')
  .option('-l, --live', 'do it (all else is dry-run')
  .on('option:verbose', () => {
    info('TODO: higher verbosity')
    // global.app.verbose = true
    // log.setLevel(log.LEVELS.INFO)
  })

program
  .on('--help', () => {
    info([
      '  Use TODO TODO ',
      '  another line TODO'
    ].join('\n'))
  })


program
  .command('sanitize', null, { isDefault: true }) // do not use description (would mean standalone)
  .argument('[path]', 'path, otherwise default path assumed')
  .action((path) => sanitize(program.opts(), path))

try {
  // if no parameters whatsoever, just output (after above version ↑) short help notice
  if (argv.length === 0) {
    info(`  use --help for help\n`)
  } else {
    await program.parseAsync()
  }
} catch (error) {
  const stackTrace = error.stack
  if (!!program.opts().verbose) {
    warn(stackTrace)
  } else {
    const firstLine = stackTrace.split('\n', 1)[0]
    const trimmedFirstLine = firstLine.replaceAll(/Error: |fail\(\): /g, '')
    console.error(trimmedFirstLine)
    warn('rerun with verbose `-v` for more details\n')
  }
  process.exit(1)
}

info(green('DONE.\n'))
