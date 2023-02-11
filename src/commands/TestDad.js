'use strict'

import { info, purple } from '@nocke/util'
import { sonBar } from './testSon.js'

export default class TestDad {

  constructor() {
    info(purple('constructing TestDad, calling...'))
    sonBar()
  }
}
