import {
  IdentityActions, IdentityReducer
} from '../../../../app/js/profiles/store/identity'

const initialState = {
  default: 0,
  current: 0,
  localIdentities: [],
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

  it('should update the current identity to the provided index', () => {
    const profile = {
      key: 'value'
    }
    const verifications = {
      verified: true
    }
    const index = 2
    const action = IdentityActions.updateCurrentIdentity(index)
    const expectedState = {
      default: 0,
      current: 2,
      localIdentities: [],
      nameTransfers: [],
      namesOwned: [],
      createProfileError: null,
      zoneFileUpdates: []
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should create a new identity that is unregistered & unverified', () => {
    const index = 0
    const action = IdentityActions.createNewIdentity(index, '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC')
    const expectedState = {
      default: 0,
      current: 0,
      localIdentities: [
          {
            ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC',
            profile: {
              '@context': 'http://schema.org',
              '@type': 'Person'
            },
            registered: false,
            username: null,
            usernameOwned: false,
            usernamePending: false,
            verifications: [],
            zoneFile: null
          }
        ],
      nameTransfers: [],
      namesOwned: [],
      createProfileError: null,
      zoneFileUpdates: []
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should set the default identity', () => {
    const index = 8
    const action = IdentityActions.setDefaultIdentity(index)
    const expectedState = {
      default: 8,
      current: 0,
      localIdentities: [],
      nameTransfers: [],
      namesOwned: [],
      createProfileError: null,
      zoneFileUpdates: []
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should update the profile of the specified name', () => {
    const profile = {
      key: 'value'
    }
    const action = IdentityActions.updateProfile('satoshi.id', profile, [], 'test')
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
          verifications: [],
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
    const action = IdentityActions.updateProfile('satoshi.id', profile, [], zoneFile)
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
          verifications: [],
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
