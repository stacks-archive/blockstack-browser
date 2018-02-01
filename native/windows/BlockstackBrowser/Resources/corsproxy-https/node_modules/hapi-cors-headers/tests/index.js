var test = require('tape')
var corsHeaders = require('../index')

test('request.headers.origin is undefined', function (t) {
  var request = {
    headers: {}
  }
  var continueCalled = false
  var reply = {
    continue: function () {
      continueCalled = true
    }
  }
  corsHeaders(request, reply)
  t.deepEqual(Object.keys(request.headers), [], 'sets no headers')
  t.equal(continueCalled, true, 'reply.continue called')
  t.end()
})

test('request is boom error', function (t) {
  var request = {
    headers: {
      origin: 'example.com'
    },
    response: {
      isBoom: true,
      output: {
        headers: {},
        statusCode: 500
      }
    }
  }
  var continueCalled = false
  var reply = {
    continue: function () {
      continueCalled = true
    }
  }
  corsHeaders(request, reply)
  t.equal(request.response.output.headers['access-control-allow-origin'], 'example.com', 'sets access-control-allow-origin')
  t.equal(request.response.output.headers['access-control-allow-credentials'], 'true', 'sets access-control-allow-credentials')
  t.equal(request.response.output.statusCode, 500, 'passes statusCode')
  t.equal(continueCalled, true, 'reply.continue called')
  t.end()
})

test('options request without acces-control-request headers', function (t) {
  var request = {
    method: 'options',
    headers: {
      origin: 'example.com'
    },
    response: {
      headers: {},
      statusCode: 500
    }
  }
  var continueCalled = false
  var reply = {
    continue: function () {
      continueCalled = true
    }
  }
  corsHeaders(request, reply)
  t.equal(request.response.headers['access-control-allow-origin'], 'example.com', 'sets access-control-allow-origin')
  t.equal(request.response.headers['access-control-allow-credentials'], 'true', 'sets access-control-allow-credentials')
  t.equal('access-control-allow-headers' in request.response.headers, false, 'does not set access-control-allow-headers')
  t.equal('access-control-allow-methods' in request.response.headers, false, 'does not set access-control-allow-methods')
  t.equal(request.response.statusCode, 200, 'sets statusCode to 200')
  t.equal(continueCalled, true, 'reply.continue called')
  t.end()
})
test('options request', function (t) {
  var request = {
    method: 'options',
    headers: {
      origin: 'example.com',
      'access-control-request-headers': 'x-header',
      'access-control-request-method': 'GET'
    },
    response: {
      headers: {},
      statusCode: 500
    }
  }
  var continueCalled = false
  var reply = {
    continue: function () {
      continueCalled = true
    }
  }
  corsHeaders(request, reply)
  t.equal(request.response.headers['access-control-allow-origin'], 'example.com', 'sets access-control-allow-origin')
  t.equal(request.response.headers['access-control-allow-credentials'], 'true', 'sets access-control-allow-credentials')
  t.equal(request.response.headers['access-control-allow-headers'], 'x-header', 'sets access-control-allow-headers')
  t.equal(request.response.headers['access-control-allow-methods'], 'GET', 'sets access-control-allow-methods')
  t.equal(request.response.statusCode, 200, 'sets statusCode to 200')
  t.equal(continueCalled, true, 'reply.continue called')
  t.end()
})
