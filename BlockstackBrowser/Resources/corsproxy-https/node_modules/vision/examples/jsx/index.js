// Load modules

var Hapi = require('hapi');
var Vision = require('../..');


// Declare internals

var internals = {};


var rootHandler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/jsx/index.js | Hapi ' + request.server.version,
        message: 'Index - Hello World!'
    });
};

var aboutHandler = function (request, reply) {

    reply.view('about', {
        title: 'examples/views/jsx/index.js | Hapi ' + request.server.version,
        message: 'About - Hello World!'
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
            engines: { jsx: require('hapi-react-views') },
            path: __dirname + '/templates',
            compileOptions: {
                pretty: true
            }
        });

        server.route({ method: 'GET', path: '/', handler: rootHandler });
        server.route({ method: 'GET', path: '/about', handler: aboutHandler });
        server.start(function (err) {

            if (err) {
                throw err;
            }

            console.log('Server is listening at ' + server.info.uri);
        });
    });
};


internals.main();
