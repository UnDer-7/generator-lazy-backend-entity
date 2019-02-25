const validation = require('../validation')

const entity = [
  {
    type: 'input',
    name: 'entityName',
    message: `What's the entity's name?`,
    validate: validation.onlyBlank
  }
]
module.exports = entity
