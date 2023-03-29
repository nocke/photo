#!/usr/bin/env node
import { spawn } from 'child_process'
import fs from 'fs'

const args = process.argv.slice(2)

if (args.length < 1) {
  console.error('\x1b[91m%s\x1b[0m', 'usage: <watchfile> <execution script> ✗✗✗')
  console.error('example: saveloop <watchfile-or-dir> "foo param1 param2" ["command2"] ["command3"]')
  console.error('(node_modules within a watchdir won\'t be watched)')
  process.exit(1)
}

const watchTarget = args[0]
const commandList = args.length === 1 ? [args[0]] : args.slice(1)

if (!fs.existsSync(watchTarget)) {
  console.error('\x1b[91m%s\x1b[0m', `to be watched file/folder '${watchTarget}' does not exist ✗✗✗`)
  process.exit(1)
}

const runCommands = () => {
  commandList.forEach(cmd => {
    const [command, ...args] = cmd.split(' ')
    spawn(command, args, { stdio: 'inherit' })
  })
}

console.log('watching.... (saveloop variant 1)')
runCommands()

fs.watch(watchTarget, { recursive: true }, (eventType, filename) => {
  if (filename && !filename.includes('node_modules') && !filename.startsWith('.')) {
    console.log(`${eventType} - ${filename}`)
    runCommands()
  }
})
