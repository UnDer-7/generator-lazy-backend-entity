const chalk = require('chalk')
/**
 * All messages colors used on the project
 * - __warning__: chalk.keyword('orange').bold
 * - __error__: chalk.red
 * - __dash__: chalk.cyanBright.bold
 * - __titleDash__: chalk.green
 * - __greenText__: chalk.greenBright
 * - __urlGitHub__: chalk.bold.magenta.underline
 * - __endingMessage__: chalk.bold.magenta
 * - __cyan__: chalk.cyanBright.bold
 * - __fieldAdded__: chalk.redBright
 */
module.exports = {
  /**
   * chalk.keyword('orange').bold
   */
  warning: chalk.keyword('orange').bold.underline,
  /**
   * chalk.red
   */
  error: chalk.red,
  /**
   * chalk.cyanBright.bold
   */
  dash: chalk.cyanBright.bold,
  /**
   * chalk.green
   */
  titleDash: chalk.green,
  /**
   * chalk.greenBright
   */
  greenText: chalk.greenBright,
  /**
   * chalk.bold.magenta.underline
   */
  urlGitHub: chalk.bold.magenta.underline,
  /**
   * chalk.bold.magenta
   */
  endingMessage: chalk.bold.magenta,
  /**
   * chalk.cyanBright.bold
   */
  cyan: chalk.cyanBright.bold,
  /**
   * chalk.redBright
   */
  fieldAdded: chalk.redBright
}
