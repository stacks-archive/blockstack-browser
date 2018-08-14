const isDev = process.env.NODE_ENV === 'development'
// const isTesting = process.env.NODE_ENV === 'test'

console.log(`############################################################# isDev = ${isDev}`)

const logger = {
  configure: () => null,
  info: () => null,
  getLogger: log => ({
    info: message => (isDev ? console.info(log, message) : null),
    trace: message => (isDev ? console.trace(log, message) : null),
    error: message => (isDev ? console.error(log, message) : null),
    debug: message => (isDev ? console.debug(log, message) : null),
    log: message => (isDev ? console.log(log, message) : null)
    // info: message => !isTesting && console.info(log, message),
    // trace: message => !isTesting && console.trace(log, message),
    // error: message => !isTesting && console.error(log, message),
    // debug: message => !isTesting && console.debug(log, message),
    // log: message => !isTesting && console.log(log, message)

  })
}

export default logger
