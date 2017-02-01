/*
 Quick and dirty server for mocking Blockstack Core REST API on localhost.
 Uses blockstack-cli for data
 Usage:
 node mockBlockstackCoreApi.js <port>
*/

var express = require('express')
var cors = cors = require('cors')

var app = express(),
    port = process.argv[2] || 8889

const blockstack = process.argv[3] || "./blockstack-venv/bin/python2.7 ./blockstack-venv/bin/blockstack";
const exec = require('child_process').exec

app.use(cors())

app.get('/names/:name', function (req, res) {
    blockstackGetNameZonefile(req.params.name).then((zonefile) => {
      res.json(zonefile)
    }).catch((error) => {
      res.status(404)
      res.json({ 'error': 'Not found' })
    })
})

app.get('/addresses/:address/names', function (req, res) {
    const addresses = req.params.address.split(',')
    let count =  addresses.length
    let results = []

    addresses.forEach((address) => {
      blockstackGetNamesOwnedByAddress(address).then((result) => {
        results.push(result)

        if(results.length >= addresses.length)
          res.json({results: results})
          
      })
    })

})

app.post('/users', function (req, res) {
    blockstackRegister(req.body.name).then((result) => {
      res.json(JSON.parse(names))
    })
})

app.get('/search', function (req, res) {
    blockstackSearch(req.params.query).then((results) => {
      res.json(JSON.parse(results))
    })
})

exec(`pwd`, function (error, stdout, stderr) {
    console.log(`pwd: ${stdout}`)
})

console.log('Trying to enabling Blockstack CLI advanced mode...')
exec(`${blockstack} set_advanced_mode on`, function (error, stdout, stderr) {
  if(error !== null) {
    console.error(error);
    console.error('You need to have a working installation of blockstack.')
    process.exit(1);
  }

  response =  JSON.parse(stdout);
  if(response.status != true) {
    console.error('Enabling Blockstack CLI advanced mode failed.');
    console.error('Check you Blockstack installation and try again.');
    process.exit(1);
  }

  console.log("...advanced mode enabled!")
  app.listen(port, function () {
      console.log("Blockstack Core API mock up server running at: http://localhost:" + port);
      console.log("Press Control + C to shutdown");
  })

})


function blockstackGetNamesOwnedByAddress(address) {
  return new Promise((resolve, reject) => {
    exec(`${blockstack} get_names_owned_by_address ` + address, function (error, stdout, stderr) {
      if(error !== null) {
        reject(error);
        return;
      }

      resolve({address: address, names: JSON.parse(stdout)});
    })
  })
}

function blockstackGetNameZonefile(name) {
  return new Promise((resolve, reject) => {
    exec(`${blockstack} get_name_zonefile ` + name, function (zonefileError, zonefileStdout, zonefileStderr) {
      if(zonefileError !== null) {
        reject(zonefileError);
        return;
      }

      const zonefile = JSON.parse(zonefileStdout);

      exec(`${blockstack} whois ` + name, function (whoisError, whoisStdout, whoisStderr) {
        if(whoisError !== null) {
          reject(whoisError);
          return;
        }

        const whois = JSON.parse(whoisStdout);

        resolve({
            address: whois['owner_address'],
            zonefile: zonefile['zonefile']
          });
      })
    })
  })
}

function blockstackRegister(name) {
  return new Promise((resolve, reject) => {
    exec(`${blockstack} get_name_blockchain_record ` + name, function (error, stdout, stderr) {
      if(error !== null) {

        reject(error);
        return;
      }
      resolve(stdout);
    })
  })
}

function blockstackSearch(query) {
  return new Promise((resolve, reject) => {
    const results = {
      "results": [
        {
          "profile": {
            "cover": {
              "url": "https://s3.amazonaws.com/97p/foggy-tree.jpg"
            },
            "github": {
              "username": "blockstack"
            },
            "name": {
              "formatted": "A Blockstacker"
            },
            "v": "0.2",
            "website": "https://blockstack.org/"
          },
          "username": "blockstack"
        }
      ]
    };

    resolve(JSON.stringify(results));
  })
}
