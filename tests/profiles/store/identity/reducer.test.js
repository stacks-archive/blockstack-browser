import {
  IdentityActions, IdentityReducer
} from '../../../../app/js/profiles/store/identity'

const initialState = {
  default: null,
  current: {
    domainName: null,
    profile: null,
    verifications: null,
    zoneFile: null
  },
  localIdentities: {},
  nameTransfers: [],
  namesOwned: [],
  createProfileError: null,
  zoneFileUpdates: []
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
    const action = IdentityActions.updateCurrentIdentity('satoshi.id',
    profile, verifications, 'test')
    const expectedState = {
      default: null,
      current: {
        domainName: 'satoshi.id',
        profile: { key: 'value' },
        verifications: { verified: true },
        zoneFile: 'test'
      },
      localIdentities: {},
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
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
        verifications: null,
        zoneFile: null
      },
      localIdentities: {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: false,
          ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC',
          zoneFile: null
        }
      },
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
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
        verifications: null,
        zoneFile: null
      },
      localIdentities: {},
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
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
        registered: false,
        zoneFile: 'test'
      }
    }
    const action = IdentityActions.updateOwnedIdentities(localIdentities, namesOwned)
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null,
        zoneFile: null
      },
      localIdentities: {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: false,
          zoneFile: 'test'
        }
      },
      nameTransfers: [],
      namesOwned: ['satoshi.id'],
      zoneFileUpdates: [],
      createProfileError: null
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should update the profile of the specified name', () => {
    const profile = {
      key: 'value'
    }
    const action = IdentityActions.updateProfile('satoshi.id', profile, 'test')
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null,
        zoneFile: null
      },
      localIdentities: {
        'satoshi.id': {
          profile: {
            key: 'value'
          },
          verifications: undefined,
          zoneFile: 'test'
        }
      },
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
      createProfileError: null
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should update the profile of the specified name', () => {
    const profile = {
      key: 'value'
    }
    const zoneFile = 'test'
    const action = IdentityActions.updateProfile('satoshi.id', profile, zoneFile)
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null,
        zoneFile: null
      },
      localIdentities: {
        'satoshi.id': {
          profile: {
            key: 'value'
          },
          verifications: undefined,
          zoneFile: 'test'
        }
      },
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
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
          domainName: 'satoshi.id',
          zoneFile: 'test'
        }
      },
      createProfileError: null
    }
    const action = IdentityActions.addUsername('satoshi.id', '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC', 'test')

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should move the identity from owner address key to domain key, merging existing domain key state', () => {
    const initialState = {
      localIdentities: {
        '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC': {
          profile: {
            key: 'value'
          },
          ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC'
        },
        'satoshi.id': {
          profile: {
            key2: 'value2'
          },
          testState: 'somestate'
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
          domainName: 'satoshi.id',
          zoneFile: 'test',
          testState: 'somestate'
        }
      },
      createProfileError: null
    }
    const action = IdentityActions.addUsername('satoshi.id', '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC', 'test')

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should create a create new profile error', () => {
    const error = new String('error')
    const expectedState = {
      default: null,
      current: {
        domainName: null,
        profile: null,
        verifications: null,
        zoneFile: null
      },
      localIdentities: {},
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
      createProfileError: error
    }
    const action = IdentityActions.createNewProfileError(error)

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })
})
