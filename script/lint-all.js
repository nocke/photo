#!/usr/bin/env node
'use strict'
import path from 'path'
import fs from 'fs'

const foldersToIterate = ['src', 'test']
const fileRegex = /\.(?:js|ts|json)$/

// TODO actual sanitizing not yet happening

const treat = (file) => {
  console.log(`treating file ${file}`)
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
