import {
  IdentityActions, IdentityReducer
} from '../../../../app/js/profiles/store/identity'

const initialState = {
  current: {
    domainName: null,
    profile: null,
    verifications: null
  },
  localIdentities: {},
  lastNameLookup: []
}

describe('Identity Store: IdentityReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(
      IdentityReducer(undefined, {}),
      initialState)
  })
})
