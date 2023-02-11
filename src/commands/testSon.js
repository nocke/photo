'use strict'

import { info } from '@nocke/util'

export const sonFoo = () => {
  info(`Original Son 'foo' and here, my brother... `)
  sonBar()
}

export const sonBar = () => {
  info(`Original Son bar`)
}

export const third = () => {
  info(`third() called`)
}

export default {
  sonFoo,
  sonBar,
  third
}
