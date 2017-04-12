var util = require('util')

function portalAppender(config) {
  const logServerUrl = config.url
  const authorizationHeaderValue = config.authorizationHeaderValue

  return function log(event) {
    const logEvent = {
      time: event.startTime.getTime(),
      level: event.level.levelStr,
      category: event.categoryName,
      message: format(event.data)
    }

    const requestHeaders = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': authorizationHeaderValue
    }

    fetch(logServerUrl, {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(logEvent)
    }).catch((error) => {
      console.error('Portal log append failed to send log event to remote server.')
      console.error(error)
    })
  }
}

function configure(config) {
  return portalAppender(config)
}

function format(logData) {
  const data = Array.isArray(logData) ?
               logData : Array.prototype.slice.call(arguments)
  return util.format.apply(util, wrapErrorsWithInspect(data))
}

function wrapErrorsWithInspect(items) {
  return items.map((item) => {
    if ((item instanceof Error) && item.stack) {
      return {
        inspect: () => {
          return `${util.format(item)}\n${item.stack}`;
        }
      }
    }

    return item;
  })
}

exports.appender = portalAppender
exports.configure = configure
