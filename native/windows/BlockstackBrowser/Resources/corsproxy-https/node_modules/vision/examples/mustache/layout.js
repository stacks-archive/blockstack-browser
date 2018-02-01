// Load modules

var Hapi = require('hapi');
var Mustache = require('mustache');
var Vision = require('../..');


// Declare internals

var internals = {};


var rootHandler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/mustache/layout.js | Hapi ' + request.server.version,
        message: 'Index - Hello World!'
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
            engines: {
                html: {
                    compile: function (template) {

                        Mustache.parse(template);

                        return function (context) {

                            return Mustache.render(template, context);
                        };
                    }
                }
            },
            relativeTo: __dirname,
            path: 'templates/withLayout',
            layout: true
        });

        server.route({ method: 'GET', path: '/', handler: rootHandler });
        server.start(function (err) {

            if (err) {
                throw err;
            }

            console.log('Server is listening at ' + server.info.uri);
        });
    });
};


internals.main();
