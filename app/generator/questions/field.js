const fieldNotValid = 'cannot be applied for this kind of validations'
const validation = require('../validation')
const msg = require('../messages')

// const validation = (response) => {
//   if (!response) return `Field name can't be blank`
//   if (/\s/g.test(response)) return `Field name can't have blank spaces\n--> ${response}`
//   return true
// }

const field = [
  {
    type: 'input',
    name: 'fieldName',
    message: `What's the field's name?`,
    validate: validation.onlyBlank
  },
  {
    type: 'list',
    name: 'fieldType',
    message: `What's the field's type?`,
    choices: [
      {
        name: 'String',
        value: 'String'
      },
      {
        name: 'Number',
        value: 'Number'
      },
      {
        name: 'Date',
        value: 'Date'
      },
      {
        name: 'Boolean',
        valeu: 'Boolean'
      }
    ]
  },
  {
    type: 'confirm',
    name: 'addValid',
    message: `Do you want to add validations?`
  },

  // ------ VALIDATIONS ------
  {
    when: function (response) {
      return response.addValid // && (response.fieldType === 'String' || response.fieldType === 'Number')
    },
    type: 'checkbox',
    name: 'validations',
    message: 'Select what you validations do you want',
    choices: [
      {
        name: 'Required',
        value: 'required'
      },
      {
        disabled: function (response) {
          if (response.fieldType === 'Boolean') {
            return msg.warning(`${response.fieldType} ${fieldNotValid}`)
          }
          return false
        },
        name: 'Unique',
        value: 'unique'
      },
      {
        disabled: function (response) {
          if (response.fieldType !== 'String') {
            return msg.warning(`${response.fieldType} ${fieldNotValid}`)
          }
          return false
        },
        name: 'E-mail',
        value: 'email'
      },
      {
        disabled: function (response) {
          if (response.fieldType !== 'String') {
            return msg.warning(`${response.fieldType} ${fieldNotValid}`)
          }
          return false
        },
        name: 'Only letters or numbers',
        value: 'lettersNumbers'
      },
      {
        disabled: function (response) {
          if (response.fieldType === 'Date' || response.fieldType === 'Boolean') {
            return msg.warning(`${response.fieldType} ${fieldNotValid}`)
          }
          return false
        },
        name: 'Minimum size',
        value: 'min'
      },
      {
        disabled: function (response) {
          if (response.fieldType === 'Date' || response.fieldType === 'Boolean') {
            return msg.warning(`${response.fieldType} ${fieldNotValid}`)
          }
          return false
        },
        name: 'Maximum size',
        value: 'max'
      }
    ]
  },
  {
    when: function (response) {
      if (response.validations && response.addValid) {
        return response.validations.includes('lettersNumbers')
      }
      return false
    },
    type: 'list',
    name: 'fieldType',
    message: `Accept only letters or numbers`,
    choices: [
      {
        name: 'Only numbers',
        value: 'number'
      },
      {
        name: 'Only letters',
        value: 'letter'
      }
    ]
  },
  {
    when: function (response) {
      if (response.validations && response.addValid) {
        return response.validations.includes('min')
      }
      return false
    },
    type: 'input',
    name: 'minSize',
    message: `What's the field's Minimum size?`,
    validate: validation.numbers
  },
  {
    when: function (response) {
      if (response.validations && response.addValid) {
        return response.validations.includes('max')
      }
      return false
    },
    type: 'input',
    name: 'maxSize',
    message: `What's the field's Maximum size?`,
    validate: validation.numbers
  }
]
module.exports = field
