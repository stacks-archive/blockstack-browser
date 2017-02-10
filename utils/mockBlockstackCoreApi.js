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

app.post('/v1/names', function (req, res) {
  res.json({transaction_hash: "57fff5dbde35e6ce8914b755f86c90592debd98cc2ce03d779d361cb0458e049"})
})

app.get('/v1/names/:name', function (req, res) {
    blockstackGetNameZonefile(req.params.name).then((zonefile) => {
      res.json(zonefile)
    }).catch((error) => {
      console.error(error)
      res.status(404)
      res.json({ 'error': 'Not found' })
    })
})

app.get('/v1/prices/names/:name', function (req, res) {
    blockstackPrice(req.params.name).then((price) => {
      res.json(price)
    }).catch((error) => {
      console.error(error)
      res.status(404)
      res.json({ 'error': 'Not found' })
    })
})

app.get('/v1/addresses/:address', function (req, res) {
  blockstackGetNamesOwnedByAddress(req.params.address).then((result) => {
    res.json(result)
  }).catch((error) => {
    console.error(error)
    res.status(404)
    res.json({ 'error': 'Not found' })
  })
})

app.get('/v1/blockchain/bitcoin/pending', function (req, res) {
  res.json(mockPending())
})

app.get('/v1/wallet/payment_address', function (req, res) {
  res.json({
    address: "12zJpjAhHEr27DZabEUGCrf7Zf9PcTCvHK"
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

      resolve({names: JSON.parse(stdout)});
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

function blockstackPrice(name) {
  return new Promise((resolve, reject) => {
    exec(`${blockstack} price ` + name, function (error, stdout, stderr) {
      if(error !== null) {
        reject(error);
        return;
      }
      let result = JSON.parse(stdout)
      resolve(result)
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

function mockPending() {
    return {
     "queues": {
        "preorder": [
           {
               "name": "...",
               "tx_hash": "...",
               "confirmations": 12
           }
        ],
        "register": [
           {
               "name": "...",
               "tx_hash": "...",
               "confirmations": 6
           }
        ],
        "update": [
           {
               "name": "...",
               "tx_hash": "...",
               "confirmations": 1
           }
        ],
        "transfer": [
           {
               "name": "...",
               "tx_hash": "...",
               "confirmations": 1
           }
        ],
     }
  }
}
