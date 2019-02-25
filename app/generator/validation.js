const msg = require('./messages')

module.exports = {
  onlyBlank: (response) => {
    if (!response) return msg.error(`Field can't be blank`)
    if (/\s/g.test(response)) return msg.error(`Field can't have blank spaces`) + `\n--> ${response}`
    return true
  },
  numbers: (response) => {
    if (!response) return msg.error(`Field can't be blank`)
    if (/\s/g.test(response)) return msg.error(`Field can't have blank spaces`) + `\n--> ${response}`
    if (!isFinite(response)) return msg.error('Only numbers are acceptable') + `\n-->${response}`
    return true
  }
}
