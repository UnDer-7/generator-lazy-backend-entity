'use strict'

const Generator = require('yeoman-generator')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')

const entity = require('./generator/questions/entity')
const field = require('./generator/questions/field')
const msg = require('./generator/messages')
const utils = require('./generator/utils')

module.exports = class extends Generator {
  constructor (args, opts) {
    super(args, opts)

    this.fields = []
    this.routesFile = null
    this.generatorPath = null
    this.isMongoose = null
  }

  async start () {
    this.userRootPath = this.destinationRoot('./')
    this.generatorPath = path.resolve(__dirname)

    await this._private_is_valid_project()
    this.routesFile = await this._private_read_route()
    this._private_check_database_style()

    this._private_initial_text()
    await this._private_askFieldQuestions()

    this._private_model()
    this._private_validator()
    this._private_controller()
    if (!this.isMongoose) this._private_migration()
    this._private_create_tmp_route()
  }

  async end () {
    this._private_write_route()

    if (this.createTable && this.createTable.createTable) {
      try {
        const { stdout } = await this._private_verify_sequelize_cli()
        console.log('stdout ', msg.greenText(stdout) + msg.dash('------------------------------\n'))
      } catch (e) {
        console.log(msg.error(e))
        throw msg.error(e)
      }

      try {
        const { stdout } = await this._private_create_table()
        console.log('stdout ', msg.greenText(stdout) + msg.dash('------------------------------\n'))
      } catch (e) {
        console.log(msg.error(e))
        throw msg.error(e)
      }
    }
    console.log(msg.endingMessage(`\nIf you like lazy-backend project give it a star at GitHub`))
    console.log(msg.urlGitHub(`https://github.com/UnDer-7/generator-lazy-backend`))
    console.log(msg.cyan('\nAuthor: Mateus Gomes da Silva Cardoso'))
  }

  _private_initial_text () {
    const lazyBackend = msg.titleDash('---------') + msg.error('LAZY-BACKEND') + msg.titleDash('---------')
    const entity = msg.titleDash('------------') + msg.error('ENTITY') + msg.titleDash('------------')

    this.log(msg.titleDash('\n------------------------------'))
    this.log(lazyBackend)
    this.log(entity)
    this.log(msg.titleDash('------------------------------\n'))
  }

  async _private_askFieldQuestions () {
    this.entity = await this.prompt(entity)
    do {
      this.moreFields = await this.prompt(
        {
          type: 'confirm',
          name: 'addField',
          message: `Do you want to add a field?`
        })
      if (this.moreFields.addField) {
        this.fields.push(await this.prompt(field, function (response) {
        }))
      }
      this.log('\n')
      this.log(msg.titleDash(`Entity: ` + msg.cyan(this.entity.entityName)))
      this.log(msg.titleDash(`Fields Added:`))
      let fieldAdded = []
      this.fields.forEach((element, index) => {
        let field = `Name: ${msg.cyan(element.fieldName)}, Type: ${msg.cyan(element.fieldType)}`
        if (element.addValid && element.validations.length > 0) {
          field += `, Validations:`
          element.validations.forEach(item => {
            if (item !== 'lettersNumbers' && item !== 'min' && item !== 'max') {
              field += ` ${msg.cyan(item)},`
            }
            if (item === 'lettersNumbers') {
              field += msg.cyan(` only ${element.stringConstrains}`) + ','
            }
            if (item === 'min') {
              field += ` Minimum size - ${msg.cyan(element.minSize)},`
            }
            if (item === 'max') {
              field += ` Maximum size - ${msg.cyan(element.maxSize)},`
            }
          })
        }
        field = _.trimEnd(field, ',')
        fieldAdded.push(field)
        this.log(`${fieldAdded[index]}`)
        this.log(msg.cyan('============================='))
      })
      this.log('\n')
    } while (this.moreFields.addField)

    if (!this.isMongoose) {
      this.createTable = await this.prompt({
        type: 'confirm',
        name: 'createTable',
        message: `Do you want to create ${this.entity.entityName}'s table?`
      })
    }
  }

  _private_is_valid_project () {
    const folders = [
      fs.existsSync(path.resolve(this.userRootPath, 'package.json')),
      fs.existsSync(path.resolve(this.userRootPath, 'src', 'index.js')),
      fs.existsSync(path.resolve(this.userRootPath, 'src', 'routes.js')),
      fs.existsSync(path.resolve(this.userRootPath, 'src', 'server.js')),
      fs.existsSync(path.resolve(this.userRootPath, 'src', 'app', 'controllers')),
      fs.existsSync(path.resolve(this.userRootPath, 'src', 'app', 'models')),
      fs.existsSync(path.resolve(this.userRootPath, 'src', 'app', 'validators'))
    ]

    const errorMsg = utils.buildErrorMessage(folders)

    if (folders.includes(false)) {
      this.log('\n\n ' + msg.warning('Looks like you are running the entity generator in the wrong place!'))
      this.log(' ' + msg.warning('Try running the generator in the root folder of your project'))
      this.log()
      throw Error(
        msg.error(`\ntrying to create an Entity at: `) + this.userRootPath + '\n' +
        msg.error(errorMsg)
      )
    }
  }

  _private_check_database_style () {
    const regexFind = /\mongoose\b/gi
    const db = fs.readFileSync(`${this.userRootPath}/package.json`, 'utf8')
    this.isMongoose = regexFind.test(db)
  }

  _private_model () {
    this.destinationRoot(path.resolve('src', 'app', 'models'))

    this.fs.copyTpl(
      this.templatePath(`./model/${utils.getFolder(this.isMongoose)}/Template.ejs`),
      this.destinationPath(`${this.entity.entityName}.js`),
      {
        entity: this.entity,
        fields: this.fields,
        tableName: _.snakeCase(this.entity.entityName).toUpperCase()
      }
    )
  }

  _private_validator () {
    this.destinationRoot(path.resolve('..', 'validators'))
    this.fs.copyTpl(
      this.templatePath('./validator/TemplateValidator.ejs'),
      this.destinationPath(`${this.entity.entityName}Validator.js`),
      {
        fields: this.fields
      }
    )
  }

  _private_controller () {
    this.destinationRoot(path.resolve('..', 'controllers'))

    this.fs.copyTpl(
      this.templatePath(`./controller/${utils.getFolder(this.isMongoose)}/TemplateController.ejs`),
      this.destinationPath(`${this.entity.entityName}Controller.js`),
      {
        entity: this.entity,
        field: this.fields
      }
    )
  }

  _private_migration () {
    this.destinationRoot(path.resolve('..', '..', 'database', 'migrations'))
    this.fs.copyTpl(
      this.templatePath('./migrations/224201901831-create-user.ejs'),
      this.destinationPath(`${utils.generateDateTime()}-create-${this.entity.entityName.toLowerCase()}.js`),
      {
        entity: this.entity,
        fields: this.fields,
        tableName: _.snakeCase(this.entity.entityName).toUpperCase()
      }
    )
  }

  _private_create_tmp_route () {
    this.destinationRoot(path.resolve(this.generatorPath))
    this.fs.copyTpl(
      this.templatePath('./routes/templateRoute.ejs'),
      this.destinationPath('tmpRoute.js'),
      {
        entity: this.entity
      }
    )
  }

  async _private_write_route () {
    const tmpRoute = require('./tmpRoute')
    const hook = '// Do not remove this cometary'

    const updatedRoutes = this.routesFile.replace(hook, `${tmpRoute}\n${hook}`)
    try {
      fs.writeFileSync(path.resolve(this.userRootPath, 'src', 'routes.js'), updatedRoutes)
    } catch (e) {
      throw Error(`${msg.error('Unable to write on Routes.js')} \n${e}}`)
    }

    try {
      fs.unlinkSync(path.resolve(this.generatorPath, 'tmpRoute.js'))
    } catch (e) {
      throw Error(`${msg.error('Unable to delete the tmpRoute.js')} \n${e}}`)
    }
  }

  _private_read_route () {
    try {
      const data = fs.readFileSync(`${this.userRootPath}/src/routes.js`, 'utf8')

      if (!data.includes('// Do not remove this cometary')) {
        throw Error(msg.error(`Couldn't find the hook: '// Do not remove this cometary' in the routes.js`))
      }

      return data
    } catch (e) {
      this.log(msg.error('Unable to read the Routes.js'))
      throw Error(msg.error(e))
    }
  }

  /**
   * Check if the user has sequelize_cli installed
   * @return {Promise} - Returns the child_process.exec()
   * @private
   */
  _private_verify_sequelize_cli () {
    this.log(msg.dash('\n------------------------------'))
    this.log('CHECKING IF SEQUELIZE-CLI IS INSTALLED')
    this.log(msg.dash('------------------------------'))
    return utils.executeShellCommand(' npx sequelize --version', this.userRootPath)
  }

  _private_create_table () {
    this.log(msg.dash('\n------------------------------'))
    this.log(`CREATING ${this.entity.entityName}'S TABLE!`)
    this.log(msg.dash('------------------------------'))

    return utils.executeShellCommand('npx sequelize db:migrate', this.userRootPath)
  }
}
