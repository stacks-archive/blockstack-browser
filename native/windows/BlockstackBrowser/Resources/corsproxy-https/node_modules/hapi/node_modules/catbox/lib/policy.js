// Load modules

var Boom = require('boom');
var Hoek = require('hoek');
var Joi = require('joi');


// Declare internals

var internals = {
    day: 24 * 60 * 60 * 1000
};


exports = module.exports = internals.Policy = function (options, cache, segment) {

    Hoek.assert(this.constructor === internals.Policy, 'Cache Policy must be instantiated using new');

    this._cache = cache;
    this._pendings = {};                                        // id -> [callbacks]
    this.rules(options);

    this.stats = {
        sets: 0,
        gets: 0,
        hits: 0,
        stales: 0,
        generates: 0,
        errors: 0
    };

    if (cache) {
        var nameErr = cache.validateSegmentName(segment);
        Hoek.assert(nameErr === null, 'Invalid segment name: ' + segment + (nameErr ? ' (' + nameErr.message + ')' : ''));

        this._segment = segment;
    }
};


internals.Policy.prototype.rules = function (options) {

    this.rule = internals.Policy.compile(options, !!this._cache);
};


internals.Policy.prototype.get = function (key, callback) {     // key: string or { id: 'id' }

    var self = this;

    ++this.stats.gets;

    // Check if request is already pending

    var id = (key && typeof key === 'object') ? key.id : key;
    var pendingsId = '+' + id;                                  // Prefix to avoid conflicts with JS internals (e.g. __proto__)
    if (this._pendings[pendingsId]) {
        this._pendings[pendingsId].push(process.domain ? process.domain.bind(callback) : callback);     // Explicitly bind callback to its process.domain (_finalize might get called from a different active process.domain)
        return;
    }

    this._pendings[pendingsId] = [callback];

    // Lookup in cache

    var timer = new Hoek.Timer();
    this._get(id, function (err, cached) {

        if (err) {
            ++self.stats.errors;
        }

        // Prepare report

        var report = {
            msec: timer.elapsed(),
            error: err
        };

        if (cached) {
            report.stored = cached.stored;
            report.ttl = cached.ttl;
            var staleIn = typeof self.rule.staleIn === 'function' ? self.rule.staleIn(cached.stored, cached.ttl) : self.rule.staleIn;
            cached.isStale = (staleIn ? (Date.now() - cached.stored) >= staleIn : false);
            report.isStale = cached.isStale;

            if (cached.isStale) {
                ++self.stats.stales;
            }
        }

        // No generate method

        if (!self.rule.generateFunc ||
            (err && !self.rule.generateOnReadError)) {

            return internals.respond(self, id, err, cached ? cached.item : null, cached, report);
        }

        // Check if found and fresh

        if (cached &&
            !cached.isStale) {

            return internals.respond(self, id, null, cached.item, cached, report);
        }

        return self._generate(id, key, cached, report);
    });
};


internals.Policy.prototype._generate = function (id, key, cached, report) {

    var self = this;

    var respond = Hoek.once(internals.respond);

    if (cached) {                                       // Must be stale

        // Set stale timeout

        cached.ttl -= this.rule.staleTimeout;           // Adjust TTL for when the timeout is invoked (staleTimeout must be valid if isStale is true)
        if (cached.ttl > 0) {
            setTimeout(function () {

                return respond(self, id, null, cached.item, cached, report);
            }, this.rule.staleTimeout);
        }
    }
    else if (this.rule.generateTimeout) {

        // Set item generation timeout (when not in cache)

        setTimeout(function () {

            return respond(self, id, Boom.serverTimeout(), null, null, report);
        }, this.rule.generateTimeout);
    }

    // Generate new value

    ++self.stats.generates;                                     // Record generation before call in case it times out

    try {
        this.rule.generateFunc.call(null, key, function (generateError, value, ttl) {

            var finalize = function (err) {

                var error = generateError || (self.rule.generateIgnoreWriteError ? null : err);
                if (cached &&
                    error &&
                    !self.rule.dropOnError) {

                    return respond(self, id, error, cached.item, cached, report);
                }

                return respond(self, id, error, value, null, report);       // Ignored if stale value already returned
            };

            // Error (if dropOnError is not set to false) or not cached

            if ((generateError && self.rule.dropOnError) ||
                ttl === 0) {                                    // null or undefined means use policy

                return self.drop(id, finalize);                 // Invalidate cache
            }

            if (!generateError) {
                return self.set(id, value, ttl, finalize);      // Lazy save (replaces stale cache copy with late-coming fresh copy)
            }

            return finalize();
        });
    }
    catch (err) {
        return respond(self, id, err, null, null, report);
    }
};


internals.Policy.prototype._get = function (id, callback) {

    if (!this._cache) {
        return Hoek.nextTick(callback)(null, null);
    }

    this._cache.get({ segment: this._segment, id: id }, callback);
};


internals.respond = function (policy, id, err, value, cached, report) {

    id = '+' + id;
    var pendings = policy._pendings[id];
    delete policy._pendings[id];

    var length = pendings.length;
    for (var i = 0; i < length; ++i) {
        Hoek.nextTick(pendings[i])(err, value, cached, report);
    }

    if (report.isStale !== undefined) {
        policy.stats.hits += length;
    }
};


internals.Policy.prototype.set = function (key, value, ttl, callback) {

    var self = this;

    callback = callback || Hoek.ignore;

    ++self.stats.sets;

    if (!this._cache) {
        return callback(null);
    }

    ttl = ttl || internals.Policy.ttl(this.rule);
    var id = (key && typeof key === 'object') ? key.id : key;
    this._cache.set({ segment: this._segment, id: id }, value, ttl, function (err) {

        if (err) {
            ++self.stats.errors;
        }

        return callback(err);
    });
};


