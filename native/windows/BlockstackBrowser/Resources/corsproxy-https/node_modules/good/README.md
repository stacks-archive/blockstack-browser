![good Logo](images/good.png)

[**hapi**](https://github.com/hapijs/hapi) process monitoring

[![Build Status](https://secure.travis-ci.org/hapijs/good.svg)](http://travis-ci.org/hapijs/good)![Current Version](https://img.shields.io/npm/v/good.svg)

Lead Maintainer: [Adam Bretz](https://github.com/arb)


**good** is a Hapi process monitor. It listens for events emitted by Hapi Server instances and allows custom reporters to be registered that output subscribed events.

## Example Usage
For example:

```javascript
var Hapi = require('hapi');
var server = new Hapi.Server();
server.connection({ host: 'localhost' });

var options = {
    opsInterval: 1000,
    filter:{
        access_token: 'censor'
    },
    reporters: [{
        reporter: require('good-console'),
        events: { log: '*', response: '*' }
    }, {
        reporter: require('good-file'),
        events: { ops: '*' },
        config: './test/fixtures/awesome_log'
    }, {
        reporter: 'good-http',
        events: { error: '*' },
        config: {
            endpoint: 'http://prod.logs:3000',
            wreck: {
                headers: { 'x-api-key' : 12345 }
            }
        }
    }]
};

server.register({
    register: require('good'),
    options: options
}, function (err) {

    if (err) {
        console.error(err);
    }
    else {
        server.start(function () {

            console.info('Server started at ' + server.info.uri);
        });
    }
});

```

This example does the following:

1. Sets up the [`GoodConsole`](https://github.com/hapijs/good-console) reporter listening for 'response' and 'log' events.
2. Sets up the [`GoodFile`](https://github.com/hapijs/good-file) reporter to listen for 'ops' events and log them to `./test/fixtures/awesome_log` according to the file rules listed in the good-file documentation.
3. Sets up the [`GoodHttp`](https://github.com/hapijs/good-http) reporter to listen for error events and POSTs them to `http://prod.logs:3000` with additional settings to pass into `Wreck`

**NOTE**: Ensure calling `server.connection` prior to registering `Good`. `request` and  `response` event listeners are only registered on connections that exist on `server` at the time `Good` is registered.

Log messages are created with tags. Usually a log will include a tag to indicate if it is related to an error or info along with where the message originates. If, for example, the console should only output error's that were logged you can use the following configuration:

```javascript
var options = {
    reporters: [{
        reporter: require('good-console'),
        events: { log: ['error', 'medium'] }
    }]
};
```

This will now _only_ log 'log' events that have the 'error' _or_ 'medium' tag attached to them. Any 'log' events without one of those tags will be ignored.


## Reporters

### Officially supported by hapijs

This is a list of good-reporters under the hapijs umbrella:
- [good-udp](https://github.com/hapijs/good-udp)
- [good-file](https://github.com/hapijs/good-file)
- [good-http](https://github.com/hapijs/good-http)
- [good-console](https://github.com/hapijs/good-console)

### Community powered
Here are some additional reporters that are available from the hapijs community:
- [good-influxdb](https://github.com/totherik/good-influxdb)
- [good-loggly](https://github.com/fhemberger/good-loggly)
- [good-winston](https://github.com/lancespeelmon/good-winston)
- [hapi-good-logstash](https://github.com/atroo/hapi-good-logstash)
- [good-graylog2](https://github.com/CascadeEnergy/good-graylog2)

## API

See the [API Reference](https://github.com/hapijs/good/blob/v6.6.3/API.md).
