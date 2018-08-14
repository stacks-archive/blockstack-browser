const isDev = process.env.NODE_ENV === 'development'
const isDebug = typeof location !== 'undefined' && location.search.includes('debug')

const logger = {
  configure: () => null,
  info: () => null,
  getLogger: log => ({
    info: message => (isDev || isDebug ? console.info(log, message) : null),
    trace: message => (isDev || isDebug ? console.trace(log, message) : null),
    error: message => (isDev || isDebug ? console.error(log, message) : null),
    debug: message => (isDev || isDebug ? console.debug(log, message) : null),
    log: message => (isDev || isDebug ? console.log(log, message) : null)
  })
}

export default logger
