const isTesting = process.env.NODE_ENV === 'test'

const logger = {
  configure: () => null,
  info: () => null,
  getLogger: log => ({
    info: message => !isTesting && console.info(log, message),
    trace: message => !isTesting && console.trace(log, message),
    error: message => !isTesting && console.error(log, message),
    debug: message => !isTesting && console.debug(log, message),
    log: message => !isTesting && console.log(log, message)
  })
}

export default logger
