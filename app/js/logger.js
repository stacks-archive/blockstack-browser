const logger = {
  configure: () => null,
  info: () => null,
  getLogger: log => ({
    info: message => console.info(log, message),
    trace: message => console.trace(log, message),
    error: message => console.error(log, message),
    debug: message => console.debug(log, message),
    log: message => console.log(log, message)
  })
}

export default logger
