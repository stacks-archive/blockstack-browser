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
    const testInitialState = {
      default: 0,
      current: 0,
      localIdentities: [{
        username: null,
        usernameOwned: false,
        usernamePending: false,
        profile: {},
        verifications: [],
        registered: false,
        ownerAddress: '123',
        zoneFile: null
      }],
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
      createProfileError: null
    }
    const action = IdentityActions.updateProfile(0, profile, ['a'], 'test')
    const expectedState = {
      default: 0,
      current: 0,
      localIdentities: [{
        username: null,
        usernameOwned: false,
        usernamePending: false,
        profile: {
          key: 'value'
        },
        verifications: ['a'],
        registered: false,
        ownerAddress: '123',
        zoneFile: 'test'
      }],
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
      createProfileError: null
    }
    const actualState = IdentityReducer(testInitialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should move the identity from owner address key to domain key', () => {
    const initialState = {
      default: 0,
      current: 0,
      localIdentities: [{
        username: null,
        usernameOwned: false,
        usernamePending: false,
        profile: {
          key: 'value'
        },
        verifications: ['a'],
        registered: false,
        ownerAddress: '123',
        zoneFile: 'test'
      }],
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
      createProfileError: null
    }

    const expectedState = {
      default: 0,
      current: 0,
      localIdentities: [{
        username: 'name.id',
        usernameOwned: false,
        usernamePending: true,
        profile: {
          key: 'value'
        },
        verifications: ['a'],
        registered: false,
        ownerAddress: '123',
        zoneFile: 'test'
      }],
      nameTransfers: [],
      namesOwned: [],
      zoneFileUpdates: [],
      createProfileError: null
    }
    const action = IdentityActions.addUsername(0, 'name.id')

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })

  it('should create a create new profile error', () => {
    const error = 'error'
    const expectedState = {
      default: 0,
      current: 0,
      localIdentities: [],
      nameTransfers: [],
      namesOwned: [],
      createProfileError: 'error',
      zoneFileUpdates: []
    }
    const action = IdentityActions.createNewProfileError(error)

    const actualState = IdentityReducer(initialState, action)
    assert.deepEqual(actualState, expectedState)
  })
})
