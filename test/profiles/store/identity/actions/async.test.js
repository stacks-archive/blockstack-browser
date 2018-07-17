import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import nock from 'nock'
import { IdentityActions } from '../../../../../app/js/profiles/store/identity'
import DEFAULT_API from '../../../../../app/js/account/store/settings/default'
import { NameLookups, TokenFileLookups } from '../../../../fixtures/profiles'
import {
  DEFAULT_PROFILE,
  signProfileForUpload
} from '../../../../../app/js/utils/profile-utils'
import { ECPair } from 'bitcoinjs-lib'
import {
  CREATE_NEW,
  UPDATE_PROFILE,
  UPDATE_SOCIAL_PROOF_VERIFICATIONS,
  USERNAME_OWNED,
  UPDATE_PUBLIC_IDENTITY
} from '../../../../../app/js/profiles/store/identity/types'
import {
  NEW_IDENTITY_ADDRESS,
  INCREMENT_IDENTITY_ADDRESS_INDEX
} from '../../../../../app/js/account/store/account/types'

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

describe('Identity Store: Async Actions', () => {
  beforeEach(() => {
    nock.disableNetConnect()
  })

  afterEach(() => {
    nock.cleanAll()
    nock.enableNetConnect()
  })

  describe('createNewProfile', () => {
    it('creates a new profile', () => {
      const encryptedBackupPhrase =
        '1c94d7de00000003aea6d30f8ec79b18c75e5b6537638c0e9a7b9e97fef61596099892fc3f6854dc0472804a8e333a478d1912f89ee6043ed9da1a2c134c72141c4cb78382fea8d980c823dcf1d79a96311ff1552b97c2d42fb3fbde00dfe957f28d5b57d6cafcd4bcde364d31d42232d1f296eb47b7777727158a99aa25014322e06745eef36fc51cfc357594955769925cdadce66de2d3ad3fa88134406f60eeedd7e9b4cf7bd0b6d69dafb6b6a72056a3421e868aa408ba9edb48d75c949023aa3254e80ad8e8131603af21e5ac974028521aff060f8718af4ab2ae04622034cc9210d1d04f7f7b7cae8bce6c0da599031844c33fe6f849aa24dceda9aaaded30d8eb00d08f76215fe79866d62de6d7e841bdea6a5af96c36de70eb114a'
      const password = '123'
      const nextUnusedAddressIndex = 0
      const initialState = {}
      const store = mockStore(initialState)
      return store
        .dispatch(
          IdentityActions.createNewProfile(
            encryptedBackupPhrase,
            password,
            nextUnusedAddressIndex
          )
        )
        .then(() => {
          const expectedActions = [
            {
              keypair: {
                address: '13ssnrZTn4TJzQkwFZHajfeZXrGe6fQtrZ',
                appsNodeKey:
                  'xprv9zn1Mwu3hGDz9ytK4Pvp6ckfswdeMRngASKEcT9J4f2THGjo2UjyrMocunoohYQW2fMx9Cb21KvooM8pVrbuVVjHuqTJ2Kdru5VKGLR1MZa',
                key:
                  '5c21340bdc95b66c203f1080d6c83655137edbb2fcbbf35849e82b10b993b7ad',
                keyID:
                  '0359e44963688f2b3e95cb14ce4026f1ea34540ce04260e23c1ed3b8ff4a08da6c',
                salt:
                  '0816f31b782a4121f4222b8d0f2a60b025b20f3f40136042d806bdccddfcf300'
              },
              type: NEW_IDENTITY_ADDRESS
            },
            {
              index: 0,
              ownerAddress: '13ssnrZTn4TJzQkwFZHajfeZXrGe6fQtrZ',
              type: CREATE_NEW
            },
            {
              type: INCREMENT_IDENTITY_ADDRESS_INDEX
            }
          ]
          assert.deepEqual(store.getActions(), expectedActions)
        })
    })
  })

  describe('refreshIdentities', () => {
    it('adds owned username to identity', done => {
      // mock core
      const nockCore = nock('https://core.blockstack.org')
        .get('/v1/addresses/bitcoin/18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6')
        .reply(
          200,
          { names: ['guylepage.id'] },
          { 'Content-Type': 'application/json' }
        )

      nock('https://core.blockstack.org')
        .get('/v1/names/guylepage.id')
        .reply(404, '')

      // const nockAWS = nock('https://blockstack.s3.amazonaws.com')
      // .get('/guylepage.id')
      // .reply(200, TokenFileLookups['guylepage.id'],
      // { 'Content-Type': 'application/json' })
      //
      // const nockFacebook = nock('https://www.facebook.com')
      // .get('/g3lepage/posts/10154179855498760')
      // .reply(200, 'verifying that guylepage.id is my blockstack id')

      const store = mockStore(initialState)

      const mockAPI = Object.assign({}, DEFAULT_API, {})

      const addresses = ['18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6']

      store
        .dispatch(IdentityActions.refreshIdentities(mockAPI, addresses))
        .then(() => {
          const expectedActions = [
            {
              index: 0,
              type: USERNAME_OWNED,
              username: 'guylepage.id'
            }
          ]
          assert.deepEqual(store.getActions(), expectedActions)
          // assert(nockCore.isDone(), 'nockCore not fetched')
          // assert(nockAWS.isDone(), 'nockAWS not fetched')
          // assert(nockFacebook.isDone(), 'nockFacebook not fetched')
          done()
        })
    })

    it('checks default storage for profile if address owns no names', () => {
      // mock core
      nock('https://core.blockstack.org')
        .get('/v1/addresses/bitcoin/18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6')
        .reply(200, { names: [] }, { 'Content-Type': 'application/json' })

      const store = mockStore(initialState)

      const mockAPI = Object.assign({}, DEFAULT_API, {})

      const addresses = ['18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6']
      const localIdentities = {}
      const namesOwned = []

      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${addresses[0]}/profile.json`)
        .reply(404)

      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${addresses[0]}/0/profile.json`)
        .reply(404)

      return store
        .dispatch(
          IdentityActions.refreshIdentities(
            mockAPI,
            addresses,
            localIdentities,
            namesOwned
          )
        )
        .then(() => {
          const expectedActions = []
          assert.deepEqual(store.getActions(), expectedActions)
        })
    })

    it('checks default storage for profile if address owns no names, selects first if valid', () => {
      // mock core

      const keypairs = [
        {
          key:
            'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
          keyID:
            '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
          address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
          appsNodeKey:
            'xprvA1y4zBndD83n6PWgVH6ivkTpNQ2WU1UGPg9hWa2q8sCANa7YrYMZFHWMhrbpsarxXMuQRa4jtaT2YXugwsKrjFgn765tUHu9XjyiDFEjB7f',
          salt:
            'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e'
        }
      ]

      const address = keypairs[0].address
      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${address}/profile.json`)
        .reply(200, signProfileForUpload(DEFAULT_PROFILE, keypairs[0]))

      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${address}/0/profile.json`)
        .reply(
          200,
          signProfileForUpload(
            {
              '@context': 'http://schema.org',
              '@type': 'Person',
              name: 'Second'
            },
            keypairs[0]
          )
        )

      nock('https://core.blockstack.org')
        .get(`/v1/addresses/bitcoin/${address}`)
        .reply(200, { names: [] }, { 'Content-Type': 'application/json' })

      const store = mockStore(initialState)

      const mockAPI = Object.assign({}, DEFAULT_API, {})

      const addresses = [address]

      return store
        .dispatch(IdentityActions.refreshIdentities(mockAPI, addresses))
        .then(() => {
          const expectedActions = [
            {
              index: 0,
              profile: DEFAULT_PROFILE,
              type: UPDATE_PROFILE,
              zoneFile: ''
            },
            {
              index: 0,
              trustLevel: 0,
              type: UPDATE_SOCIAL_PROOF_VERIFICATIONS,
              verifications: []
            }
          ]

          assert.deepEqual(store.getActions(), expectedActions)
        })
    })

    it('checks default storage for profile if address owns no names, ensures first is valid', () => {
      // mock core

      const keypair = {
        key: 'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
        keyID:
          '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
        address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
        appsNodeKey:
          'xprvA1y4zBndD83n6PWgVH6ivkTpNQ2WU1UGPg9hWa2q8sCANa7YrYMZFHWMhrbpsarxXMuQRa4jtaT2YXugwsKrjFgn765tUHu9XjyiDFEjB7f',
        salt: 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e'
      }

      // bad pair:
      const ecPair = ECPair.makeRandom()
      const badpair = {
        address: ecPair.getAddress(),
        key: ecPair.d.toBuffer(32).toString('hex'),
        keyID: ecPair.getPublicKeyBuffer().toString('hex')
      }

      const address = keypair.address
      const secondProfile = {
        '@context': 'http://schema.org',
        '@type': 'Person',
        name: 'Second'
      }
      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${address}/profile.json`)
        .reply(200, signProfileForUpload(DEFAULT_PROFILE, badpair))

      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${address}/0/profile.json`)
        .reply(200, signProfileForUpload(secondProfile, keypair))

      nock('https://core.blockstack.org')
        .get(`/v1/addresses/bitcoin/${address}`)
        .reply(200, { names: [] }, { 'Content-Type': 'application/json' })

      const store = mockStore(initialState)

      const mockAPI = Object.assign({}, DEFAULT_API, {})

      const addresses = [address]

      return store
        .dispatch(IdentityActions.refreshIdentities(mockAPI, addresses))
        .then(() => {
          const expectedActions = [
            {
              index: 0,
              profile: secondProfile,
              type: UPDATE_PROFILE,
              zoneFile: ''
            },
            {
              index: 0,
              trustLevel: 0,
              type: UPDATE_SOCIAL_PROOF_VERIFICATIONS,
              verifications: []
            }
          ]

          assert.deepEqual(store.getActions(), expectedActions)
        })
    })

    it('checks default storage for profile if address owns no names, uses 2nd if first not found, and uses correct old index.', () => {
      // mock core

      const keypair = {
        key: 'a29c3e73dba79ab0f84cb792bafd65ec71f243ebe67a7ebd842ef5cdce3b21eb',
        keyID:
          '03e93ae65d6675061a167c34b8321bef87594468e9b2dd19c05a67a7b4caefa017',
        address: '1JeTQ5cQjsD57YGcsVFhwT7iuQUXJR6BSk',
        appsNodeKey:
          'xprvA1y4zBndD83n6PWgVH6ivkTpNQ2WU1UGPg9hWa2q8sCANa7YrYMZFHWMhrbpsarxXMuQRa4jtaT2YXugwsKrjFgn765tUHu9XjyiDFEjB7f',
        salt: 'c15619adafe7e75a195a1a2b5788ca42e585a3fd181ae2ff009c6089de54ed9e'
      }

      // bad pair:
      const ecPair = ECPair.makeRandom()
      const badpair = {
        address: ecPair.getAddress(),
        key: ecPair.d.toBuffer(32).toString('hex'),
        keyID: ecPair.getPublicKeyBuffer().toString('hex')
      }

      const dummyAddress = '18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6'
      const address = keypair.address

      const secondProfile = {
        '@context': 'http://schema.org',
        '@type': 'Person',
        name: 'Second'
      }

      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${address}/profile.json`)
        .reply(404, 'Not found')

      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${dummyAddress}/profile.json`)
        .times(3)
        .reply(404, 'Not found')

      // the _tested_ index is 3, which should map to /2/
      nock(`https://gaia.blockstack.org`)
        .get(`/hub/${dummyAddress}/2/profile.json`)
        .reply(200, signProfileForUpload(secondProfile, keypair))

      nock('https://core.blockstack.org')
        .get(`/v1/addresses/bitcoin/${address}`)
        .reply(200, { names: [] }, { 'Content-Type': 'application/json' })

      nock('https://core.blockstack.org')
        .get(`/v1/addresses/bitcoin/${dummyAddress}`)
        .times(3)
        .reply(200, { names: [] }, { 'Content-Type': 'application/json' })

      const store = mockStore(initialState)

      const mockAPI = Object.assign({}, DEFAULT_API, {})

      const addresses = [dummyAddress, dummyAddress, dummyAddress, address]

      return store
        .dispatch(IdentityActions.refreshIdentities(mockAPI, addresses))
        .then(() => {
          const expectedActions = [
            {
              index: 3,
              profile: secondProfile,
              type: UPDATE_PROFILE,
              zoneFile: ''
            },
            {
              index: 3,
              trustLevel: 0,
              type: UPDATE_SOCIAL_PROOF_VERIFICATIONS,
              verifications: []
            }
          ]

          assert.deepEqual(store.getActions(), expectedActions)
        })
    })

    describe('fetchPublicIdentity', () => {
      it('fetches profile & validates proof of given identity from the public network', () => {
        // mock core

        nock('https://core.blockstack.org')
          .persist()
          .get('/v1/names/guylepage.id')
          .reply(200, NameLookups['guylepage.id'], {
            'Content-Type': 'application/json'
          })

        nock('https://blockstack.s3.amazonaws.com')
          .persist()
          .get('/guylepage.id')
          .reply(200, TokenFileLookups['guylepage.id'], {
            'Content-Type': 'application/json'
          })

        nock('https://twitter.com')
          .get('/guylepage3/status/750437834532777984')
          .reply(
            200,
            '<html><head><meta property="og:description" content="“verifying that +guylepage is my blockchain id”"></head></html>'
          )

        nock('https://www.facebook.com')
          .persist()
          .get('/g3lepage/posts/10154179855498760')
          .reply(200, 'verifying that guylepage.id is my blockstack id')

        nock('https://www.facebook.com')
          .get('/g3lepage/posts/undefined')
          .reply(404, '')

        nock('https://www.facebook.com')
          .persist()
          .get(
            '/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760'
          )
          .reply(200, 'verifying that guylepage.id is my blockstack id')

        nock('https://gist.github.com')
          .get('/guylepage3/48777a21a70d322b0fa4c1fcc53f4477')
          .reply(200, 'verifying that guylepage.id is my blockstack id')

        nock('https://gist.github.com')
          .get('/guylepage3/48777a21a70d322b0fa4c1fcc53f4477/raw')
          .reply(404, '')

        const store = mockStore(initialState)

        const mockAPI = Object.assign({}, DEFAULT_API, {})

        return store
          .dispatch(
            IdentityActions.fetchPublicIdentity(
              mockAPI.nameLookupUrl,
              'guylepage.id'
            )
          )
          .then(() => {
            const expectedActions = [
              {
                ownerAddress: '18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6',
                username: 'guylepage.id',
                profile: {
                  '@type': 'Person',
                  account: [
                    {
                      '@type': 'Account',
                      identifier: 'guylepage3',
                      proofType: 'http',
                      proofUrl:
                        'https://twitter.com/guylepage3/status/750437834532777984',
                      service: 'twitter'
                    },
                    {
                      '@type': 'Account',
                      identifier: 'g3lepage',
                      proofType: 'http',
                      proofUrl:
                        'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760',
                      service: 'facebook'
                    },
                    {
                      '@type': 'Account',
                      identifier: 'guylepage3',
                      proofType: 'http',
                      proofUrl:
                        'https://gist.github.com/guylepage3/48777a21a70d322b0fa4c1fcc53f4477',
                      service: 'github'
                    }
                  ],
                  accounts: [
                    {
                      '@type': 'Account',
                      identifier: 'guylepage3',
                      proofType: 'http',
                      service: 'twitter'
                    },
                    {
                      '@type': 'Account',
                      identifier: 'g3lepage',
                      proofType: 'http',
                      service: 'facebook'
                    },
                    {
                      '@type': 'Account',
                      identifier: 'guylepage3',
                      proofType: 'http',
                      service: 'github'
                    },
                    {
                      '@type': 'Account',
                      contentUrl: 'https://s3.amazonaws.com/pk9/guylepage',
                      identifier: '1CADC0B8A5020356D985782CF09793B9F9C6DAD1',
                      role: 'key',
                      service: 'pgp'
                    }
                  ],
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'New York, NY'
                  },
                  description:
                    '@blockstackorg developer. 1st hire, Design Partner @blockstacklabs (YC/USV backed) entrepreneur, blockchain, creative, marketing, surf, triathlon, ironman',
                  image: [
                    {
                      '@type': 'ImageObject',
                      contentUrl: 'https://s3.amazonaws.com/kd4/guylepage',
                      name: 'avatar'
                    },
                    {
                      '@type': 'ImageObject',
                      contentUrl: 'https://s3.amazonaws.com/dx3/guylepage',
                      name: 'cover'
                    }
                  ],
                  name: 'Guy Lepage',
                  website: [
                    {
                      '@type': 'WebSite',
                      url: 'http://blockstack.com/team'
                    }
                  ]
                },
                type: UPDATE_PUBLIC_IDENTITY,
                verifications: [],
                trustLevel: 0,
                zoneFile:
                  '$ORIGIN guylepage.id\n$TTL 3600\n_http._tcp URI 10 1 "https://blockstack.s3.amazonaws.com/guylepage.id"\n'
              },
              {
                ownerAddress: '18AJ31xprVk8u2KqT18NvbmUgkYo9MPYD6',
                profile: {
                  '@type': 'Person',
                  account: [
                    {
                      '@type': 'Account',
                      identifier: 'guylepage3',
                      proofType: 'http',
                      proofUrl:
                        'https://twitter.com/guylepage3/status/750437834532777984',
                      service: 'twitter'
                    },
                    {
                      '@type': 'Account',
                      identifier: 'g3lepage',
                      proofType: 'http',
                      proofUrl:
                        'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760',
                      service: 'facebook'
                    },
                    {
                      '@type': 'Account',
                      identifier: 'guylepage3',
                      proofType: 'http',
                      proofUrl:
                        'https://gist.github.com/guylepage3/48777a21a70d322b0fa4c1fcc53f4477',
                      service: 'github'
                    }
                  ],
                  accounts: [
                    {
                      '@type': 'Account',
                      identifier: 'guylepage3',
                      proofType: 'http',
                      service: 'twitter'
                    },
                    {
                      '@type': 'Account',
                      identifier: 'g3lepage',
                      proofType: 'http',
                      service: 'facebook'
                    },
                    {
                      '@type': 'Account',
                      identifier: 'guylepage3',
                      proofType: 'http',
                      service: 'github'
                    },
                    {
                      '@type': 'Account',
                      contentUrl: 'https://s3.amazonaws.com/pk9/guylepage',
                      identifier: '1CADC0B8A5020356D985782CF09793B9F9C6DAD1',
                      role: 'key',
                      service: 'pgp'
                    }
                  ],
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'New York, NY'
                  },
                  description:
                    '@blockstackorg developer. 1st hire, Design Partner @blockstacklabs (YC/USV backed) entrepreneur, blockchain, creative, marketing, surf, triathlon, ironman',
                  image: [
                    {
                      '@type': 'ImageObject',
                      contentUrl: 'https://s3.amazonaws.com/kd4/guylepage',
                      name: 'avatar'
                    },
                    {
                      '@type': 'ImageObject',
                      contentUrl: 'https://s3.amazonaws.com/dx3/guylepage',
                      name: 'cover'
                    }
                  ],
                  name: 'Guy Lepage',
                  website: [
                    {
                      '@type': 'WebSite',
                      url: 'http://blockstack.com/team'
                    }
                  ]
                },
                trustLevel: 1,
                type: UPDATE_PUBLIC_IDENTITY,
                username: 'guylepage.id',
                verifications: [
                  {
                    identifier: 'guylepage3',
                    proof_url:
                      'https://twitter.com/guylepage3/status/750437834532777984',
                    service: 'twitter',
                    valid: true
                  },
                  {
                    identifier: 'g3lepage',
                    proof_url:
                      'https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2Fg3lepage%2Fposts%2F10154179855498760',
                    service: 'facebook',
                    valid: false
                  },
                  {
                    identifier: 'guylepage3',
                    proof_url:
                      'https://gist.github.com/guylepage3/48777a21a70d322b0fa4c1fcc53f4477',
                    service: 'github',
                    valid: false
                  }
                ],
                zoneFile:
                  '$ORIGIN guylepage.id\n$TTL 3600\n_http._tcp URI 10 1 "https://blockstack.s3.amazonaws.com/guylepage.id"\n'
              }
            ]

            assert.deepEqual(store.getActions(), expectedActions)
          })
      })
    })
  })
})
