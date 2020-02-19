import './global-setup'
import { GlobalWithFetchMock } from 'jest-fetch-mock'
import { config as bskConfig  } from 'blockstack'

bskConfig.logLevel = 'none'

const customGlobal: GlobalWithFetchMock = global as GlobalWithFetchMock
customGlobal.fetch = require('jest-fetch-mock')
customGlobal.fetchMock = customGlobal.fetch

beforeEach(() => {
  fetchMock.mockClear()
})
