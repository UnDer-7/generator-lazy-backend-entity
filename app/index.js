'use strict'

const Generator = require('yeoman-generator')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

const entity = require('./generator/questions/entity')
const field = require('./generator/questions/field')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)
    this.log(chalk.red.bgBlack('\n------------------------------'))
    this.log(chalk.red.bgBlack('---------LAZY-BACKEND---------'))
    this.log(chalk.red.bgBlack('------------entity------------'))
    this.log(('\nInitializing the entity generator\n'))

    this.fields = []
    this.entity = ''
    this.generatorPath = ''
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
        this.fields.push(await this.prompt(field, function (response) {
        }))
      }
      this.log('\n')
      this.log(`Fields Added:`)
      this.log(`\n`)
      let fieldAdded = []
      this.fields.forEach((element, index) => {
        let field = `Name: ${chalk.redBright(element.fieldName)}, Type: ${chalk.redBright(element.fieldType)}, Validations: ${chalk.redBright(element.addValid)}`
        if (element.addValid) {
          field = field + `, Required: ${chalk.redBright(element.required)}`
          if (element.minMax) {
            field = field + `, Minimum size: ${chalk.redBright(element.minimum)}, Maximum size: ${chalk.redBright(element.maximum)}`
          }
        }
        fieldAdded.push(field)
        this.log(`${fieldAdded[index]}`)
        this.log(chalk.red.bgBlack('============================='))
      })
      this.log('\n')
    } while (this.addField.addField)
  }

  async start () {
    this.generatorPath = path.resolve(__dirname, 'generator', 'routes')

    this._private_check_database_style()
    this._private_model()
    this._private_validator()
    this._private_controller()
    this._private_read_route()
    this._private_create_tmp_route()
  }

  _private_check_database_style () {
    const regexFind = /\mongoose\b/gi
    const db = fs.readFileSync(`${this.destinationRoot('./')}/package.json`, 'utf8')
    this.isMongoose = regexFind.test(db)
  }

  _private_model () {
    this.destinationRoot(path.resolve('src', 'app', 'models'))
    this.fs.copyTpl(
      this.templatePath('./model/Template.js'),
      this.destinationPath(`${this.entity.entityName}.js`),
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
    let templatePath = ''

    if (this.isMongoose) {
      templatePath = './controller/noSQL/TemplateController.js'
    } else {
      templatePath = './controller/sql/TemplateController.js'
    }

    this.fs.copyTpl(
      this.templatePath(templatePath),
      this.destinationPath(`${this.entity.entityName}Controller.js`),
      {
        entity: this.entity,
        field: this.fields
      }
    )
  }

  _private_read_route () {
    const localPath = path.resolve('..', '..', 'routes.js')

    fs.readFile(localPath, 'utf8', (err, data) => {
      if (err) return this.log({ error: 'Unable to read the Routes.js', err })

      this._private_write_route(data, localPath)
    })
  }

  _private_create_tmp_route () {
    this.destinationRoot(this.generatorPath)
    this.fs.copyTpl(
      this.templatePath('./routes/templateRoute.js'),
      this.destinationPath('tmpRoute.js'),
      {
        entity: this.entity
      }
    )
  }

  _private_write_route (data, localPath) {
    const hook = '// Do not remove this cometary'
    if (data) {
      let route = data.replace(hook, `${require('./generator/routes/tmpRoute')}\n${hook}`)

      fs.writeFile(localPath, route, err => {
        if (err) return this.log({ error: 'Unable to write on Routes.js', err })
      })

      fs.unlink(`${this.generatorPath}/tmpRoute.js`, err => {
        if (err) return this.log({ error: 'Unable to delete the tmpRoute.js', err })
      })
    }
  }
}
