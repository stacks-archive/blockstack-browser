// Load modules

var Catbox = require('..');
var Code = require('code');
var Lab = require('lab');
var Import = require('./import');
var Domain = require('domain');

// Declare internals

var internals = {};


// Test shortcuts

var lab = exports.lab = Lab.script();
var describe = lab.experiment;
var it = lab.test;
var expect = Code.expect;


describe('Policy', function () {

    it('returns cached item', function (done) {

        var client = new Catbox.Client(Import);
        var policy = new Catbox.Policy({ expiresIn: 1000 }, client, 'test');

        client.start(function (err) {

            expect(err).to.not.exist();

            policy.set('x', '123', null, function (err) {

                expect(err).to.not.exist();

                policy.get('x', function (err, value, cached, report) {

                    expect(err).to.not.exist();
                    expect(value).to.equal('123');
                    expect(policy.stats).to.deep.equal({ sets: 1, gets: 1, hits: 1, stales: 0, generates: 0, errors: 0 });
                    done();
                });
            });
        });
    });

    it('works with special property names', function (done) {

        var client = new Catbox.Client(Import);
        var policy = new Catbox.Policy({ expiresIn: 1000 }, client, 'test');

        client.start(function (err) {

            expect(err).to.not.exist();

            policy.set('__proto__', '123', null, function (err) {

                expect(err).to.not.exist();

                policy.get('__proto__', function (err, value, cached, report) {

                    expect(err).to.not.exist();
                    expect(value).to.equal('123');
                    expect(policy.stats).to.deep.equal({ sets: 1, gets: 1, hits: 1, stales: 0, generates: 0, errors: 0 });
                    done();
                });
            });
        });
    });

    it('finds nothing when using empty policy rules', function (done) {

        var client = new Catbox.Client(Import);
        var policy = new Catbox.Policy({}, client, 'test');

        client.start(function (err) {

            expect(err).to.not.exist();

            policy.set('x', '123', null, function (err) {

                expect(err).to.not.exist();

                policy.get('x', function (err, value, cached, report) {

                    expect(err).to.not.exist();
                    expect(value).to.not.exist();
                    expect(policy.stats).to.deep.equal({ sets: 1, gets: 1, hits: 0, stales: 0, generates: 0, errors: 0 });
                    done();
                });
            });
        });
    });

    it('returns cached item with no global rules and manual ttl', function (done) {

        var client = new Catbox.Client(Import);
        var policy = new Catbox.Policy({}, client, 'test');

        client.start(function (err) {

            expect(err).to.not.exist();

            policy.set('x', '123', 1000, function (err) {

                expect(err).to.not.exist();

                policy.get('x', function (err, value, cached, report) {

                    expect(err).to.not.exist();
                    expect(value).to.equal('123');
                    expect(policy.stats).to.deep.equal({ sets: 1, gets: 1, hits: 1, stales: 0, generates: 0, errors: 0 });
                    done();
                });
            });
        });
    });

    it('throws an error when segment is missing', function (done) {

        var config = {
            expiresIn: 50000
        };

        var fn = function () {

            var client = new Catbox.Client(Import);
            var policy = new Catbox.Policy(config, client);
        };

        expect(fn).to.throw('Invalid segment name: undefined (Empty string)');
        done();
    });

    describe('get()', function () {

        it('returns cached item using object id', function (done) {

            var client = new Catbox.Client(Import);
            var policy = new Catbox.Policy({ expiresIn: 1000 }, client, 'test');

            client.start(function (err) {

                expect(err).to.not.exist();

                policy.set({ id: 'x' }, '123', null, function (err) {

                    expect(err).to.not.exist();

                    policy.get({ id: 'x' }, function (err, value, cached, report) {

                        expect(err).to.not.exist();
                        expect(value).to.equal('123');
                        expect(policy.stats).to.deep.equal({ sets: 1, gets: 1, hits: 1, stales: 0, generates: 0, errors: 0 });
                        done();
                    });
                });
            });
        });

        it('returns error on null id', function (done) {

            var client = new Catbox.Client(Import);
            var policy = new Catbox.Policy({ expiresIn: 1000 }, client, 'test');

            client.start(function (err) {

                expect(err).to.not.exist();

                policy.set(null, '123', null, function (err) {

                    expect(err).to.exist();
                    expect(err.message).to.equal('Invalid key');

                    policy.get(null, function (err, value, cached, report) {

                        expect(err).to.exist();
                        expect(err.message).to.equal('Invalid key');
                        expect(policy.stats).to.deep.equal({ sets: 1, gets: 1, hits: 0, stales: 0, generates: 0, errors: 2 });
                        done();
                    });
                });
            });
        });

        it('passes an error to the callback when an error occurs getting the item', function (done) {

            var engine = {
                start: function (callback) {

                    callback();
                },
                isReady: function () {

                    return true;
                },
                get: function (key, callback) {

                    callback(new Error());
                },
                validateSegmentName: function () {

                    return null;
                }
            };
            var policyConfig = {
                expiresIn: 50000
            };

            var client = new Catbox.Client(engine);
            var policy = new Catbox.Policy(policyConfig, client, 'test');

            policy.get('test1', function (err, value, cached, report) {

                expect(err).to.be.instanceOf(Error);
                expect(value).to.not.exist();
                expect(policy.stats).to.deep.equal({ sets: 0, gets: 1, hits: 0, stales: 0, generates: 0, errors: 1 });
                done();
            });
        });

        it('returns the cached result when no error occurs', function (done) {

            var engine = {
                start: function (callback) {

                    callback();
                },
                isReady: function () {

                    return true;
                },
                get: function (key, callback) {

                    callback(null, {
                        stored: 'stored',
                        item: 'item'
                    });
                },
                validateSegmentName: function () {

                    return null;
                }
            };
            var policyConfig = {
                expiresIn: 50000
            };

            var client = new Catbox.Client(engine);
            var policy = new Catbox.Policy(policyConfig, client, 'test');

            policy.get('test1', function (err, value, cached, report) {

                expect(value).to.equal('item');
                expect(cached.isStale).to.be.false();
                expect(policy.stats).to.deep.equal({ sets: 0, gets: 1, hits: 1, stales: 0, generates: 0, errors: 0 });
                done();
            });
        });

        it('returns null on get when no cache client provided', function (done) {

            var policy = new Catbox.Policy({ expiresIn: 1 });

            policy.get('x', function (err, value, cached, report) {

                expect(err).to.not.exist();
                expect(value).to.not.exist();
                expect(policy.stats).to.deep.equal({ sets: 0, gets: 1, hits: 0, stales: 0, generates: 0, errors: 0 });
                done();
            });
        });

        it('it only binds if domain exists', function (done) {

            var policy = new Catbox.Policy({
                expiresIn: 1000,
                staleIn: 100,
                generateTimeout: 10,
                generateFunc: function (id, next) {

                    setTimeout(function () {

                        return next(null, true);
                    }, 20);
                },
                staleTimeout: 50
            }, new Catbox.Client(Import), 'test');

            var tests = 0;
            var completed = 0;

            var checkAndDone = process.domain.bind(function (expected, actual) {    // Bind back to the lab domain

                expect(actual).to.not.exist();
                expect(expected).to.not.exist();
                expect(actual).to.not.equal(expected, process.domain);      // This should be the lab domain

                if (tests === completed) {
                    done();
                }
            });

            var test = function (domain) {

                tests++;

                Domain.create().run(function () {

                    process.domain = domain;

                    policy.get('', function (err, result) {

                        completed++;
                        checkAndDone(domain, process.domain);
                    });
                });
            };

            test(null);
            test(null);
        });

        it('it returns with the correct process domain', function (done) {

            var policy = new Catbox.Policy({
                expiresIn: 1000,
                staleIn: 100,
                generateTimeout: 10,
                generateFunc: function (id, next) {

                    setTimeout(function () {

                        return next(null, true);
                    }, 20);
                },
                staleTimeout: 50
            }, new Catbox.Client(Import), 'test');

            var tests = 0;
            var completed = 0;

            var checkAndDone = process.domain.bind(function (expected, actual) {

                expect(actual).to.equal(expected);

                if (tests === completed) {
                    done();
                }
            });

            var test = function (id) {

                tests++;

                Domain.create().run(function () {

                    process.domain.name = id;

                    policy.get('', function (err, result) {

                        completed++;
                        checkAndDone(id, process.domain.name);
                    });
                });
            };

            for (var i = 0; i < 10; ++i) {
                test(i);
            }
        });

        describe('generate', function () {

            it('returns falsey items', function (done) {

                var engine = {
                    start: function (callback) {

                        callback();
                    },
                    isReady: function () {

                        return true;
                    },
                    get: function (key, callback) {

                        callback(null, {
                            stored: false,
                            item: false
                        });
                    },
                    validateSegmentName: function () {

                        return null;
                    }
                };
                var policyConfig = {
                    expiresIn: 50000,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, false);
                    }
                };

                var client = new Catbox.Client(engine);
                var policy = new Catbox.Policy(policyConfig, client, 'test');

                policy.get('test1', function (err, value, cached, report) {

                    expect(err).to.equal(null);
                    expect(value).to.equal(false);
                    done();
                });
            });

            it('bypasses cache when not configured', function (done) {

                var policy = new Catbox.Policy({
                    expiresIn: 1,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, 'new result');
                    }
                });

                policy.get('test', function (err, value, cached, report) {

                    expect(err).to.not.exist();
                    expect(value).to.equal('new result');
                    expect(cached).to.not.exist();
                    done();
                });
            });

            it('returns the processed cached item', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, { gen: ++gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value, cached, report) {

                        expect(value.gen).to.equal(1);
                        done();
                    });
                });
            });

            it('switches rules after construction', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, { gen: ++gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy({ expiresIn: 100 }, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1).to.not.exist();
                        policy.rules(rule);

                        policy.get('test', function (err, value2, cached2, report2) {

                            expect(value2.gen).to.equal(1);
                            expect(policy.stats).to.deep.equal({ sets: 1, gets: 2, hits: 0, stales: 0, generates: 1, errors: 0 });
                            done();
                        });
                    });
                });
            });

            it('returns the processed cached item after cache error', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, { gen: ++gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                client.get = function (key, callback) {

                    callback(new Error('bad client'));
                };
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value, cached, report) {

                        expect(value.gen).to.equal(1);
                        done();
                    });
                });
            });

            it('returns an error when get fails and generateOnReadError is false', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateOnReadError: false,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, { gen: ++gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                client.get = function (key, callback) {

                    callback(new Error('bad client'));
                };

                var policy = new Catbox.Policy(rule, client, 'test-segment');

                client.start(function () {

                    policy.get('test', function (err, value, cached, report) {

                        expect(err.message).to.equal('bad client');
                        expect(value).to.not.exist();
                        done();
                    });
                });
            });

            it('returns the processed cached item using manual ttl', function (done) {

                var rule = {
                    expiresIn: 26,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 20,
                    generateFunc: function (id, next) {

                        setTimeout(function () {

                            return next(null, { gen: ++gen }, 100);
                        }, 6);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);        // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                expect(value2.gen).to.equal(1);        // Stale
                                done();
                            });
                        }, 27);
                    });
                });
            });

            it('returns stale object then fresh object based on timing', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 20,
                    generateFunc: function (id, next) {

                        setTimeout(function () {

                            return next(null, { gen: ++gen }, 100);
                        }, 6);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);        // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                expect(value2.gen).to.equal(1);        // Stale
                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(value3.gen).to.equal(2);        // Fresh
                                        done();
                                    });
                                }, 3);
                            });
                        }, 21);
                    });
                });
            });

            it('returns stale object then fresh object based on timing using staleIn function', function (done) {

                var staleIn = function (stored, ttl) {

                    var expiresIn = (Date.now() - stored) + ttl;
                    expect(expiresIn).to.be.about(100, 5);
                    return expiresIn - 80;
                };

                var rule = {
                    expiresIn: 100,
                    staleIn: staleIn,
                    staleTimeout: 5,
                    generateTimeout: 20,
                    generateFunc: function (id, next) {

                        setTimeout(function () {

                            return next(null, { gen: ++gen }, 100);
                        }, 6);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);        // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                expect(value2.gen).to.equal(1);        // Stale
                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(value3.gen).to.equal(2);        // Fresh
                                        done();
                                    });
                                }, 3);
                            });
                        }, 21);
                    });
                });
            });

            it('returns stale object then invalidate cache on error', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 20,
                    generateFunc: function (id, next) {

                        ++gen;

                        setTimeout(function () {

                            if (gen !== 2) {
                                return next(null, { gen: gen });
                            }

                            return next(new Error());
                        }, 6);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                // Generates a new one in background which will produce Error and clear the cache

                                expect(value2.gen).to.equal(1);     // Stale
                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(value3.gen).to.equal(3);     // Fresh
                                        done();
                                    });
                                }, 3);
                            });
                        }, 21);
                    });
                });
            });

            it('returns stale object then invalidate cache on error when dropOnError is true', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    dropOnError: true,
                    generateTimeout: 20,
                    generateFunc: function (id, next) {

                        ++gen;

                        setTimeout(function () {

                            if (gen === 1) {
                                return next(null, { gen: gen });
                            }

                            return next(new Error());
                        }, 6);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                // Generates a new one in background which will produce Error and clear the cache

                                expect(value2.gen).to.equal(1);     // Stale
                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(err).to.be.instanceof(Error);     // Stale
                                        done();
                                    });
                                }, 3);
                            });
                        }, 21);
                    });
                });
            });

            it('returns stale object then invalidate cache on error when dropOnError is not set', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 20,
                    generateFunc: function (id, next) {

                        ++gen;

                        setTimeout(function () {

                            if (gen === 1) {
                                return next(null, { gen: gen });
                            }

                            return next(new Error());
                        }, 6);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                // Generates a new one in background which will produce Error and clear the cache

                                expect(value2.gen).to.equal(1);     // Stale
                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(err).to.be.instanceof(Error);     // Stale
                                        done();
                                    });
                                }, 3);
                            });
                        }, 21);
                    });
                });
            });

            it('returns stale object then does not invalidate cache on timeout if dropOnError is false', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    dropOnError: false,
                    generateTimeout: 20,
                    generateFunc: function (id, next) {

                        ++gen;

                        setTimeout(function () {

                            if (gen === 1) {
                                return next(null, { gen: gen });
                            }

                            return next(new Error());
                        }, 6);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                // Generates a new one in background which will produce Error, but not clear the cache

                                expect(value2.gen).to.equal(1);     // Stale
                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(value3.gen).to.equal(1);     // Stale
                                        done();
                                    });
                                }, 3);
                            });
                        }, 21);
                    });
                });
            });

            it('returns stale object then does not invalidate cache on error if dropOnError is false', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    dropOnError: false,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        ++gen;

                        if (gen === 1) {
                            return next(null, { gen: gen });
                        }

                        return next(new Error());
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2) {

                                // Generates a new one in background which will produce Error, but not clear the cache

                                expect(value2.gen).to.equal(1);     // Stale

                                policy.get('test', function (err, value3, cached3) {

                                    expect(value3.gen).to.equal(1);     // Stale
                                    done();
                                });
                            });
                        }, 21);
                    });
                });
            });

            it('returns stale object then invalidates cache on error if dropOnError is true', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    dropOnError: true,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        ++gen;

                        if (gen === 1) {
                            return next(null, { gen: gen });
                        }

                        return next(new Error());
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2) {

                                // Generates a new one in background which will produce Error, but not clear the cache
                                expect(err).to.be.instanceOf(Error);
                                expect(value2).to.be.undefined();     // Stale

                                policy.get('test', function (err, value3, cached3) {

                                    expect(err).to.be.instanceOf(Error);
                                    expect(value3).to.be.undefined();      // Stale
                                    done();
                                });
                            });
                        }, 21);
                    });
                });
            });


            it('returns stale object then invalidates cache on error if dropOnError is not defined', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        ++gen;

                        if (gen === 1) {
                            return next(null, { gen: gen });
                        }

                        return next(new Error());
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2) {

                                // Generates a new one in background which will produce Error, but not clear the cache
                                expect(err).to.be.instanceOf(Error);
                                expect(value2).to.be.undefined();     // Stale

                                policy.get('test', function (err, value3, cached3) {

                                    expect(err).to.be.instanceOf(Error);
                                    expect(value3).to.be.undefined();      // Stale
                                    done();
                                });
                            });
                        }, 21);
                    });
                });
            });


            it('returns fresh objects', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 10,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, { gen: ++gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                expect(value2.gen).to.equal(2);     // Fresh

                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(value3.gen).to.equal(2);     // Fresh
                                        done();
                                    });
                                }, 1);
                            });
                        }, 21);
                    });
                });
            });

            it('returns error when generated within stale timeout', function (done) {

                var rule = {
                    expiresIn: 30,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        ++gen;
                        if (gen !== 2) {
                            return next(null, { gen: gen });
                        }

                        return next(new Error());
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                // Generates a new one which will produce Error

                                expect(err).to.be.instanceof(Error);     // Stale
                                done();
                            });
                        }, 21);
                    });
                });
            });

            it('returns new object when stale has less than staleTimeout time left', function (done) {

                var rule = {
                    expiresIn: 31,
                    staleIn: 15,
                    staleTimeout: 15,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, { gen: ++gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);        // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                expect(value2.gen).to.equal(1);        // Fresh
                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(value3.gen).to.equal(2);        // Fresh
                                        expect(policy.stats).to.deep.equal({ sets: 2, gets: 3, hits: 2, stales: 1, generates: 2, errors: 0 });
                                        done();
                                    });
                                }, 11);
                            });
                        }, 10);
                    });
                });
            });

            it('invalidates cache on error without stale', function (done) {

                var rule = {
                    expiresIn: 20,
                    staleIn: 5,
                    staleTimeout: 5,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        ++gen;

                        if (gen === 2) {
                            return next(new Error());
                        }

                        return next(null, { gen: gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(value1.gen).to.equal(1);     // Fresh
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                expect(err).to.exist();

                                policy._get('test', function (err, value3) {

                                    expect(value3).to.equal(null);
                                    done();
                                });
                            });
                        }, 8);
                    });
                });
            });

            it('returns timeout error when generate takes too long', function (done) {

                var rule = {
                    expiresIn: 10,
                    generateTimeout: 5,
                    generateFunc: function (id, next) {

                        setTimeout(function () {

                            return next(null, { gen: ++gen });
                        }, 6);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {

                        expect(err.output.statusCode).to.equal(503);
                        setTimeout(function () {

                            policy.get('test', function (err, value2, cached2, report2) {

                                expect(value2.gen).to.equal(1);
                                setTimeout(function () {

                                    policy.get('test', function (err, value3, cached3, report3) {

                                        expect(err.output.statusCode).to.equal(503);
                                        done();
                                    });
                                }, 10);
                            });
                        }, 2);
                    });
                });
            });

            it('does not block the queue when generate fails to call back', function (done) {

                var rule = {
                    expiresIn: 50000,
                    generateTimeout: 5,
                    generateFunc: function () { }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                client.start(function () {

                    var id = 'test';
                    policy.get(id, function (err, value1, cached1, report1) {

                        expect(err).to.be.an.instanceOf(Error);
                        expect(value1).to.not.exist();

                        policy.get(id, function (err, value2, cached2, report2) {

                            expect(err).to.be.an.instanceOf(Error);
                            expect(value2).to.not.exist();
                            done();
                        });
                    });
                });
            });

            it('blocks the queue when generate fails to call back', function (done) {

                var rule = {
                    expiresIn: 50000,
                    generateTimeout: false,
                    generateFunc: function () { }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                client.start(function () {

                    var id = 'test';
                    var called = 0;
                    policy.get(id, function (err, value1, cached1, report1) {

                        ++called;
                    });

                    policy.get(id, function (err, value1, cached1, report1) {

                        ++called;
                    });

                    setTimeout(function () {

                        expect(called).to.equal(0);
                        done();
                    }, 100);
                });
            });

            it('queues requests while pending', function (done) {

                var gen = 0;
                var rule = {
                    expiresIn: 100,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        return next(null, { gen: ++gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                client.start(function () {

                    var result = null;
                    var compare = function (err, value, cached, report) {

                        if (!result) {
                            result = value;
                            return;
                        }

                        expect(result).to.equal(value);
                        done();
                    };

                    policy.get('test', compare);
                    policy.get('test', compare);
                });
            });

            it('catches errors thrown in generateFunc and passes to all pending requests', function (done) {

                var gen = 0;
                var rule = {
                    expiresIn: 100,
                    generateTimeout: 10,
                    generateFunc: function (id, next) {

                        throw new Error('generate failed');
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                client.start(function () {

                    var result = null;
                    var compare = function (err, value, cached, report) {

                        if (!result) {
                            result = err;
                            return;
                        }

                        expect(result).to.equal(err);
                        expect(err.message).to.equal('generate failed');
                        done();
                    };

                    policy.get('test', compare);
                    policy.get('test', compare);
                });
            });

            it('does not return stale value from previous request timeout left behind', { parallel: false }, function (done) {

                var gen = 0;

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 10,
                    generateTimeout: 20,
                    generateFunc: function (id, next) {

                        setTimeout(function () {

                            next(null, { gen: ++gen });
                        }, 5);
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });

                var orig = client.connection.get;
                client.connection.get = function (key, callback) {      // Delayed get

                    setTimeout(function () {

                        orig.call(client.connection, key, callback);
                    }, 10);
                };

                var policy = new Catbox.Policy(rule, client, 'test-segment');

                client.start(function () {

                    policy.get('test', function (err, value1, cached1, report1) {                   // Cache lookup takes 10 + generate 5

                        expect(value1.gen).to.equal(1);                                             // Fresh
                        setTimeout(function () {                                                    // Wait for stale

                            policy.get('test', function (err, value2, cached2, report2) {           // Cache lookup takes 10, generate comes back after 5

                                expect(value2.gen).to.equal(2);                                     // Fresh
                                policy.get('test', function (err, value3, cached3, report3) {       // Cache lookup takes 10

                                    expect(value3.gen).to.equal(2);                                 // Cached (10 left to stale)

                                    client.connection.get = orig;
                                    done();
                                });
                            });
                        }, 21);
                    });
                });
            });

            it('passes set error when generateIgnoreWriteError is false', function (done) {

                var rule = {
                    expiresIn: 100,
                    staleIn: 20,
                    staleTimeout: 5,
                    generateTimeout: 10,
                    generateIgnoreWriteError: false,
                    generateFunc: function (id, next) {

                        return next(null, { gen: ++gen });
                    }
                };

                var client = new Catbox.Client(Import, { partition: 'test-partition' });
                var policy = new Catbox.Policy(rule, client, 'test-segment');

                var gen = 0;

                policy.set = function (key, value, ttl, callback) {

                    return callback(new Error('bad cache'));
                };

                client.start(function () {

                    policy.get('test', function (err, value, cached, report) {

                        expect(err.message).to.equal('bad cache');
                        expect(value.gen).to.equal(1);
                        done();
                    });
                });
            });
        });
    });

    describe('set()', function () {

        it('returns null on set when no cache client provided', function (done) {

            var policy = new Catbox.Policy({ expiresIn: 1 });

            policy.set('x', 'y', 100, function (err) {

                expect(err).to.not.exist();
                done();
            });
        });

        it('ignores missing callback', function (done) {

            var policy = new Catbox.Policy({ expiresIn: 1 });

            expect(function () {

                policy.set('x', 'y', 100);
            }).to.not.throw();

            done();
        });
    });

    describe('drop()', function () {

        it('returns null on drop when no cache client provided', function (done) {

            var policy = new Catbox.Policy({ expiresIn: 1 });

            policy.drop('x', function (err) {

                expect(err).to.not.exist();
                done();
            });
        });

        it('calls the extension clients drop function', function (done) {

            var called = false;
            var engine = {
                start: function (callback) {

                    callback();
                },
                isReady: function () {

                    return true;
                },
                drop: function (key, callback) {

                    called = true;
                    callback(null);
                },
                validateSegmentName: function () {

                    return null;
                }
            };

            var policyConfig = {
                expiresIn: 50000
            };

            var client = new Catbox.Client(engine);
            var policy = new Catbox.Policy(policyConfig, client, 'test');

            policy.drop('test', function (err) {

                expect(called).to.be.true();
                done();
            });
        });

        it('ignores missing callback', function (done) {

            var policy = new Catbox.Policy({ expiresIn: 1 });

            expect(function () {

                policy.drop('x');
            }).to.not.throw();

            done();
        });

        it('counts drop error', function (done) {

            var engine = {
                start: function (callback) {

                    callback();
                },
                isReady: function () {

                    return true;
                },
                drop: function (key, callback) {

                    callback(new Error('failed'));
                },
                validateSegmentName: function () {

                    return null;
                }
            };

            var policyConfig = {
                expiresIn: 50000
            };

            var client = new Catbox.Client(engine);
            var policy = new Catbox.Policy(policyConfig, client, 'test');

            policy.drop('test', function (err) {

                expect(policy.stats.errors).to.equal(1);
                done();
            });
        });
    });

    describe('ttl()', function () {

        it('returns the ttl factoring in the created time', function (done) {

            var engine = {
                start: function (callback) {

                    callback();
                },
                isReady: function () {

                    return true;
                },
                validateSegmentName: function () {

                    return null;
                }
            };

            var policyConfig = {
                expiresIn: 50000
            };

            var client = new Catbox.Client(engine);
            var policy = new Catbox.Policy(policyConfig, client, 'test');

            var result = policy.ttl(Date.now() - 10000);
            expect(result).to.be.within(39999, 40001);                    // There can occasionally be a 1ms difference
            done();
        });

        it('returns expired when created in the future', function (done) {

            var config = {
                expiresAt: '10:00'
            };

            var rules = new Catbox.Policy.compile(config);

            var created = new Date('Sat Sep 06 2014 13:00:00').getTime();
            var now = new Date('Sat Sep 06 2014 12:00:00').getTime();

            var ttl = Catbox.Policy.ttl(rules, created, now);
            expect(ttl).to.equal(0);
            done();
        });

        it('returns expired on c-e-n same day', function (done) {

            var config = {
                expiresAt: '10:00'
            };

            var rules = new Catbox.Policy.compile(config);

            var created = new Date('Sat Sep 06 2014 9:00:00').getTime();
            var now = new Date('Sat Sep 06 2014 11:00:00').getTime();

            var ttl = Catbox.Policy.ttl(rules, created, now);
            expect(ttl).to.equal(0);
            done();
        });

        it('returns expired on c-(midnight)-e-n', function (done) {

            var config = {
                expiresAt: '10:00'
            };

            var rules = new Catbox.Policy.compile(config);

            var created = new Date('Sat Sep 06 2014 11:00:00').getTime();
            var now = new Date('Sat Sep 07 2014 10:00:01').getTime();

            var ttl = Catbox.Policy.ttl(rules, created, now);
            expect(ttl).to.equal(0);
            done();
        });

        it('returns ttl on c-n-e same day', function (done) {

            var config = {
                expiresAt: '10:00'
            };

            var rules = new Catbox.Policy.compile(config);

            var created = new Date('Sat Sep 06 2014 9:00:00').getTime();
            var now = new Date('Sat Sep 06 2014 9:30:00').getTime();

            var ttl = Catbox.Policy.ttl(rules, created, now);
            expect(ttl).to.equal(30 * 60 * 1000);
            done();
        });

        it('returns ttl on c-(midnight)-n-e', function (done) {

            var config = {
                expiresAt: '10:00'
            };

            var rules = new Catbox.Policy.compile(config);

            var created = new Date('Sat Sep 06 2014 11:00:00').getTime();
            var now = new Date('Sat Sep 07 2014 9:00:00').getTime();

            var ttl = Catbox.Policy.ttl(rules, created, now);
            expect(ttl).to.equal(60 * 60 * 1000);
            done();
        });
    });

    describe('compile()', function () {

        it('does not try to compile a null config', function (done) {

            var rule = Catbox.policy.compile(null);
            expect(rule).to.deep.equal({});
            done();
        });

        it('compiles a single rule', function (done) {

            var config = {
                expiresIn: 50000
            };

            var rule = Catbox.policy.compile(config, false);
            expect(rule.expiresIn).to.equal(config.expiresIn);
            done();
        });

        it('ignores external options', function (done) {

            var config = {
                expiresIn: 50000,
                cache: true
            };

            var rule = Catbox.policy.compile(config, false);
            expect(rule.expiresIn).to.equal(config.expiresIn);
            done();
        });

        it('assigns the expiresIn when the rule is cached', function (done) {

            var config = {
                expiresIn: 50000
            };

            var rule = Catbox.policy.compile(config, false);
            expect(rule.expiresIn).to.equal(config.expiresIn);
            done();
        });

        it('allows a rule with neither expiresAt or expiresIn', function (done) {

            var fn = function () {

                Catbox.policy.compile({ cache: 1 }, true);
            };

            expect(fn).to.not.throw();
            done();
        });

        it('allows a rule with expiresAt and undefined expiresIn', function (done) {

            var fn = function () {

                Catbox.policy.compile({ expiresIn: undefined, expiresAt: '09:00' }, true);
            };

            expect(fn).to.not.throw();
            done();
        });

        it('allows combination of expiresIn, staleTimeout and staleIn function', function (done) {

            var staleIn = function (stored, ttl) {

                return 1000;
            };

            var config = {
                expiresIn: 500000,
                staleIn: staleIn,
                staleTimeout: 500,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };

            expect(fn).to.not.throw();
            done();
        });

        it('throws an error when staleIn is greater than expiresIn', function (done) {

            var config = {
                expiresIn: 500000,
                staleIn: 1000000,
                staleTimeout: 500,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };

            expect(fn).to.throw('staleIn must be less than expiresIn');
            done();
        });

        it('throws an error when staleTimeout is greater than expiresIn', function (done) {

            var config = {
                expiresIn: 500000,
                staleIn: 100000,
                staleTimeout: 500000,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };

            expect(fn).to.throw('staleTimeout must be less than expiresIn');
            done();
        });

        it('throws an error when staleTimeout is greater than expiresIn - staleIn', function (done) {

            var config = {
                expiresIn: 30000,
                staleIn: 20000,
                staleTimeout: 10000,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };

            expect(fn).to.throw('staleTimeout must be less than the delta between expiresIn and staleIn');
            done();
        });

        it('throws an error when staleTimeout is used without server mode', function (done) {

            var config = {
                expiresIn: 1000000,
                staleIn: 500000,
                staleTimeout: 500,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                var policy = new Catbox.Policy(config);
            };

            expect(fn).to.throw('Cannot use stale options without server-side caching');
            done();
        });

        it('returns rule when staleIn is less than expiresIn', function (done) {

            var config = {
                expiresIn: 1000000,
                staleIn: 500000,
                staleTimeout: 500,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var rule = Catbox.policy.compile(config, true);
            expect(rule.staleIn).to.equal(500 * 1000);
            expect(rule.expiresIn).to.equal(1000 * 1000);
            done();
        });

        it('returns rule when staleIn is less than 24 hours and using expiresAt', function (done) {

            var config = {
                expiresAt: '03:00',
                staleIn: 5000000,
                staleTimeout: 500,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var rule = Catbox.policy.compile(config, true);
            expect(rule.staleIn).to.equal(5000 * 1000);
            done();
        });

        it('does not throw an error if has both staleTimeout and staleIn', function (done) {

            var config = {
                staleIn: 30000,
                staleTimeout: 300,
                expiresIn: 60000,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };
            expect(fn).to.not.throw();
            done();
        });

        it('throws an error if trying to use stale caching on the client', function (done) {

            var config = {
                staleIn: 30000,
                expiresIn: 60000,
                staleTimeout: 300,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, false);
            };

            expect(fn).to.throw('Cannot use stale options without server-side caching');
            done();
        });

        it('converts the stale time to ms', function (done) {

            var config = {
                staleIn: 30000,
                expiresIn: 60000,
                staleTimeout: 300,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var rule = Catbox.policy.compile(config, true);

            expect(rule.staleIn).to.equal(config.staleIn);
            done();
        });

        it('throws an error if staleTimeout is greater than expiresIn', function (done) {

            var config = {
                staleIn: 2000,
                expiresIn: 10000,
                staleTimeout: 30000,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };

            expect(fn).to.throw('staleTimeout must be less than expiresIn');
            done();
        });

        it('throws an error if staleIn is greater than expiresIn', function (done) {

            var config = {
                staleIn: 1000000,
                expiresIn: 60000,
                staleTimeout: 30,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, false);
            };

            expect(fn).to.throw('staleIn must be less than expiresIn');
            done();
        });

        it('allows a rule with generateFunc and generateTimeout', function (done) {

            var config = {
                expiresIn: 50000,
                generateTimeout: 10,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };

            expect(fn).to.not.throw();
            done();
        });

        it('throws an error with generateFunc but no generateTimeout', function (done) {

            var config = {
                expiresIn: 50000,
                generateFunc: function () { }
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };

            expect(fn).to.throw(/Invalid cache policy configuration/);
            done();
        });

        it('throws an error with generateTimeout but no generateFunc', function (done) {

            var config = {
                expiresIn: 50000,
                generateTimeout: 10
            };

            var fn = function () {

                Catbox.policy.compile(config, true);
            };

            expect(fn).to.throw(/Invalid cache policy configuration/);
            done();
        });
    });

    describe('Policy.ttl()', function () {

        it('returns zero when a rule is expired', function (done) {

            var config = {
                expiresIn: 50000
            };
            var rule = Catbox.policy.compile(config, false);
            var created = new Date(Date.now());
            created = created.setMinutes(created.getMinutes() - 5);

            var ttl = Catbox.policy.ttl(rule, created);
            expect(ttl).to.be.equal(0);
            done();
        });

        it('returns a positive number when a rule is not expired', function (done) {

            var config = {
                expiresIn: 50000
            };
            var rule = Catbox.policy.compile(config, false);
            var created = new Date(Date.now());

            var ttl = Catbox.policy.ttl(rule, created);
            expect(ttl).to.be.greaterThan(0);
            done();
        });

        it('returns the correct expires time when no created time is provided', function (done) {

            var config = {
                expiresIn: 50000
            };
            var rule = Catbox.policy.compile(config, false);

            var ttl = Catbox.policy.ttl(rule);
            expect(ttl).to.equal(50000);
            done();
        });

        it('returns 0 when created several days ago and expiresAt is used', function (done) {

            var config = {
                expiresAt: '13:00'
            };
            var created = Date.now() - 313200000;                                       // 87 hours (3 days + 15 hours)
            var rule = Catbox.policy.compile(config, false);

            var ttl = Catbox.policy.ttl(rule, created);
            expect(ttl).to.equal(0);
            done();
        });

        it('returns 0 when created in the future', function (done) {

            var config = {
                expiresIn: 100
            };
            var created = Date.now() + 1000;
            var rule = Catbox.policy.compile(config, false);

            var ttl = Catbox.policy.ttl(rule, created);
            expect(ttl).to.equal(0);
            done();
        });

        it('returns 0 for bad rule', function (done) {

            var created = Date.now() - 1000;
            var ttl = Catbox.policy.ttl({}, created);
            expect(ttl).to.equal(0);
            done();
        });

        it('returns 0 when created 60 hours ago and expiresAt is used with an hour before the created hour', function (done) {

            var config = {
                expiresAt: '12:00'
            };
            var created = Date.now() - 342000000;                                       // 95 hours ago (3 days + 23 hours)
            var rule = Catbox.policy.compile(config, false);

            var ttl = Catbox.policy.ttl(rule, created);
            expect(ttl).to.equal(0);
            done();
        });

        it('returns a positive number when using a future expiresAt', function (done) {

            var hour = new Date(Date.now() + 60 * 60 * 1000).getHours();
            hour = hour === 0 ? 1 : hour;

            var config = {
                expiresAt: hour + ':00'
            };

            var rule = Catbox.policy.compile(config, false);

            var ttl = Catbox.policy.ttl(rule);
            expect(ttl).to.be.greaterThan(0);
            done();
        });

        it('returns the correct number when using a future expiresAt', function (done) {

            var twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
            var hours = twoHoursAgo.getHours();
            var minutes = '' + twoHoursAgo.getMinutes();
            var created = twoHoursAgo.getTime() + (60 * 60 * 1000);
            minutes = minutes.length === 1 ? '0' + minutes : minutes;

            var config = {
                expiresAt: hours + ':' + minutes
            };

            var rule = Catbox.policy.compile(config, false);
            var ttl = Catbox.policy.ttl(rule, created);

            expect(ttl).to.be.about(22 * 60 * 60 * 1000, 60 * 1000);
            done();
        });

        it('returns correct number when using an expiresAt time tomorrow', function (done) {

            var hour = new Date(Date.now() - 60 * 60 * 1000).getHours();

            var config = {
                expiresAt: hour + ':00'
            };

            var rule = Catbox.policy.compile(config, false);

            var ttl = Catbox.policy.ttl(rule);
            expect(ttl).to.be.about(23 * 60 * 60 * 1000, 60 * 60 * 1000);
            done();
        });

        it('returns correct number when using a created time from yesterday and expires in 2 hours', function (done) {

            var hour = new Date(Date.now() + 2 * 60 * 60 * 1000).getHours();

            var config = {
                expiresAt: hour + ':00'
            };
            var created = new Date(Date.now());
            created.setHours(new Date(Date.now()).getHours() - 22);

            var rule = Catbox.policy.compile(config, false);

            var ttl = Catbox.policy.ttl(rule, created);
            expect(ttl).to.be.about(60 * 60 * 1000, 60 * 60 * 1000);
            done();
        });
    });

    describe('isReady()', function () {

        it('returns cache engine readiness', function (done) {

            var expected = true;
            var engine = {
                start: function (callback) {

                    callback();
                },
                isReady: function () {

                    return expected;
                },
                get: function (key, callback) {

                    callback(new Error());
                },
                validateSegmentName: function () {

                    return null;
                }
            };
            var client = new Catbox.Client(engine);
            var policy = new Catbox.Policy({}, client, 'test');


            client.start(function () {

                expect(policy.isReady()).to.equal(expected);
                done();
            });
        });

        it('returns false when no cache client provided', function (done) {

            var policy = new Catbox.Policy({ expiresIn: 1 });

            expect(policy.isReady()).to.equal(false);
            done();
        });
    });
});
