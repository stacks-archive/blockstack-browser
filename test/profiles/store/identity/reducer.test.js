import {
  IdentityActions, IdentityReducer
} from '../../../../app/js/profiles/store/identity'

const initialState = {
  default: 0,
  localIdentities: [],
  nameTransfers: [],
  publicIdentities: {},
  createProfileError: null,
  zoneFileUpdates: [],
  isProcessing: false
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

  it('should create a new identity that is unregistered & unverified', () => {
    const index = 0
    const action = IdentityActions.createNewIdentity(index, '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC')
    const expectedState = {
      default: 0,
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
          trustLevel: 0,
          zoneFile: null
        }
      ],
      nameTransfers: [],
      publicIdentities: {},
      createProfileError: null,
      zoneFileUpdates: [],
      isProcessing: false
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should set the default identity', () => {
    const index = 8
    const action = IdentityActions.setDefaultIdentity(index)
    const expectedState = {
      default: 8,
      localIdentities: [],
      nameTransfers: [],
      publicIdentities: {},
      createProfileError: null,
      zoneFileUpdates: [],
      isProcessing: false
    }
    const actualState = IdentityReducer(undefined, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should update the profile of the specified index', () => {
    const profile = {
      key: 'value'
    }
    const testInitialState = {
      default: 0,
      localIdentities: [{
        username: null,
        usernameOwned: false,
        usernamePending: false,
        profile: {},
        registered: false,
        ownerAddress: '123',
        zoneFile: null
      }],
      nameTransfers: [],
      publicIdentities: {},
      zoneFileUpdates: [],
      createProfileError: null,
      isProcessing: false
    }
    const action = IdentityActions.updateProfile(0, profile, 'test')
    const expectedState = {
      default: 0,
      localIdentities: [{
        username: null,
        usernameOwned: false,
        usernamePending: false,
        profile: {
          key: 'value'
        },
        registered: false,
        ownerAddress: '123',
        zoneFile: 'test'
      }],
      nameTransfers: [],
      publicIdentities: {},
      zoneFileUpdates: [],
      createProfileError: null,
      isProcessing: false
    }
    const actualState = IdentityReducer(testInitialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should move the identity from owner address key to domain key', () => {
    const initialState = {
      default: 0,
      localIdentities: [{
        username: null,
        usernameOwned: false,
        usernamePending: false,
        profile: {
          key: 'value'
        },
        registered: false,
        ownerAddress: '123',
        zoneFile: 'test'
      }],
      nameTransfers: [],
      publicIdentities: {},
      zoneFileUpdates: [],
      createProfileError: null,
      isProcessing: false
    }

    const expectedState = {
      default: 0,
      localIdentities: [{
        username: 'name.id',
        usernameOwned: false,
        usernamePending: true,
        profile: {
          key: 'value'
        },
        registered: false,
        ownerAddress: '123',
        zoneFile: 'test'
      }],
      nameTransfers: [],
      publicIdentities: {},
      zoneFileUpdates: [],
      createProfileError: null,
      isProcessing: false
    }
    const action = IdentityActions.addUsername(0, 'name.id')

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should create a create new profile error', () => {
    const error = 'error'
    const expectedState = {
      default: 0,
      localIdentities: [],
      nameTransfers: [],
      publicIdentities: {},
      createProfileError: 'error',
      zoneFileUpdates: [],
      isProcessing: false
    }
    const action = IdentityActions.createNewProfileError(error)

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })
})
