const util = require('util')
const cmd = util.promisify(require('child_process').exec)
const msg = require('./messages')

module.exports = {
  buildErrorMessage: folders => {
    let errorMsg = `\nUnable to find:\n`

    errorMsg += folders[0] ? '' : ' - package.json'
    errorMsg += folders[1] ? '' : '\n - index.js'
    errorMsg += folders[2] ? '' : '\n - routes.js'
    errorMsg += folders[3] ? '' : '\n - server.js'
    errorMsg += folders[4] ? '' : `\n - controllers' folder`
    errorMsg += folders[5] ? '' : `\n - models' folder`
    errorMsg += folders[6] ? '' : `\n - validators' folder`
    return errorMsg
  },

  /**
   * Generates a string containing the date and hour.
   * format: month, date, year, hours, minutes and seconds
   * @return {String} - ex: 2132019212724
   * @private
   */
  generateDateTime: () => {
    let currentdate = new Date()
    return '' + (currentdate.getMonth() + 1) +
      currentdate.getDate() +
      currentdate.getFullYear() +
      currentdate.getHours() +
      currentdate.getMinutes() +
      currentdate.getSeconds()
  },
  getFolder: (isMongoose) => {
    if (isMongoose) return 'noSQL'
    return 'sql'
  },

  /**
   * Run a command on the user's Shell.
   * It'll execute the command inside the user's project folder
   * @param command {String}
   * @param path {String}
   * @return
   */
  executeShellCommand: (command, path) => {
    console.log(`executing ${msg.greenText(command)}`)
    return cmd(command, { cwd: path })
  }
}
