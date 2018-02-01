// Load modules

var Hapi = require('hapi');
var Vision = require('../..');


// Declare internals

var internals = {};


var handler = function (request, reply) {

    reply.view('withLayout/index', {
        title: 'examples/views/handlebars/layout.js | Hapi ' + request.server.version,
        message: 'Hello World!\n'
    });
};


internals.main = function () {

    var server = new Hapi.Server();
    server.connection({ port: 8000 });
    server.register(Vision, function (err) {

        if (err) {
            throw err;
        }

        server.views({
            engines: { html: require('handlebars') },
            path: __dirname + '/templates',
            layout: true
        });

        server.route({ method: 'GET', path: '/', handler: handler });
        server.start(function (err) {

            if (err) {
                throw err;
            }

            console.log('Server is listening at ' + server.info.uri);
        });
    });
};


internals.main();
