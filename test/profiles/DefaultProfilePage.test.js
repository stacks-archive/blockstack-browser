import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import DefaultProfilePage from '../../app/js/profiles/DefaultProfilePage'
import SocialAccountItem from '../../app/js/profiles/components/SocialAccountItem'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('<DefaultProfilePage />', () => {
  describe('render', () => {  
    it('shows Social Proofs in alphabetical order', () => { 
      const store = mockStore({
        profiles: {
          identity: {
            localIdentities: [],
            default: 0,
            namesOwned: {},
            createProfileError: {},
          }
        },
        account: {
          identityAccount: {
            keypairs: [],
            addresses: [],
            addressIndex: 0,
          },
          encryptedBackupPhrase: "",
        },
        settings: {
          api: {
            storageConnected: true,
          }
        }
      })

      const props = {
          defaultIdentity: 0,
        localIdentities: [0],  
      }
      const wrapper = shallow(<DefaultProfilePage {...props} store={store}/>)
      wrapper.setState({ accountEditIsOpen: true })
      console.log(wrapper.debug())
    })
  })
})
