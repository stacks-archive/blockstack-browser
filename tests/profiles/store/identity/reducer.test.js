import {
  IdentityActions, IdentityReducer
} from '../../../../app/js/profiles/store/identity'

const initialState = {
  default: null,
  current: {
    domainName: null,
    profile: null,
    verifications: null
  },
  localIdentities: {},
  namesOwned: [],
  createProfileError: null
}

const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}

describe('Identity Store: IdentityReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(
      IdentityReducer(undefined, {}),
      initialState)
  })

  it('should update the current identity with the proper values', () => {
    const profile = {
      key: 'value'
    }
    const verifications = {
      verified: true
    }
    const action = IdentityActions.updateCurrentIdentity('satoshi.id', profile, verifications)
    const expectedState = {
      default: null,
      current: {
        domainName: 'satoshi.id',
        profile: { key: 'value' },
        verifications: { verified: true }
      },
      localIdentities: {},
      namesOwned: [],
      createProfileError: null
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should create a new identity that is unregistered & unverified', () => {
    const action = IdentityActions.createNewIdentity('satoshi.id', '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC')
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null
      },
      localIdentities: {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: false,
          ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC'
        }
      },
      namesOwned: [],
      createProfileError: null
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should set the default identity', () => {
    const action = IdentityActions.setDefaultIdentity('satoshi.id')
    const expectedState = {
      default: 'satoshi.id',
      current: {
        domainName: null,
        profile: null,
        verifications: null
      },
      localIdentities: {},
      namesOwned: [],
      createProfileError: null
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should update the collection of local identites and list of names owned', () => {
    const namesOwned = ['satoshi.id']
    const localIdentities = {
      'satoshi.id': {
        domainName: 'satoshi.id',
        profile: DEFAULT_PROFILE,
        verifications: [],
        registered: false
      }
    }
    const action = IdentityActions.updateOwnedIdentities(localIdentities, namesOwned)
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null
      },
      localIdentities: {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: false
        }
      },
      namesOwned: ['satoshi.id'],
      createProfileError: null
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should update the profile of the specified name', () => {
    const profile = {
      key: 'value'
    }
    const action = IdentityActions.updateProfile('satoshi.id', profile)
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null
      },
      localIdentities: {
        'satoshi.id': {
          profile: {
            key: 'value'
          }
        }
      },
      namesOwned: [],
      createProfileError: null
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should update the profile of the specified name', () => {
    const profile = {
      key: 'value'
    }
    const action = IdentityActions.updateProfile('satoshi.id', profile)
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null
      },
      localIdentities: {
        'satoshi.id': {
          profile: {
            key: 'value'
          }
        }
      },
      namesOwned: [],
      createProfileError: null
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should move the identity from owner address key to domain key', () => {
    const initialState = {
      localIdentities: {
        '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC': {
          profile: {
            key: 'value'
          },
          ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC'
        }
      },
      createProfileError: null
    }

    const expectedState = {
      localIdentities: {
        'satoshi.id': {
          profile: {
            key: 'value'
          },
          ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC',
          domainName: 'satoshi.id'
        }
      },
      createProfileError: null
    }
    const action = IdentityActions.addUsername('satoshi.id', '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC')

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should create a create new profile error', () => {
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null
      },
      localIdentities: {},
      namesOwned: [],
      createProfileError: 'error'
    }
    const action = IdentityActions.createNewProfileError('error')

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })
})
