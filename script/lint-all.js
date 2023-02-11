#!/usr/bin/env node

'use strict'
import path from 'path'
import fs from 'fs'

import { ESLint } from 'eslint'
// REF https://eslint.org/docs/latest/integrate/nodejs-api

const foldersToIterate = ['src', 'test']
const fileRegex = /\.(?:js|ts|json)$/

const eslint = new ESLint({ fix: true })
// REF https://eslint.org/docs/latest/integrate/nodejs-api#-eslintlintfilespatterns

const treat = async (filePath) => {
  console.log(`treating file ${filePath}`)

  const results = await eslint.lintFiles(filePath)
  await ESLint.outputFixes(results)
}

try {
  for (const folder of foldersToIterate) {
    console.log(`\nIterating folder ${folder} =================`)

    const files = fs.readdirSync(folder)
    files.forEach((file) => {
      if (fileRegex.test(file)) {
        const filePath = path.join(folder, file)
        treat(filePath)
      }
    })
  }
} catch (err) {
  console.error(err)
}
