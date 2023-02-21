#!/usr/bin/env node
'use strict'

import { readFileSync } from 'fs'
import sanitize from './commands/sanitize.js'

import './config.js'

import { argv, green, info, warn } from '@nocke/util'

import { Command } from 'commander'
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
  .option('-s, --stats', 'force stats')
  .option('-n, --no-stats', 'force no stats')
  .option('--no-wait', { hidden: true }, true) // (needed for testing)
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
  .argument('<paths...>', 'paths')
  .action(async(paths, _opts) => {
    //  warn('FYI paths:', paths)
    //  warn('FYI opts:', _opts)
    //  warn('FYI programm opts:', program.opts())
    await sanitize(program.opts(), paths)
  })

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
