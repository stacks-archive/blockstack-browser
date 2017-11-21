/* global describe, it, beforeEach*/
'use strict'

describe('example app', function () {
  this.timeout(60000)

  beforeEach(function () {
    return this.browser
      .get('http://localhost:1338')
  })

  it('Heading is "CORS Proxy test"', function () {
    return this.browser
      .elementByCssSelector('h1').text()
        .should.eventually.equal('CORS Proxy test')
  })

  it('Example 1 result is Error', function () {
    return this.browser
      .waitForConditionInBrowser('!! document.querySelector("#example-1 .result").textContent', 10000)
      .elementByCssSelector('#example-1 .result').text()
        .should.eventually.equal('Error')
  })

  it('Example 2 result is Error', function () {
    return this.browser
      .waitForConditionInBrowser('!! document.querySelector("#example-2 .result").textContent', 10000)
      .elementByCssSelector('#example-2 .result').text()
        .should.eventually.equal('Success')
  })
})
