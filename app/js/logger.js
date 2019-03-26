const isDev = process.env.NODE_ENV === 'development'
const isTesting = process.env.NODE_ENV === 'test'

// Debug logging can be explicitly enabled independent of NODE_ENV, this is useful
// in cases where we want to use the production webpacking and have debug logs, 
// for example in end-to-end testing. 
const isDebugLoggingEnabled = process.env.DEBUG_LOGGING === 'true'

const localDebug =
  !isTesting &&
  typeof window !== 'undefined' &&
  window.localStorage.getItem('debug')
const isDebug =
  localDebug ||
  (typeof location !== 'undefined' && location.search.includes('debug'))

const showLog = isDev || isDebug || isDebugLoggingEnabled

const prefixStyle = 'color: #AAA;'

const logger = {
  configure: () => null,
  info: () => null,
  getLogger: path => ({
    info: (...message) =>
      showLog && console.info(`%c[${path}]:`, prefixStyle, ...message),
    trace: (...message) =>
      showLog && console.trace(`%c[${path}]:`, prefixStyle, ...message),
    error: (...message) =>
      showLog && console.error(`%c[${path}]:`, prefixStyle, ...message),
    warn: (...message) =>
      showLog && console.warn(`%c[${path}]:`, prefixStyle, ...message),
    debug: (...message) =>
      showLog && console.debug(`%c[${path}]:`, prefixStyle, ...message),
    log: (...message) =>
      showLog && console.log(`%c[${path}]:`, prefixStyle, ...message)
  })
}

export default logger
