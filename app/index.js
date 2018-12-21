'use strict'
const Generator = require('yeoman-generator')
const path = require('path')

module.exports = class extends Generator {
  constructor (args, opts) {
    super (args, opts)
    this.log('\nInitializing the lazy-generator\n');
  }

  start () {
    this.log('WORKING')
  }
}
