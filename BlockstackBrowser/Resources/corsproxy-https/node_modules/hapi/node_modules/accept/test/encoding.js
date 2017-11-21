// Load modules

var Code = require('code');
var Lab = require('lab');
var Accept = require('..');


// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.describe;
var it = lab.it;
var expect = Code.expect;

/*
    Accept-Encoding: compress, gzip
    Accept-Encoding:
    Accept-Encoding: *
    Accept-Encoding: compress;q=0.5, gzip;q=1.0
    Accept-Encoding: gzip;q=1.0, identity; q=0.5, *;q=0
*/

describe('encoding()', function () {

    it('parses header', function (done) {

        var encoding = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0');
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('gzip');
        done();
    });

    it('parses header with weightings', function (done) {

        var encoding = Accept.encoding('gzip;q=0.001, identity; q=0.05, *;q=0');
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('identity');
        done();
    });

    it('requires that preferences be an array', function (done) {

        expect(function () {

            Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', 'identity, deflate');
        }).to.throw('Preferences must be an array');
        done();
    });

    it('parses header with preferences', function (done) {

        var encoding = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gzip']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('gzip');
        done();
    });

    it('parses header with preferences (case insensitive)', function (done) {

        var encoding = Accept.encoding('GZIP;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gZip']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('gzip');
        done();
    });

    it('parses header with preferences (x-)', function (done) {

        var encoding = Accept.encoding('x-gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate', 'gzip']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('gzip');
        done();
    });

    it('parses header with preferences (secondary match)', function (done) {

        var encoding = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['identity', 'deflate']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('identity');
        done();
    });

    it('parses header with preferences (no match)', function (done) {

        var encoding = Accept.encoding('gzip;q=1.0, identity; q=0.5, *;q=0', ['deflate']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.equal('');
        done();
    });

    it('returns top preference on *', function (done) {

        var encoding = Accept.encoding('*', ['gzip', 'deflate']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('gzip');
        done();
    });

    it('returns top preference on * (identity)', function (done) {

        var encoding = Accept.encoding('*', ['identity', 'gzip', 'deflate']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('identity');
        done();
    });

    it('returns identity on empty', function (done) {

        var encoding = Accept.encoding('');
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('identity');
        done();
    });

    it('returns none on empty with non identity preferences', function (done) {

        var encoding = Accept.encoding('', ['gzip', 'deflate']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('');
        done();
    });

    it('returns identity on undefined without preference', function (done) {

        var encoding = Accept.encoding();
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('identity');
        done();
    });

    it('excludes q=0', function (done) {

        var encoding = Accept.encoding('compress;q=0.5, gzip;q=0.0', ['gzip', 'compress']);
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.equal('compress');
        done();
    });

    it('ignores improper weightings', function (done) {

        var encoding = Accept.encoding('gzip;q=0.01, identity; q=0.5, deflate;q=1.1, *;q=0');
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.deep.equal('deflate');
        done();
    });

    it('errors on invalid header', function (done) {

        var encoding = Accept.encoding('a;b');
        expect(encoding.isBoom).to.exist();
        done();
    });

    it('obeys disallow with wildcard', function (done) {

        var encoding = Accept.encoding('*, gzip;q=0, deflate;q=1.1', ['gzip', 'deflate']); // gzip is disallowed
        expect(encoding.isBoom).to.not.exist();
        expect(encoding).to.equal('deflate');
        done();
    });
});

describe('encodings()', function () {

    it('parses header', function (done) {

        var encodings = Accept.encodings('gzip;q=1.0, identity; q=0.5, *;q=0');
        expect(encodings.isBoom).to.not.exist();
        expect(encodings).to.deep.equal(['gzip', 'identity']);
        done();
    });

    it('parses header (reverse header)', function (done) {

        var encodings = Accept.encodings('compress;q=0.5, gzip;q=1.0');
        expect(encodings.isBoom).to.not.exist();
        expect(encodings).to.deep.equal(['gzip', 'compress', 'identity']);
        done();
    });

    it('parses header (exclude encodings)', function (done) {

        var encodings = Accept.encodings('compress;q=0.5, gzip;q=0.0');
        expect(encodings.isBoom).to.not.exist();
        expect(encodings).to.deep.equal(['compress', 'identity']);
        done();
    });

    it('parses header (exclude identity)', function (done) {

        var encodings = Accept.encodings('compress;q=0.5, gzip;q=1.0, identity;q=0');
        expect(encodings.isBoom).to.not.exist();
        expect(encodings).to.deep.equal(['gzip', 'compress']);
        done();
    });
});
