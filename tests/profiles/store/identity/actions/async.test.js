import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { IdentityActions } from '../../../../../app/js/profiles/store/identity'
import DEFAULT_API from '../../../../../app/js/account/store/settings/default'
import { NameLookups, TokenFileLookups } from '../../../../fixtures/profiles'



const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

const initialState = {
  current: {
    domainName: null,
    profile: null,
    verifications: null
  },
  localIdentities: {},
  namesOwned: []
}

describe('Availability Store: Async Actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  describe('refreshIdentities', () => {
    it('adds new identities', () => {
      // mock core
      nock('http://localhost:6270')
      .get('/v1/addresses/18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6')
      .reply(200, { names: ['guylepage.id'] },
      { 'Content-Type': 'application/json' })

      nock('http://localhost:6270')
      .get('/v1/names/guylepage.id')
      .reply(200, NameLookups['guylepage.id'],
      { 'Content-Type': 'application/json' })

      nock('https://blockstack.s3.amazonaws.com')
      .get('/guylepage.id')
      .reply(200, TokenFileLookups['guylepage.id'],
      { 'Content-Type': 'application/json' })



      const store = mockStore(initialState)

      const mockAPI = Object.assign({}, DEFAULT_API, {

      })

      const addresses = ['18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6']
      const localIdentities = {}
      const namesOwned = []

      return store.dispatch(IdentityActions.refreshIdentities(mockAPI,
        addresses, localIdentities, namesOwned))
      .then(() => {
        const expectedActions = [
        {
          "localIdentities": {
            "guylepage.id": {
              "domainName": "guylepage.id",
              "profile": {
                "@context": "http://schema.org",
                "@type": "Person"
              },
              "registered": true,
              "verifications": [],
            }
          },
          "namesOwned": [
            "guylepage.id"
          ],
          "type": "UPDATE_IDENTITIES",
        },
        {
          "domainName": "guylepage.id",
          "profile": {
            "@type": "Person",
            "account": [
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "proofUrl": "https://twitter.com/guylepage3/status/750437834532777984",
                "service": "twitter"
              },
              {
                "@type": "Account",
                "identifier": "g3lepage",
                "proofType": "http",
                "proofUrl": "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760",
                "service": "facebook"
              },
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "proofUrl": "https://gist.github.com/guylepage3/48777a21a70d322b0fa4c1fcc53f4477",
                "service": "github"
              }
            ],
            "accounts": [
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "service": "twitter",
              },
              {
                "@type": "Account",
                "identifier": "g3lepage",
                "proofType": "http",
                "service": "facebook",
              },
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "service": "github",
              },
              {
                "@type": "Account",
                "contentUrl": "https://s3.amazonaws.com/pk9/guylepage",
                "identifier": "1CADC0B8A5020356D985782CF09793B9F9C6DAD1",
                "role": "key",
                "service": "pgp"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "New York, NY"
            },
            "description": "@blockstackorg developer. 1st hire, Design Partner @blockstacklabs (YC/USV backed) entrepreneur, blockchain, creative, marketing, surf, triathlon, ironman",
            "image": [
              {
                "@type": "ImageObject",
                "contentUrl": "https://s3.amazonaws.com/kd4/guylepage",
                "name": "avatar"
              },
              {
                "@type": "ImageObject",
                "contentUrl": "https://s3.amazonaws.com/dx3/guylepage",
                "name": "cover"
              }
            ],
            "name": "Guy Lepage",
            "website": [
              {
                "@type": "WebSite",
                "url": "http://blockstack.com/team"
              }
            ]
          },
          "type": "UPDATE_PROFILE"
        }
      ]

        assert.deepEqual(store.getActions(), expectedActions)
      })
    })

    it('emits no actions if addresss owns no names', () => {
      // mock core
      nock('http://localhost:6270')
      .get('/v1/addresses/18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6')
      .reply(200, { names: [] },
      { 'Content-Type': 'application/json' })

      const store = mockStore(initialState)

      const mockAPI = Object.assign({}, DEFAULT_API, {

      })

      const addresses = ['18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6']
      const localIdentities = {}
      const namesOwned = []

      return store.dispatch(IdentityActions.refreshIdentities(mockAPI,
        addresses, localIdentities, namesOwned))
      .then(() => {
        const expectedActions = []
        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })

  describe('fetchCurrentIdentity', () => {
    it('fetches profile & validates proof of given identity', () => {
      // mock core

      nock('http://localhost:6270')
      .get('/v1/names/guylepage.id')
      .reply(200, NameLookups['guylepage.id'],
      { 'Content-Type': 'application/json' })

      nock('https://blockstack.s3.amazonaws.com')
      .get('/guylepage.id')
      .reply(200, TokenFileLookups['guylepage.id'],
      { 'Content-Type': 'application/json' })

      nock('https://twitter.com')
      .get('/guylepage3/status/750437834532777984')
      .reply(200, 'verifying that guylepage.id is my blockstack id')

      nock('https://www.facebook.com')
      .get('/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760')
      .reply(200, 'verifying that guylepage.id is my blockstack id')

      nock('https://gist.github.com')
      .get('/guylepage3/48777a21a70d322b0fa4c1fcc53f4477')
      .reply(200, 'verifying that guylepage.id is my blockstack id')

      const store = mockStore(initialState)

      const mockAPI = Object.assign({}, DEFAULT_API, {

      })

      return store.dispatch(IdentityActions.fetchCurrentIdentity(mockAPI.nameLookupUrl, 'guylepage.id'))
      .then(() => {
        const expectedActions = [
        {
          "domainName": "guylepage.id",
          "profile": {
            "@type": "Person",
            "account": [
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "proofUrl": "https://twitter.com/guylepage3/status/750437834532777984",
                "service": "twitter",
              },
              {
                "@type": "Account",
                "identifier": "g3lepage",
                "proofType": "http",
                "proofUrl": "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760",
                "service": "facebook",
              },
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "proofUrl": "https://gist.github.com/guylepage3/48777a21a70d322b0fa4c1fcc53f4477",
                "service": "github",
              }
            ],
            "accounts": [
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "service": "twitter",
              },
              {
                "@type": "Account",
                "identifier": "g3lepage",
                "proofType": "http",
                "service": "facebook",
              },
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "service": "github",
              },
              {
                "@type": "Account",
                "contentUrl": "https://s3.amazonaws.com/pk9/guylepage",
                "identifier": "1CADC0B8A5020356D985782CF09793B9F9C6DAD1",
                "role": "key",
                "service": "pgp",
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "New York, NY",
            },
            "description": "@blockstackorg developer. 1st hire, Design Partner @blockstacklabs (YC/USV backed) entrepreneur, blockchain, creative, marketing, surf, triathlon, ironman",
            "image": [
              {
                "@type": "ImageObject",
                "contentUrl": "https://s3.amazonaws.com/kd4/guylepage",
                "name": "avatar"
              },
              {
                "@type": "ImageObject",
                "contentUrl": "https://s3.amazonaws.com/dx3/guylepage",
                "name": "cover",
              }
            ],
            "name": "Guy Lepage",
            "website": [
              {
                "@type": "WebSite",
                "url": "http://blockstack.com/team"
              }
            ]
          },
          "type": "UPDATE_CURRENT",
          "verifications": []
        },
        {
          "domainName": "guylepage.id",
          "profile": {
            "@type": "Person",
            "account": [
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "proofUrl": "https://twitter.com/guylepage3/status/750437834532777984",
                "service": "twitter"
              },
              {
                "@type": "Account",
                "identifier": "g3lepage",
                "proofType": "http",
                "proofUrl": "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760",
                "service": "facebook"
              },
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "proofUrl": "https://gist.github.com/guylepage3/48777a21a70d322b0fa4c1fcc53f4477",
                "service": "github"
              }
            ],
            "accounts": [
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "service": "twitter"
              },
              {
                "@type": "Account",
                "identifier": "g3lepage",
                "proofType": "http",
                "service": "facebook"
              },
              {
                "@type": "Account",
                "identifier": "guylepage3",
                "proofType": "http",
                "service": "github"
              },
              {
                "@type": "Account",
                "contentUrl": "https://s3.amazonaws.com/pk9/guylepage",
                "identifier": "1CADC0B8A5020356D985782CF09793B9F9C6DAD1",
                "role": "key",
                "service": "pgp"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "New York, NY"
            },
            "description": "@blockstackorg developer. 1st hire, Design Partner @blockstacklabs (YC/USV backed) entrepreneur, blockchain, creative, marketing, surf, triathlon, ironman",
            "image": [
              {
                "@type": "ImageObject",
                "contentUrl": "https://s3.amazonaws.com/kd4/guylepage",
                "name": "avatar"
              },
              {
                "@type": "ImageObject",
                "contentUrl": "https://s3.amazonaws.com/dx3/guylepage",
                "name": "cover"
              }
            ],
            "name": "Guy Lepage",
            "website": [
              {
                "@type": "WebSite",
                "url": "http://blockstack.com/team"
              }
            ]
          },
          "type": "UPDATE_CURRENT",
          "verifications": [
            {
              "identifier": "g3lepage",
              "proof_url": "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760",
              "service": "facebook",
              "valid": false
            },
            {
              "identifier": "guylepage3",
              "proof_url": "https://twitter.com/guylepage3/status/750437834532777984",
              "service": "twitter",
              "valid": true
            },
            {
              "identifier": "guylepage3",
              "proof_url": "https://gist.github.com/guylepage3/48777a21a70d322b0fa4c1fcc53f4477",
              "service": "github",
              "valid": true
            }
          ]
        }
      ]

        assert.deepEqual(store.getActions(), expectedActions)
      })
    })
  })
})
