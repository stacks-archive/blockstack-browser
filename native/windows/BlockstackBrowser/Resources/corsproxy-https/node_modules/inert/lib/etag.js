// Load modules

var Fs = require('fs');
var Crypto = require('crypto');
var Boom = require('boom');
var Hoek = require('hoek');
var LruCache = require('lru-cache');


// Declare internals

var internals = {};


internals.computeHashed = function (response, stat, next) {

    var etags = response.request.server.plugins.inert._etags;
    if (!etags) {
        return next(null, null);
    }

    // Use stat info for an LRU cache key.

    var path = response.source.path;
    var cachekey = [path, stat.ino, stat.size, stat.mtime.getTime()].join('-');

    // The etag hashes the file contents in order to be consistent across distributed deployments

    var cachedEtag = etags.get(cachekey);
    if (cachedEtag) {
        return next(null, cachedEtag);
    }

    var pendings = response.request.server.plugins.inert._pendings;
    var pendingsId = '+' + cachekey;                                  // Prefix to avoid conflicts with JS internals (e.g. __proto__)
    var nexts = pendings[pendingsId];
    if (nexts) {
        return nexts.push(next);
    }

    // Start hashing

    nexts = [next];
    pendings[pendingsId] = nexts;

    internals.hashFile(response, function (err, hash) {

        if (!err) {
            etags.set(cachekey, hash);
        }

        // Call pending callbacks

        delete pendings[pendingsId];
        for (var i = 0, il = nexts.length; i < il; ++i) {
            Hoek.nextTick(nexts[i])(err, hash);
        }
    });
};


internals.hashFile = function (response, callback) {

    var hash = Crypto.createHash('sha1');
    hash.setEncoding('hex');

    var fileStream = Fs.createReadStream(response.source.path, { fd: response.source.fd, autoClose: false });
    fileStream.pipe(hash);

    var done = function (err) {

        if (err) {
            return callback(Boom.wrap(err, null, 'Failed to hash file'));
        }

        return callback(null, hash.read());
    };

    done = Hoek.once(done);

    fileStream.on('end', done);
    fileStream.on('error', done);
};


internals.computeSimple = function (response, stat, next) {

    var size = stat.size.toString(16);
    var mtime = stat.mtime.getTime().toString(16);

    return next(null, size + '-' + mtime);
};


exports.apply = function (response, stat, next) {

    var etagMethod = response.source.settings.etagMethod;
    if (etagMethod === false) {
        return next();
    }

    var applyEtag = function (err, etag) {

        if (err) {
            return next(err);
        }

        if (etag !== null) {
            response.etag(etag, { vary: true });
        }

        return next();
    };

    if (etagMethod === 'simple') {
        return internals.computeSimple(response, stat, applyEtag);
    }

    return internals.computeHashed(response, stat, applyEtag);
};


exports.Cache = LruCache;
