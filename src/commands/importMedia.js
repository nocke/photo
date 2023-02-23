'use strict'

import fs from 'fs'
import path from 'path'
import { ensureEqual, ensureFileOrFolderOrLinkExists, ensureFolderExists, ensureTrue, important, info, isFile, pass, purple, red, sleepWithKeypress, warn } from '@nocke/util'
import { ensureAcceptablePath } from '../common/utils.js'
import { getCoreAndExt } from '../model/modelUtils.js'
import Family from '../model/Family.js'
import Member from '../model/Member.js'
import fileUtils from './fileUtils.js'


export default async(opts, eventName) => {
  // DEBUG
  important('importMedia')
  info('options: ', opts)
  info('eventName: ', eventName)

}
