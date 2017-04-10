import stdout from 'browser-stdout'

export function configureLogging(log4js, authorizationHeaderValue, environment) {
  // monkey patch stdout to work around log4js bug
  process.stdout = stdout

  const CONSOLE_APPENDER = {
    type: 'console',
    layout: {
      type: 'pattern',
      pattern: '%d{ISO8601_WITH_TZ_OFFSET} %p %c: %m'
    }
  }

  const PORTAL_APPENDER = {
    type: 'portal-appender',
    url: 'http://localhost:8883/log',
    authorizationHeaderValue
  }

  const appenders =  {
    production: [
      CONSOLE_APPENDER,
      PORTAL_APPENDER
    ],
    development: [
      CONSOLE_APPENDER,
      PORTAL_APPENDER
    ]
  }

  log4js.configure({
    appenders: environment === 'production' ? appenders.production : appenders.development,
    /* The browser console allows us to log expandable objects which are useful
      in development while log4js only logs text. */
    replaceConsole: false
  })

  log4js.getLogger('utils/logging-utils.js').info('Logging enabled')
}
