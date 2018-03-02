const util = require('util')

function wrapErrorsWithInspect(items) {
  return items.map(item => {
    if (item instanceof Error && item.stack) {
      return {
        inspect: () => `${util.format(item)}\n${item.stack}`
      }
    }

    return item
  })
}

function format(logData) {
  /* eslint prefer-rest-params: 0 */
  const data = Array.isArray(logData) ? logData : Array.prototype.slice.call(arguments)
  return util.format.apply(util, wrapErrorsWithInspect(data))
}

function portalAppender(config) {
  const logServerUrl = config.url
  const authorizationHeaderValue = config.authorizationHeaderValue

  return function log(event) {
    const logEvent = {
      time: event.startTime.getTime(),
      level: event.level.levelStr,
      category: event.categoryName,
      message: format(event.data),
      subsystem: 'portal'
    }

    const requestHeaders = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: authorizationHeaderValue
    }

    fetch(logServerUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(logEvent)
    }).catch(error => {
      console.error('Portal log append failed to send log event to remote server.')
      console.error(error)
    })
  }
}

function configure(config) {
  return portalAppender(config)
}

exports.appender = portalAppender
exports.configure = configure
