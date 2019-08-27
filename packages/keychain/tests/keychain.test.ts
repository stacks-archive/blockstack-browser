import demo from '../lib'

test('first test', async () => {
  const result = demo()
  expect(result).toEqual('hello, world')
})
