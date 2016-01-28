const UPDATE_API = 'UPDATE_API'

function updateApi(nameLookupUrl, searchUrl, registerUrl, addressLookupUrl) {
  return {
    type: UPDATE_API,
    nameLookupUrl: nameLookupUrl,
    searchUrl: searchUrl,
    registerUrl: registerUrl,
    addressLookupUrl: addressLookupUrl
  }
}

function resetApi() {
  return dispatch => {
    const DEFAULT_API = {
      nameLookupUrl: 'https://api.onename.com/v1/users/{name}',
      searchUrl: 'https://api.onename.com/v1/search?query={query}',
      registerUrl: 'https://api.onename.com/v1/users',
      addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names?app-id=73146f6a06443a3a66a7df9473353cde&app-secret=7009a810943a00fe7e8157f27bf91bea7e1b4d4e46db695ba2d11e4333ea6f29'
    }
    dispatch(updateApi(
      DEFAULT_API.nameLookupUrl,
      DEFAULT_API.searchUrl,
      DEFAULT_API.registerUrl,
      DEFAULT_API.addressLookupUrl
    ))
  }
}

export const SettingsActions = {
  updateApi: updateApi,
  resetApi: resetApi
}

const initialState = {
  api: {
    nameLookupUrl: 'https://api.onename.com/v1/users/{name}',
    searchUrl: 'https://api.onename.com/v1/search?query={query}',
    registerUrl: 'https://api.onename.com/v1/users',
    addressLookupUrl: 'https://api.onename.com/v1/addresses/{address}/names?app-id=73146f6a06443a3a66a7df9473353cde&app-secret=7009a810943a00fe7e8157f27bf91bea7e1b4d4e46db695ba2d11e4333ea6f29'
  },
  bookmarks: [
    { id: 'naval.id',
      verifications: [],
      blockNumber: 395479,
      transactionIndex: 474,
      profile: {
        '@type': 'Person',
        name: 'Naval Ravikant',
        image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://pbs.twimg.com/profile_images/3696617328/667874c5936764d93d56ccc76a2bcc13.jpeg'}],
        address: { '@type': 'PostalAddress', 'streetAddress': '16 Maiden Ln', 'addressLocality': 'San Francisco, CA', 'postalCode': '94108', 'addressCountry': 'United States'},
        description: 'Co-founder AngelList \u2022 Founder Epinions, Vast \u2022 Author Startupboy, Venture Hacks \u2022 Investor Twitter, Uber, Yammer, Postmates',
        account: [
          { "@type": "Account", "service": "facebook", "identifier": "navalr", "proofType": "http", "proofUrl": "https://facebook.com/navalr/posts/10152190734077261" },
          { "@type": "Account", "service": "twitter", "identifier": "naval", "proofType": "http", "proofUrl": "https://twitter.com/naval/status/486609266212499456" },
          { "@type": "Account", "service": "github", "identifier": "navalr", "proofType": "http", "proofUrl": "https://gist.github.com/navalr/f31a74054f859ec0ac6a" },
          { "@type": "Account", "service": "bitcoin", "role": "payment", "identifier": "1919UrhYyhs471ps8CFcJ3DRpWSda8qtSk", "proofType": "signature", "proofMessage": "Verifying that +naval is my blockchain ID.", "proofSignature": "ICuRA+Dq5Dn8AiY9P+mcLzGyibPgG0ec9CphtMk512uPdB5eAncDSHhQZY/7kycvl6PLFEuR+j3OM/K2Vey1+EU=" }
        ],
        knows: [
          { '@type': 'Person', 'id': 'ryan.id', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/ryan'}] },
          { '@type': 'Person', 'id': 'muneeb.id', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/muneeb'}] },
          {}, {}, {}, {}, {}, {}, {}, {}, {}, {}
        ],
        birthDate: '1973-01-01'
      }
    },
    { id: 'starkness.id', profile: {'@type': 'Person', name: 'Elizabeth Stark', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/starkness'}] } },
    { id: 'jgarzik.id', profile: {'@type': 'Person', name: 'Jeff Garzik', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/jgarzik'}] } },
    { id: 'jespow.id', profile: {'@type': 'Person', name: 'Jesse Powell', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/jespow'}] } },
    { id: 'vitalik.id', profile: {'@type': 'Person', name: 'Vitalik Buterin', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/vitalik'}] } },
    { id: 'sarah.id', profile: {'@type': 'Person', name: 'Sarah Hody', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/sarah'}] } },
    { id: 'jhuber.id', profile: {'@type': 'Person', name: 'Jeff Huber', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/jhuber'}] } },
    { id: 'haydentiff.id', profile: {'@type': 'Person', name: 'Tiffany Hayden', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/haydentiff'}] } },
    { id: 'barrysilbert.id', profile: {'@type': 'Person', name: 'Barry Silbert', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://pbs.twimg.com/profile_images/2597394462/32b6p3stu0g09zwy8rq5.jpeg'}] } },
    { id: 'fredwilson.id', profile: {'@type': 'Person', name: 'Fred Wilson', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/fredwilson1'}] } },
    { id: 'albertwenger.id', profile: {'@type': 'Person', name: 'Albert Wenger', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://pbs.twimg.com/profile_images/1773890030/aew_artistic_bigger.gif'}] } },
    { id: 'peter.id', profile: {'@type': 'Person', name: 'Peter Smith', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/peter'}] } },
    { id: 'ryan.id', profile: {'@type': 'Person', name: 'Ryan Shea', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/ryan'}] } },
    { id: 'muneeb.id', profile: {'@type': 'Person', name: 'Muneeb Ali', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/muneeb'}] } },
    { id: 'judecn.id', profile: {'@type': 'Person', name: 'Jude Nelson', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/judecn'}] } },
    { id: 'guylepage3.id', profile: {'@type': 'Person', name: 'Guy Lepage', image: [{'@type': 'ImageObject', 'name': 'avatar', 'contentUrl': 'https://s3.amazonaws.com/kd4/guylepage3'}] } }
  ]
}

export function SettingsReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_API:
      return Object.assign({}, state, {
        api: {
          nameLookupUrl: action.nameLookupUrl,
          searchUrl: action.searchUrl,
          registerUrl: action.registerUrl,
          addressLookupUrl: action.addressLookupUrl
        }
      })
    default:
      return state
  }
}
