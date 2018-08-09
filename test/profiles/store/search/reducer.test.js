import { SearchActions, SearchReducer } from '../../../../app/js/profiles/store/search'

const initialState = {
  query: '',
  results: []
}

describe('Search Store: SearchReducer', () => {
  it('should return the proper initial state', () => {
    assert.deepEqual(
      SearchReducer(undefined, {}),
      initialState)
  })

  it('should update results', () => {
    const state = {
      query: 'hello',
      results: []
    }

    const action = SearchActions.updateResults('bye', ['a', 'b'])
    assert.deepEqual(
      SearchReducer(state, action),
      {
        query: 'bye',
        results: ['a', 'b']
      })
  })
})

it('should update query', () => {
  const state = {
    query: 'hello',
    results: []
  }

  const action = SearchActions.updateQuery('bye')
  assert.deepEqual(
    SearchReducer(state, action),
    {
      query: 'bye',
      results: []
    })
})
