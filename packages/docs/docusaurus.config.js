/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict'

require('ts-node').register({
  scope: true,
  scopeDir: __dirname,
  swc: true,
  transpileOnly: true,
})

module.exports = require('./config').config
