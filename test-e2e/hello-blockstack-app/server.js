const path = require('path');
const express = require('express');
const blockstackDistPath = require.resolve('blockstack/dist/blockstack');


async function startServer(port = 5000) {

  const app = express();

  function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next()
  }

  function getManifest(req, res) {
    // manifest.json must be constructed using the http request host
    // due to technical limitations with BrowserStack's infrastructure 
    // which require re-routing `localhost` with another hostname. 
    const host = req.hostname;
    const manifest = {
      "name": "Hello, Blockstack",
      "start_url": `${host}:${port}`,
      "description": "A simple demo of Blockstack Auth",
      "icons": [{
        "src": `http://${host}:${port}/icon-192x192.png`,
        "sizes": "192x192",
        "type": "image/png"
      }]
    };
    res.json(manifest)
  }



  app.use(allowCrossDomain);
  app.use('/', express.static(__dirname), express.static(path.dirname(blockstackDistPath)));
  app.use('/manifest.json', getManifest);
  
  const server = await new Promise((resolve, reject) => { 
    const server = app.listen(port, error => {
      if (error) {
        console.error(`Error starting hello-blockstack server: ${error}`);
        reject(error);
      } else {
        console.log(`hello-blockstack server started on http://localhost:${port}`);
        resolve(server);
      }
    });
  });

  return {
    app: app,
    server: server,
    url: `http://localhost:${port}`
  }
}

module.exports = startServer
