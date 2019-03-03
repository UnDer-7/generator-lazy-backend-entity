const msg = require('./messages')
const { endsWith } = require('lodash')

const isBlank = entityName => {
  if (!entityName) return msg.error(`Field can't be blank`)
  if (/\s/g.test(entityName)) return msg.error(`Field can't have blank spaces`) + `\n--> ${entityName}`
}

const isNumber = number => /^[0-9]+$/i.test(number)

const isNameValid = name => {
  if (!/^[a-z0-9-_]+$/i.test(name)) return `Invalid character\n-->${name}`
  if (isNumber(name)) return `Can't start with number\n-->${name}`
  if (endsWith(name, '_')) return `Can't end the name with _\n-->${name}`
  if (endsWith(name, '-')) return `Can't end the name with -\n-->${name}`
}

/**
 * Object with the some fields validations
 * ## isEntityNameValid
 * --- Check if a given field:
 * ------ Has a invalid characters
 * ------ Starts with a number
 * ------ Starts with a capital letter
 * ------ Has invalid characters
 * --- returns false if any of the validations fail
 * ## isNameValid
 *  * --- Check if a given field:
 * ------ Has a invalid characters
 * ------ Starts with a number
 * ------ Starts with a lower-case letter
 * ------ Has invalid characters
 * --- returns false if any of the validations fail
 * ## numbers
 * --- Check if a given field:
 * ------ Starts with a number
 * --- returns false if any of the validations fail
 */
module.exports = {
  /**
   * --- Check if a given field:
   * ------ Has a invalid characters
   * ------ Starts with a number
   * ------ Starts with a capital letter
   * ------ Has invalid characters
   * @param {string} response - Response given by the input
   * @return {boolean, string} Returns true if all validations pass
   */
  isEntityNameValid: (response) => {
    isBlank(response)
    isNameValid(response)
    if (!/^[A-Z]/.test(response)) return `The first character needs to be a capital letter\n-->${response}`
    return true
  },
  /**
   * --- Check if a given field:
   * ------ Has a invalid characters
   * ------ Starts with a number
   * ------ Starts with a lower-case letter
   * ------ Has invalid characters
   * @param {string} response - Response given by the input
   * @return {boolean, string} Returns true if all validations pass
   */
  isNameValid: (response) => {
    isBlank(response)
    isNameValid(response)
    if (!/^[a-z]/.test(response)) return `The first character needs to be a lower-case letter\n-->${response}`
    return true
  },
  /**
   * --- Check if a given field:
   * ------ Starts with a number
   * --- returns false if any of the validations fail
   * @param {string} response - Response given by the input
   * @return {boolean, string} Returns true if all validations pass
   */
  numbers: (response) => {
    isBlank(response)
    if (!isNumber(response)) return msg.error('Only numbers are acceptable') + `\n-->${response}`
    return true
  }
}
