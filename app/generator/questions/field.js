const validation = require('../validation')
const msg = require('../messages')

const fieldNotValid = (fieldType) => {
  return msg.warningTwo(`${fieldType} cannot be applied for this kind of validation`)
}

const field = [
  {
    type: 'input',
    name: 'fieldName',
    message: `What's the field's name?`,
    validate: validation.isNameValid
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
  {
    when: function (response) {
      return response.addValid
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
            return fieldNotValid(response.fieldType)
          }
          return false
        },
        name: 'Unique',
        value: 'unique'
      },
      {
        disabled: function (response) {
          if (response.fieldType !== 'String') {
            return fieldNotValid(response.fieldType)
          }
          return false
        },
        name: 'E-mail',
        value: 'email'
      },
      {
        disabled: function (response) {
          if (response.fieldType !== 'String') {
            return fieldNotValid(response.fieldType)
          }
          return false
        },
        name: 'Only letters or numbers',
        value: 'lettersNumbers'
      },
      {
        disabled: function (response) {
          if (response.fieldType === 'Date' || response.fieldType === 'Boolean') {
            return fieldNotValid(response.fieldType)
          }
          return false
        },
        name: 'Minimum size',
        value: 'min'
      },
      {
        disabled: function (response) {
          if (response.fieldType === 'Date' || response.fieldType === 'Boolean') {
            return fieldNotValid(response.fieldType)
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
    name: 'stringConstrains',
    message: `Accept only letters or numbers`,
    choices: [
      {
        name: 'Only numbers',
        value: 'number'
      },
      {
        name: 'Only letters',
        value: 'letter'
      },
      {
        name: 'Only alphanumeric (a-z, A-Z, and 0-9)',
        value: 'alphanumeric'
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
    default: 5,
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
    default: 55,
    message: `What's the field's Maximum size?`,
    validate: validation.numbers
  }
]
module.exports = field
