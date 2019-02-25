import React from 'react'
require('regenerator-runtime/runtime')
import { AuthPage } from '../../app/js/auth'

const setup = () => {
  const props = {
    defaultIdentities: [],
    localIdentities: [],
    verifyAuthRequestAndLoadManifest: jest.fn(),
    clearSessionToken: jest.fn(),
    coreSessionTokens: {},
    loginToApp: jest.fn(),
    api: {},
    identityKeypairs: [],
    appManifest: {},
    appManifestLoading: false,
    appManifestLoadingError: '',
    email: '',
    noCoreSessionToken: jest.fn(),
    addresses: [],
    refreshIdentities: jest.fn()
  }
}

test('makes a component', async () => {
  const authPage = <AuthPage />
  console.log(authPage.props)
})
