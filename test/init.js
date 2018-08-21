import {jsdom} from 'jsdom'

// Ensure that all window/DOM related properties
// are available to all tests
global.document = jsdom('<!DOCTYPE html><html><body></body></html>', {
  url: 'http://localhost'
})
global.window = document.defaultView
global.navigator = window.navigator
global.KeyboardEvent = window.KeyboardEvent

// Ensure that 'sinon' and 'chai' library methods will be
// available to all tests
global.sinon = require('sinon')
global.enzyme = require('enzyme')
global.assert = require('chai').assert
require('sinon-as-promised')

const EnzymeAdapter = require('enzyme-adapter-react-16')
global.enzyme.configure({ adapter: new EnzymeAdapter() })
