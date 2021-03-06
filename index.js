'use strict'

const transformFileSync = require('babel-core').transformFileSync
const transform = require('buble').transform

const contains = (a, b) => a.indexOf(b) > 0

const EXTENSIONS = ['.js', '.es', '.es6']

const bubleOpts = {
  transforms: {
    dangerousForOf: true,
    generator: false
  }
}

const shouldSkip = file => contains(file, 'node_modules')

const original = require.extensions['.js']

const compile = function (module, filename) {
  try {
    module._compile(transform(transformFileSync(filename, {
      plugins: ['transform-es2015-modules-commonjs']
    }).code, bubleOpts).code, filename)
  } catch (err) {
    console.trace(err)
  }
}

const compileEachExtension = ext => require.extensions[ext] = (module, filename) => shouldSkip(filename) ? original(module, filename) : compile(module, filename) // eslint-disable-line no-return-assign

EXTENSIONS.forEach(compileEachExtension)

module.exports = opts => Object.assign(bubleOpts.transforms, opts)
