'use strict'
const Generator = require('yeoman-generator')
const path = require('path')

const entity = require('./generator/questions/entity')
const field = require('./generator/questions/field')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)
    this.log('\nInitializing the lazy-generator\n')
    this.fields = []
    this.entity = ''
  }

  async prompting () {
    this.entity = await this.prompt(entity)
    do {
      this.addField = await this.prompt(
        {
          type: 'confirm',
          name: 'addField',
          message: `Do you want to add a field?`
        })
      if (this.addField.addField) {
        this.fields.push(await this.prompt(field))
      }
    } while (this.addField.addField)
  }

  start () {
    this._private_model()
    this._private_validator()
    this._private_controller()
  }

  _private_model () {
    this.destinationRoot(path.resolve('src', 'app', 'models'))
    this.fs.copyTpl(
      this.templatePath('./model/TemplateModel.js'),
      this.destinationPath(`${this.entity.entityName}Model.js`),
      {
        entity: this.entity,
        field: this.fields
      }
    )
  }

  _private_validator () {
    this.destinationRoot(path.resolve('..', 'validators'))
    this.fs.copyTpl(
      this.templatePath('./validator/TemplateValidator.js'),
      this.destinationPath(`${this.entity.entityName}Validator.js`),
      {
        field: this.fields
      }
    )
  }

  _private_controller () {
    this.destinationRoot(path.resolve('..', 'controllers'))
    this.fs.copyTpl(
      this.templatePath('./controller/TemplateController.js'),
      this.destinationPath(`${this.entity.entityName}Controller.js`),
      {
        entity: this.entity,
        field: this.fields
      }
    )
  }
}
