import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { SearchActions } from '../../../../../app/js/profiles/store/search'
import searchResults from '../../../../fixtures/search'
import { UPDATE_RESULTS } from '../../../../../app/js/profiles/store/search/types'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('Search Store: Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('searchIdentities', () => {
    it('returns search results ', () => {
      nock('https://search.blockstack.org')
        .get('/search?query=muneeb')
        .reply(
          200,
          { results: [searchResults.muneeb] },
          { 'Content-Type': 'application/json' }
        )

      const store = mockStore({
        query: '',
        results: []
      })

      const lookupUrl = null // shouldn't be used in this search
      const searchUrl = 'https://search.blockstack.org/search?query={query}'
      return store
        .dispatch(
          SearchActions.searchIdentities('muneeb', searchUrl, lookupUrl)
        )
        .then(() => {
          const expectedActions = [
            {
              type: UPDATE_RESULTS,
              query: 'muneeb',
              results: [searchResults.muneeb]
            }
          ]
          assert.deepEqual(store.getActions(), expectedActions)
        })
    })
  })
})