internals.Policy.prototype.drop = function (id, callback) {

    var self = this;

    callback = callback || Hoek.ignore;

    if (!this._cache) {
        return callback(null);
    }

    this._cache.drop({ segment: this._segment, id: id }, function (err) {

        if (err) {
            ++self.stats.errors;
        }

        return callback(err);
    });
};


internals.Policy.prototype.ttl = function (created) {

    return internals.Policy.ttl(this.rule, created);
};


internals.schema = Joi.object({
    expiresIn: Joi.number().integer().min(1),
    expiresAt: Joi.string().regex(/^\d\d?\:\d\d$/),
    staleIn: [Joi.number().integer().min(1).max(86400000 - 1), Joi.func()],               // One day - 1 (max is inclusive)
    staleTimeout: Joi.number().integer().min(1),
    generateFunc: Joi.func(),
    generateTimeout: Joi.number().integer().min(1).allow(false),
    generateOnReadError: Joi.boolean(),
    generateIgnoreWriteError: Joi.boolean(),
    dropOnError: Joi.boolean(),

    // Ignored external keys (hapi)

    privacy: Joi.any(),
    cache: Joi.any(),
    segment: Joi.any(),
    shared: Joi.any()
})
    .without('expiresIn', 'expiresAt')
    .with('staleIn', 'generateFunc')
    .with('generateOnReadError', 'generateFunc')
    .with('generateIgnoreWriteError', 'generateFunc')
    .with('dropOnError', 'generateFunc')
    .and('generateFunc', 'generateTimeout')
    .and('staleIn', 'staleTimeout');


internals.Policy.compile = function (options, serverSide) {

    /*
        {
            expiresIn: 30000,
            expiresAt: '13:00',

            generateFunc: function (id, next) { next(err, result, ttl); }
            generateTimeout: 500,
            generateOnReadError: true,
            generateIgnoreWriteError: true,
            staleIn: 20000,
            staleTimeout: 500,
            dropOnError: true
        }
     */

    var rule = {};

    if (!options ||
        !Object.keys(options).length) {

        return rule;
    }

    // Validate rule

    Joi.assert(options, internals.schema, 'Invalid cache policy configuration');

    var hasExpiresIn = options.expiresIn !== undefined && options.expiresIn !== null;
    var hasExpiresAt = options.expiresAt !== undefined && options.expiresAt !== null;

    Hoek.assert(!hasExpiresAt || typeof options.expiresAt === 'string', 'expiresAt must be a string', options);
    Hoek.assert(!hasExpiresIn || Hoek.isInteger(options.expiresIn), 'expiresIn must be an integer', options);
    Hoek.assert(!hasExpiresIn || !options.staleIn || typeof options.staleIn === 'function' || options.staleIn < options.expiresIn, 'staleIn must be less than expiresIn');
    Hoek.assert(!options.staleIn || serverSide, 'Cannot use stale options without server-side caching');
    Hoek.assert(!options.staleTimeout || !hasExpiresIn || options.staleTimeout < options.expiresIn, 'staleTimeout must be less than expiresIn');
    Hoek.assert(!options.staleTimeout || !hasExpiresIn || typeof options.staleIn === 'function' || options.staleTimeout < (options.expiresIn - options.staleIn), 'staleTimeout must be less than the delta between expiresIn and staleIn');

    // Expiration

    if (hasExpiresAt) {

        // expiresAt

        var time = /^(\d\d?):(\d\d)$/.exec(options.expiresAt);
        rule.expiresAt = {
            hours: parseInt(time[1], 10),
            minutes: parseInt(time[2], 10)
        };
    }
    else {

        // expiresIn

        rule.expiresIn = options.expiresIn || 0;
    }

    // generateTimeout

    if (options.generateFunc) {
        rule.generateFunc = options.generateFunc;
        rule.generateTimeout = options.generateTimeout;

        // Stale

        if (options.staleIn) {
            rule.staleIn = options.staleIn;
            rule.staleTimeout = options.staleTimeout;
        }

        rule.dropOnError = options.dropOnError !== undefined ? options.dropOnError : true;                                          // Defaults to true
    }

    rule.generateOnReadError = options.generateOnReadError !== undefined ? options.generateOnReadError : true;                      // Defaults to true
    rule.generateIgnoreWriteError = options.generateIgnoreWriteError !== undefined ? options.generateIgnoreWriteError : true;       // Defaults to true

    return rule;
};


internals.Policy.ttl = function (rule, created, now) {

    now = now || Date.now();
    created = created || now;
    var age = now - created;

    if (age < 0) {
        return 0;                                                                   // Created in the future, assume expired/bad
    }

    if (rule.expiresIn) {
        return Math.max(rule.expiresIn - age, 0);
    }

    if (rule.expiresAt) {
        if (age > internals.day) {                                                  // If the item was created more than a 24 hours ago
            return 0;
        }

        var expiresAt = new Date(created);                                          // Compare expiration time on the same day
        expiresAt.setHours(rule.expiresAt.hours);
        expiresAt.setMinutes(rule.expiresAt.minutes);
        expiresAt.setSeconds(0);
        expiresAt.setMilliseconds(0);
        var expires = expiresAt.getTime();

        if (expires <= created) {
            expires += internals.day;                                               // Move to tomorrow
        }

        if (now >= expires) {                                                       // Expired
            return 0;
        }

        return expires - now;
    }

    return 0;                                                                       // No rule
};


internals.Policy.prototype.isReady = function () {

    if (!this._cache) {
        return false;
    }

    return this._cache.connection.isReady();
};
