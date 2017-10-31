import { IdentityActions } from '../../../../../app/js/profiles/store/identity'

const DEFAULT_PROFILE = {
  '@type': 'Person',
  '@context': 'http://schema.org'
}

describe('Identity Store: Sync Actions', () => {

  describe('createNewIdentity', () => {
    it('should return an action of type CREATE_NEW', () => {
      const expectedResult = {
        type: 'CREATE_NEW',
        index: 0,
        ownerAddress: '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC'
      }
      const actualResult = IdentityActions.createNewIdentity(0, '17jxDTPDx51CTga1Sw3ezGQKYcJysPNeQC')
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
        index: 0,
        profile: {
          key: 'value'
        },
        zoneFile: 'test zone file',
      }
      const actualResult = IdentityActions.updateProfile(0, profile, 'test zone file')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('addUsername', () => {
    it('should return an action of type ADD_USERNAME', () => {
      const expectedResult = {
        type: 'ADD_USERNAME',
        index: 0,
        username: 'satoshi.id'
      }
      const actualResult = IdentityActions.addUsername(0, 'satoshi.id')
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
