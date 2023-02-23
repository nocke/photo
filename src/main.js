#!/usr/bin/env node
'use strict'

import { readFileSync } from 'fs'
import sanitize from './commands/sanitize.js'
import importMedia from './commands/importMedia.js'

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
  .description('lowercasing, lonely-deletion, cruft removal') // here it's ok
  .argument('<paths...>', 'paths')
  .action(async(_args, _opts, _command) => {
    warn('FYI args (eventName?):', _args)
    warn('FYI opts:', _opts)
    // warn('FYI command:', _command)
    warn('----\nFYI programm opts:', program.opts())
    await sanitize(program.opts(), _args)
  })


// REF
// args: an array of positional arguments passed to the command
// options: an object containing the options passed to the command
// command: the Command object representing the command being executed

program
  .command('import', null, {})
  .description('import fresh media from (known, removable) media locations')
  .argument('[eventName]', 'eventName')
  .action(async(_args, _opts, _command) => {
    warn('FYI args (eventName?):', _args)
    warn('FYI opts:', _opts)
    // warn('FYI command:', _command)
    warn('----\nFYI programm opts:', program.opts())
    await importMedia(program.opts(), _args)
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
