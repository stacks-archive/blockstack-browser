import { IdentityActions } from '../../../../../app/js/profiles/store/identity'

const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}

describe('Identity Store: Sync Actions', () => {
  describe('updateCurrentIdentity', () => {
    it('should return an action of type UPDATE_CURRENT', () => {
      const profile = {
        key: 'value'
      }
      const verifications = [{
        something: true
      }]
      const expectedResult = {
        type: 'UPDATE_CURRENT',
        domainName: 'satoshi.id',
        profile: {
          key: 'value'
        },
        verifications: [{
          something: true
        }],
        zoneFile: 'test'
      }
      const actualResult = IdentityActions.updateCurrentIdentity('satoshi.id',
      profile, verifications, 'test')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('createNewIdentity', () => {
    it('should return an action of type CREATE_NEW', () => {
      const expectedResult = {
        type: 'CREATE_NEW',
        domainName: 'satoshi.id',
        ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC'
      }
      const actualResult = IdentityActions.createNewIdentity('satoshi.id', '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('updateOwnedIdentities', () => {
    it('should return an action of type UPDATE_IDENTITIES', () => {
      const namesOwned = ['satoshi.id']
      const localIdentities = {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: false
        }
      }
      const expectedResult = {
        type: 'UPDATE_IDENTITIES',
        localIdentities: {
          'satoshi.id': {
            domainName: 'satoshi.id',
            profile: DEFAULT_PROFILE,
            verifications: [],
            registered: false
          }
        },
        namesOwned: ['satoshi.id']
      }
      const actualResult = IdentityActions.updateOwnedIdentities(localIdentities, namesOwned)
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('updateProfile', () => {
    it('should return an action of type UPDATE_PROFILE', () => {
      const profile = {
        key: 'value'
      }
      const expectedResult = {
        type: 'UPDATE_PROFILE',
        domainName: 'satoshi.id',
        profile: {
          key: 'value'
        },
        zoneFile: 'test',
        verifications: []
      }
      const actualResult = IdentityActions.updateProfile('satoshi.id', profile, 'test', [])
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('calculateLocalIdentities', () => {
    it('should add newly owned name with default profile to localIdentities collection', () => {
      const localIdentities = {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: true
        }
      }
      const namesOwned = ['muneeb.id', 'satoshi.id']
      const expectedResult = {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: true
        },
        'muneeb.id': {
          domainName: 'muneeb.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: true
        }
      }
      const actualResult = IdentityActions.calculateLocalIdentities(localIdentities, namesOwned)
      assert.deepEqual(actualResult, expectedResult)
    })

    it('should add mark owned names with existing profiles as registered', () => {
      const localIdentities = {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: { key: 'value' },
          verifications: [],
          registered: false
        },
        'muneeb.id': {
          domainName: 'muneeb.id',
          profile: { key: 'value' },
          verifications: [],
          registered: false
        },
        'blockstack.id': {
          domainName: 'blockstack.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: false
        }
      }
      const namesOwned = ['muneeb.id', 'ryan.id', 'satoshi.id']
      const expectedResult = {
        'satoshi.id': {
          domainName: 'satoshi.id',
          profile: { key: 'value' },
          verifications: [],
          registered: true
        },
        'muneeb.id': {
          domainName: 'muneeb.id',
          profile: { key: 'value' },
          verifications: [],
          registered: true
        },
        'ryan.id': {
          domainName: 'ryan.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: true
        },
        'blockstack.id': {
          domainName: 'blockstack.id',
          profile: DEFAULT_PROFILE,
          verifications: [],
          registered: false
        }
      }
      const actualResult = IdentityActions.calculateLocalIdentities(localIdentities, namesOwned)
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('addUsername', () => {
    it('should return an action of type ADD_USERNAME', () => {
      const expectedResult = {
        type: 'ADD_USERNAME',
        domainName: 'satoshi.id',
        ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC',
        zoneFile: 'test'
      }
      const actualResult = IdentityActions.addUsername('satoshi.id',
      '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC', 'test')
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
