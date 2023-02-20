#!/usr/bin/env node
'use strict'
import '../src/config.js'
import { info, mainWrap, sleep, sleepWithKeypress, warn } from '@nocke/util'

info('Start')
const c = await sleepWithKeypress(1000)

warn('Done', c, c === '')
if (c === '') await sleep(1000)
