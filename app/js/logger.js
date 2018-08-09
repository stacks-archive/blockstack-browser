const isDev = process.env.NODE_ENV === 'development'
const logger = {
  configure: () => null,
  info: () => null,
  getLogger: log => ({
    info: message => (isDev ? console.info(log, message) : null),
    trace: message => (isDev ? console.trace(log, message) : null),
    error: message => (isDev ? console.error(log, message) : null),
    debug: message => (isDev ? console.debug(log, message) : null),
    log: message => (isDev ? console.log(log, message) : null)
  })
}

export default logger
