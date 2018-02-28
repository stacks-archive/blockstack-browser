import stdout from 'browser-stdout'

export function configureLogging(log4js, logServerPort, authorizationHeaderValue, environment) {
  // monkey patch stdout to work around log4js bug
  process.stdout = stdout

  let remoteLoggingEnabled = false
  const portNumber = parseInt(logServerPort, 10)

  if (portNumber > 1024 && portNumber <= 65535) {
    remoteLoggingEnabled = true
  }

  const CONSOLE_APPENDER = {
    type: 'console',
    layout: {
      type: 'pattern',
      pattern: '%d{ISO8601_WITH_TZ_OFFSET} %p %c: %m'
    }
  }

  const logServerUrl = `http://localhost:${portNumber}/`

  const PORTAL_APPENDER = {
    type: 'portal-appender',
    url: logServerUrl,
    authorizationHeaderValue
  }

  const appenders = {
    production: [
      CONSOLE_APPENDER // TODO: on release remove the console logger from production
    ],
    development: [CONSOLE_APPENDER]
  }

  if (remoteLoggingEnabled) {
    appenders.production.push(PORTAL_APPENDER)
    appenders.development.push(PORTAL_APPENDER)
  }

  log4js.configure({
    appenders: environment === 'production' ? appenders.production : appenders.development,
    /* The browser console allows us to log expandable objects which are useful
      in development while log4js only logs text. */
    replaceConsole: false
  })

  const logger = log4js.getLogger('utils/logging-utils.js')
  logger.info('Logging system enabled')

  if (remoteLoggingEnabled) {
    logger.info(`Log server: ${logServerUrl}`)
  } else {
    logger.info('Log server: disabled')
  }
}
