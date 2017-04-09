import log4js  from 'log4js'
import stdout from 'browser-stdout'

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
  url: 'http://localhost:8883/log'
}

log4js.configure({
  appenders: [
    CONSOLE_APPENDER,
    PORTAL_APPENDER
  ],
  /* The browser console allows us to log expandable objects which are useful
    in development while log4js only logs text. */
  replaceConsole: false
})

export default log4js
