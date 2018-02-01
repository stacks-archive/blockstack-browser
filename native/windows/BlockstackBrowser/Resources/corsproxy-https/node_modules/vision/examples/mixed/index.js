// Load modules

var Hapi = require('hapi');
var Vision = require('../..');


// Declare internals

var internals = {};


var indexHandler = function (request, reply) {

    reply.view('index.html');
};

var oneHandler = function (request, reply) {

    reply.view('index.jade');
};

var twoHandler = function (request, reply) {

    reply.view('handlebars.html');
};


internals.main = function () {

    var server = new Hapi.Server();
    server.connection({ port: 8000 });
    server.register(Vision, function (err) {

        if (err) {
            throw err;
        }

        server.views({
            engines: {
                'html': require('handlebars'),
                'jade': require('jade')
            },
            path: __dirname + '/templates',
            context: {
                title: 'examples/views/mixed | Hapi ' + server.version,
                message: 'Hello World!'
            }
        });

        server.route({ method: 'GET', path: '/', handler: indexHandler });
        server.route({ method: 'GET', path: '/one', handler: oneHandler });
        server.route({ method: 'GET', path: '/two', handler: twoHandler });
        server.start(function (err) {

            if (err) {
                throw err;
            }

            console.log('Server is listening at ' + server.info.uri);
        });
    });
};


internals.main();
