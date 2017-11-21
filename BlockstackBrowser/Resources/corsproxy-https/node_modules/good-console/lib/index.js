// Load modules

var Squeeze = require('good-squeeze').Squeeze;
var Hoek = require('hoek');
var Moment = require('moment');
var SafeStringify = require('json-stringify-safe');
var Through = require('through2');

// Declare internals

var internals = {
    defaults: {
        format: 'YYMMDD/HHmmss.SSS',
        utc: true,
        color: true
    }
};

module.exports = internals.GoodConsole = function (events, config) {

    if (!(this instanceof internals.GoodConsole)) {
        return new internals.GoodConsole(events, config);
    }
    config = config || {};
    this._settings = Hoek.applyToDefaults(internals.defaults, config);
    this._filter = new Squeeze(events);
};

internals.GoodConsole.prototype.init = function (stream, emitter, callback) {

    var self = this;

    if (!stream._readableState.objectMode) {
        return callback(new Error('stream must be in object mode'));
    }

    stream.pipe(this._filter).pipe(Through.obj(function goodConsoleTransform (data, enc, next) {

        var eventName = data.event;
        var tags = [];

        /*eslint-disable */
        if (Array.isArray(data.tags)) {
            tags = data.tags.concat([]);
        } else if (data.tags != null) {
            tags = [data.tags];
        }
        /*eslint-enable */

        tags.unshift(eventName);

        if (eventName === 'response') {
            this.push(self._formatResponse(data, tags));
            return next();
        }

        if (eventName ===  'wreck') {
            this.push(self._formatWreck(data, tags));
            return next();
        }

        var eventPrintData = {
            timestamp: data.timestamp || Date.now(),
            tags: tags,
            data: undefined
        };

        if (eventName === 'ops') {
            eventPrintData.data = Hoek.format('memory: %sMb, uptime (seconds): %s, load: %s',
                Math.round(data.proc.mem.rss / (1024 * 1024)),
                data.proc.uptime,
                data.os.load);

            this.push(self._printEvent(eventPrintData));
            return next();
        }

        if (eventName === 'error') {
            eventPrintData.data = 'message: ' + data.error.message + ' stack: ' + data.error.stack;

            this.push(self._printEvent(eventPrintData));
            return next();
        }

        if (eventName === 'request' || eventName === 'log') {
            eventPrintData.data = 'data: ' + (typeof data.data === 'object' ? SafeStringify(data.data) : data.data);

            this.push(self._printEvent(eventPrintData));
            return next();
        }

        // Event that is unknown to good-console, try a defualt.
        if (data.data) {
            eventPrintData.data = 'data: ' + (typeof data.data === 'object' ? SafeStringify(data.data) : data.data);
        }
        else {
            eventPrintData.data = 'data: (none)';
        }

        this.push(self._printEvent(eventPrintData));
        return next();
    })).pipe(process.stdout);

    callback();
};

internals.GoodConsole.prototype._printEvent = function (event) {

    var m = Moment(parseInt(event.timestamp, 10));
    if (!this._settings.utc) { m.local(); }

    var timestring = m.format(this._settings.format);
    var data = event.data;
    var output = timestring + ', [' + event.tags.toString() + '], ' + data;

    return output + '\n';
};

internals.GoodConsole.prototype._formatResponse = function (event, tags) {

    var query = event.query ? JSON.stringify(event.query) : '';
    var responsePayload = '';

    if (typeof event.responsePayload === 'object' && event.responsePayload) {
        responsePayload = 'response payload: ' + SafeStringify(event.responsePayload);
    }

    var method = this._formatMethod(event.method);
    var statusCode = this._formatStatusCode(event.statusCode) || '';

    return this._printEvent({
        timestamp: event.timestamp,
        tags: tags,
        //instance, method, path, query, statusCode, responseTime, responsePayload
        data: Hoek.format('%s: %s %s %s %s (%sms) %s', event.instance, method, event.path, query, statusCode, event.responseTime, responsePayload)
    });
};

internals.GoodConsole.prototype._formatWreck = function (event, tags) {

    var data, method, statusCode;
    method = this._formatMethod(event.request.method);

    if (event.error) {
        data = Hoek.format('%s: %s (%sms) error: %s stack: %s', method, event.request.url, event.timeSpent, event.error.message, event.error.stack);
    } else {
        statusCode = this._formatStatusCode(event.response.statusCode);
        data = Hoek.format('%s: %s %s %s (%sms)', method, event.request.url, statusCode, event.response.statusMessage, event.timeSpent);
    }


    return this._printEvent({
        timestamp: event.timestamp,
        tags: tags,
        data: data
    });
};

internals.GoodConsole.prototype._formatMethod = function (method) {

    var color;
    var methodColors = {
        get: 32,
        delete: 31,
        put: 36,
        post: 33
    };
    var formattedMethod = method.toLowerCase();
    if (this._settings.color) {
        color = methodColors[method.toLowerCase()] || 34;
        formattedMethod = '\x1b[1;' + color + 'm' + formattedMethod + '\x1b[0m';
    }
    return formattedMethod;
};

internals.GoodConsole.prototype._formatStatusCode = function (statusCode) {

    var color;
    if (statusCode && this._settings.color) {
        color = 32;
        if (statusCode >= 500) {
            color = 31;
        } else if (statusCode >= 400) {
            color = 33;
        } else if (statusCode >= 300) {
            color = 36;
        }
        return '\x1b[' + color + 'm' + statusCode + '\x1b[0m';
    }
    return statusCode;
};

internals.GoodConsole.attributes = {
    pkg: require('../package.json')
};
