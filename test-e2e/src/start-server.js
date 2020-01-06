/* eslint no-console: ["error", { allow: ["warn", "error","log"] }] */
const path = require('path')
const url = require('url')
const { createServer: createHttpServer, Server: HttpServer } = require('http')
const serveHandler = require('serve-handler')
const browserHostUrl = 'http://localhost:5757'
const serveDirectory = path.resolve('./../build')


let staticWebServer = createHttpServer((req, res) => {
  return serveHandler(req, res, {
    public: serveDirectory,
    rewrites: [{ source: '**', destination: '/index.html' }]
  })
})
staticWebServer.listen(url.parse(browserHostUrl).port, error => {
  if (error) {
    console.error(`Error starting web server: ${error}`)
  } else {
    console.log(`Web server started at http://localhost:${staticWebServer.address().port}`)
    return null;
  }
})
