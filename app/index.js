'use strict'

const Generator = require('yeoman-generator')
const _ = require('lodash')
const path = require('path')
const fs = require('fs')
const util = require('util')
const cmd = util.promisify(require('child_process').exec)

const entity = require('./generator/questions/entity')
const field = require('./generator/questions/field')
const msg = require('./generator/messages')

module.exports = class extends Generator {
  // constructor (args, opts) {
  //   super(args, opts)
  // }

  async start () {
    const userRootPath = this.destinationRoot('./')
    const generatorPath = path.resolve(__dirname, 'generator', 'routes')

    this._private_is_valid_project(userRootPath)

    this._private_initial_text()
    await this._private_askFieldQuestions()

    this._private_check_database_style(userRootPath)
    this._private_model()
    this._private_validator()
    this._private_controller()
    if (!this.isMongoose) this._private_migration()
    this._private_read_route(userRootPath)
    this._private_create_tmp_route(generatorPath)
  }

  async end () {
    const questionCreateTable = await this.prompt([
      {
        type: 'confirm',
        name: 'createTable',
        message: `Do you want to create ${this.entity.entityName}'s table?`
      }
    ])

    if (questionCreateTable.createTable) {
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
  }

  _private_is_valid_project (route) {
    const folders = [
      fs.existsSync(path.resolve(route, 'package.json')),
      fs.existsSync(path.resolve(route, 'src', 'index.js')),
      fs.existsSync(path.resolve(route, 'src', 'routes.js')),
      fs.existsSync(path.resolve(route, 'src', 'server.js')),
      fs.existsSync(path.resolve(route, 'src', 'app', 'controllers')),
      fs.existsSync(path.resolve(route, 'src', 'app', 'models')),
      fs.existsSync(path.resolve(route, 'src', 'app', 'validators'))
    ]

    if (folders.includes(false)) {
      this.log('\n\n ' + msg.warning('Looks like you are running the entity generator in the wrong place!'))
      this.log(' ' + msg.warning('Try running the generator in the root folder of your project'))
      throw Error(' ' + msg.error(this._private_build_error_massage(folders)))
    }
  }

  _private_build_error_massage (folders) {
    let erroMsg = `\nUnable to find folders/files:\n`

    erroMsg += folders[0] ? '' : ' package.json'
    erroMsg += folders[1] ? '' : '\n index.js'
    erroMsg += folders[2] ? '' : '\n routes.js'
    erroMsg += folders[3] ? '' : '\n server.js'
    erroMsg += folders[4] ? '' : '\n controllers'
    erroMsg += folders[5] ? '' : '\n models'
    erroMsg += folders[6] ? '' : '\n package.json'
    erroMsg += folders[7] ? '' : '\n validators'
    return erroMsg
  }

  _private_check_database_style (path) {
    const regexFind = /\mongoose\b/gi
    const db = fs.readFileSync(`${path}/package.json`, 'utf8')
    this.isMongoose = regexFind.test(db)
  }

  _private_model () {
    this.destinationRoot(path.resolve('src', 'app', 'models'))

    this.fs.copyTpl(
      this.templatePath(`./model/${this._private_getFolder()}/Template.ejs`),
      this.destinationPath(`${this.entity.entityName}.js`),
      {
        entity: this.entity,
        fields: this.fields
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
      this.templatePath(`./controller/${this._private_getFolder()}/TemplateController.ejs`),
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
      this.destinationPath(`${this._private_generate_date_time()}-create-${this.entity.entityName.toLowerCase()}.js`),
      {
        entity: this.entity,
        fields: this.fields
      }
    )
  }

  _private_read_route (path) {
    fs.readFile(path, 'utf8', (err, data) => {
      if (err) return this.log({ error: 'Unable to read the Routes.js', err })

      this._private_write_route(data, path)
    })
  }

  _private_create_tmp_route (path) {
    this.destinationRoot(path)
    this.fs.copyTpl(
      this.templatePath('./routes/templateRoute.ejs'),
      this.destinationPath('tmpRoute.js'),
      {
        entity: this.entity
      }
    )
  }

  _private_write_route (data, path) {
    const hook = '// Do not remove this cometary'
    if (data) {
      let route = data.replace(hook, `${require('./generator/routes/tmpRoute.js')}\n${hook}`)

      fs.writeFile(path, route, err => {
        if (err) return this.log({ error: 'Unable to write on Routes.js', err })
      })

      fs.unlink(`${this.generatorPath}/tmpRoute.js`, err => {
        if (err) return this.log({ error: 'Unable to delete the tmpRoute.js', err })
      })
    }
  }

  _private_getFolder () {
    if (this.isMongoose) return 'noSQL'
    return 'sql'
  }

  /**
   * Generates a string containing the date and hour.
   * format: month, date, year, hours, minutes and seconds
   * @return {String} - ex: 2132019212724
   * @private
   */
  _private_generate_date_time () {
    let currentdate = new Date()
    return '' + (currentdate.getMonth() + 1) +
      currentdate.getDate() +
      currentdate.getFullYear() +
      currentdate.getHours() +
      currentdate.getMinutes() +
      currentdate.getSeconds()
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
    return this._private_execute_command(' npx sequelize --version')
  }

  _private_create_table () {
    this.log(msg.dash('\n------------------------------'))
    this.log(`CREATING ${this.entity.entityName}'S TABLE!`)
    this.log(msg.dash('------------------------------'))

    return this._private_execute_command('npx sequelize db:migrate')
  }

  /**
   * Run a command on the user's console.
   * It'll execute the command inside the user's project folder
   * @param command {String}
   * @return
   * @private
   */
  _private_execute_command (command) {
    console.log(`Running ${msg.greenText(command)} command`)
    return cmd(command, { cwd: path.resolve(this.localPath, '..', '..') })
  }
}
