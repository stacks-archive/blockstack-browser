// Load modules

var Directory = require('./directory');
var Etag = require('./etag');
var File = require('./file');
var Hoek = require('hoek');


// Declare internals

var internals = {
    defaults: {
        etagsCacheMaxSize: 1000
    }
};


exports.register = function (server, options, next) {

    var settings = Hoek.applyToDefaults(internals.defaults, options);

    server.expose('_etags', settings.etagsCacheMaxSize ? new Etag.Cache(settings.etagsCacheMaxSize) : null);
    server.expose('_pendings', {});

    server.handler('file', File.handler);
    server.handler('directory', Directory.handler);

    server.decorate('reply', 'file', function (path, responseOptions) {

        return this.response(File.response(path, responseOptions, this.request));
    });

    return next();
};

exports.register.attributes = {
    pkg: require('../package.json'),
    connections: false,
    once: true
};
