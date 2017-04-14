import { SearchReducer } from '../../../app/js/store/search'

describe('SearchReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(
      SearchReducer(undefined, {}),
      {
        query: '',
        results: []
      })
  })
})
