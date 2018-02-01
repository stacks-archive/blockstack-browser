// Load modules

var Hapi = require('hapi');
var Nunjucks = require('nunjucks');
var Path = require('path');
var Vision = require('../..');


// Declare internals

var internals = {};


var rootHandler = function (request, reply) {

    reply.view('index', {
        title: 'examples/views/nunjucks/index.js | Hapi ' + request.server.version,
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
                    compile: function (src, options) {

                        var template = Nunjucks.compile(src, options.environment);

                        return function (context) {

                            return template.render(context);
                        };
                    },

                    prepare: function (options, next) {

                        options.compileOptions.environment = Nunjucks.configure(options.path, { watch: false });
                        return next();
                    }
                }
            },
            path: Path.join(__dirname, 'templates')
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
