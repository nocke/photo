'use strict'
import { ensureTrue } from '@nocke/util'

export const ensureAcceptablePath = (absPath) => {
  ensureTrue(global.config.acceptablePaths.some(path => absPath.startsWith(path)),
      `'${absPath}' is not an acceptable path`
  )
}

export default {
  ensureAcceptablePath
}
