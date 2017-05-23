import ProfilesReducer from '../../../app/js/profiles/store/reducers.js'

describe('Profiles Store: ProfilesReducer', () => {
  it('should return the correct composed reducers', () => {
    const actualResult = ProfilesReducer(undefined, {})
    assert(actualResult.hasOwnProperty('availability'), 'Missing availability state.')
    assert(actualResult.hasOwnProperty('identity'), 'Missing identity state.')
    assert(actualResult.hasOwnProperty('pgp'), 'Missing pgp state.')
    assert(actualResult.hasOwnProperty('registration'), 'Missing registration state.')
    assert(actualResult.hasOwnProperty('search'), 'Missing search state.')
  })
})
