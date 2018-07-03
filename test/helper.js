beforeEach(() => {
  global.sandbox = sinon.sandbox.create()
})

afterEach(() => {
  global.sandbox.restore()
})
