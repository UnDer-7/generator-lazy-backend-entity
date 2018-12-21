'use strict'
const Generator = require('yeoman-generator')
const path = require('path')

const entity = require('./generator/questions/entity')
const field = require('./generator/questions/field')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.log('\nInitializing the lazy-generator\n');
  }

  async prompting() {
    do {
      this.addEntity = await this.prompt(
        {
          type: 'confirm',
          name: 'addEntity',
          message: `Do you want to add a new entity?`
        }
      )
      if (this.addEntity.addEntity) {
        this.entity = await this.prompt(entity)
        this.fields = await this.prompt(field)
      }
    } while (this.addEntity.addEntity)
  }

  start() {
    this._private_model()
  }

  _private_model() {
    this.destinationRoot(path.resolve('src', 'app', 'models'))
    this.fs.copyTpl(
      this.templatePath('./model/TemplateModel.js'),
      this.destinationPath(`${this.entity.entityName}Model.js`),
      {}
    )
  }
}
