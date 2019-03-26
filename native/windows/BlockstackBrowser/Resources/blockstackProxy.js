/*
 Express server for serving the browser webapp.

 Usage:
 node blockstackProxy.js <port> <basePath>
*/

const express = require('express')
const app = express()

var path = require("path"),
    port = process.argv[2] || 8888,
    host = process.argv[3] || 'localhost';

const basePath = __dirname + '/build';

app.use(express.static(basePath));

app.get('/*', function(req, res, next) {
  res.sendFile(path.join(basePath+'/index.html'));
})

app.listen(port, host);
