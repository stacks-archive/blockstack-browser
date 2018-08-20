const cypress = require('cypress')
const handler = require('serve-handler')
const http = require('http')

const server = http.createServer((request, response) => {
  return handler(request, response, { "public": "build" })
})

server.listen(5001, () => {
  console.log('Server running...')
  return cypress.run()
  .then((results) => {
    server.close()
  })  
})
