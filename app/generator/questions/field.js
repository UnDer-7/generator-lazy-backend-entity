const field = [
  {
    type: 'input',
    name: 'fieldName',
    message: `What's the field's name?`
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
    type: 'confirm',
    name: 'required',
    message: `Is the field required?`,
    default: 'Yes'
  },
  {
    when: function (response) {
      return response.addValid
    },
    type: 'confirm',
    name: 'minMax',
    message: `Do you want to define a Minimum or Maximum length?`
  },
  {
    when: function (response) {
      return response.minMax && response.addValid
    },
    type: 'input',
    name: 'minimum',
    message: `What's the Minimum field size?`,
    default: 1
  },
  {
    when: function (response) {
      return response.minMax && response.addValid
    },
    type: 'input',
    name: 'maximum',
    message: `What's the Maximum field size?`,
    default: 25
  }
]
module.exports = field
