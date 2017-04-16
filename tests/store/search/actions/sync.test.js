import { SearchActions } from '../../../../app/js/store/search'

describe('Search Store: Sync Actions', () => {
  describe('updateQuery', () => {
    it('should return an action of type UPDATE_QUERY', () => {
      const expectedResult = {
        type: 'UPDATE_QUERY',
        query: 'blockstack'
      }
      const actualResult = SearchActions.updateQuery('blockstack')
      assert.deepEqual(actualResult, expectedResult)
    })
  })

  describe('updateResults', () => {
    it('should return an action of type UPDATE_RESULTS', () => {
      const expectedResult = {
        type: 'UPDATE_RESULTS',
        query: 'blockstack',
        results: ['aaron', 'guy', 'jude', 'larry', 'patrick', 'ryan', 'muneeb']
      }
      const actualResult = SearchActions.updateResults('blockstack',
      ['aaron', 'guy', 'jude', 'larry', 'patrick', 'ryan', 'muneeb'])
      assert.deepEqual(actualResult, expectedResult)
    })
  })
})
