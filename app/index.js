'use strict'
const Generator = require('yeoman-generator')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

const entity = require('./generator/questions/entity')
const field = require('./generator/questions/field')

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts)
    this.log(chalk.red.bgBlack('\n------------------------------'))
    this.log(chalk.red.bgBlack('---------LAZY-BACKEND---------'))
    this.log(chalk.red.bgBlack('------------entity------------'))
    this.log(('\nInitializing the entity generator\n'))
    this.fields = []
    this.entity = ''
  }

  async prompting() {
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

  async start() {
    this._private_read_route()
    this._private_model()
    this._private_validator()
    this._private_controller()
    this._private_creatTmpRoute()
  }

  _private_model() {
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

  _private_validator() {
    this.destinationRoot(path.resolve('..', 'validators'))
    this.fs.copyTpl(
      this.templatePath('./validator/TemplateValidator.js'),
      this.destinationPath(`${this.entity.entityName}Validator.js`),
      {
        field: this.fields
      }
    )
  }

  _private_controller() {
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

  _private_read_route() {
    const hook = '// Do not remove this cometary'
    const read = './src/routes.js'
    // this.log('\nREAD - DIRNAME: ', __dirname, '\n')
    // const write = `${__dirname}/generator/routes/tmpRoute.js`

    fs.readFile(read, 'utf8', (err, data) => {
      if (err) return this.log({error: 'Unable to read the Routes.js', err})


      this.destinationRoot(path.resolve(__dirname, 'generator', 'routes'))
      this.fs.copyTpl(
        this.templatePath('./routes/templateRoute.js'),
        this.destinationPath('tmpRoute.js'),
        {
          entity: this.entity
        },
      )

      this._private_creatTmpRoute(data)
      // data = data.replace(hook, `${require('./generator/routes/tmpRoute')}\n${hook}`)
      // this.log('\nthis.data DENTRO DO READFILE', this.data)
      // fs.writeFile(read, data, err => {
      //   if (err) return this.log({error: 'Unable to write on Routes.js', err})
      // })
    })
  }

  _private_creatTmpRoute(data) {
    this.log('DATA do CREAT TMP ROUTE: ', data)
    // const write = `${__dirname}/generator/routes/tmpRoute.js`
    // const read = './src/routes.js'
    // this.log('CREATE TEMPLAETE - ROUTE: ', __dirname)
    // this.log('CREATE TMP - DIRNAME: ', __dirname)
    // this.destinationRoot(path.resolve(__dirname, 'generator', 'routes'))
    // this.fs.copyTpl(
    //   this.templatePath('./routes/templateRoute.js'),
    //   this.destinationPath('tmpRoute.js'),
    //   {
    //     entity: this.entity
    //   },
    // )
    // this.log('\n\nTHIS.DATA: ', this.data)
    // fs.writeFile(read, this.data, err => {
    //   if (err) return this.log({ error: 'Unable to write on Routes.js', err })
    // })
  }
}
