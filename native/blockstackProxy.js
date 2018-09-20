/*
 Express server for serving the browser webapp.

 Usage:
 node blockstackProxy.js <port> <basePath>
*/

const express = require('express')
const app = express()

var path = require("path"),
    port = process.argv[2] || 8888,
    host = process.argv[4] || 'localhost',
    basePath = process.argv[3] || "./browser";

app.use('/static', express.static(basePath+'/static'));

app.get('/*', function(req, res, next) {
  res.sendFile(path.join(basePath+'/index.html'));
})

app.listen(port)
