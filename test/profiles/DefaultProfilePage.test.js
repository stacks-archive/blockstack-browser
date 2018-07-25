import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import DefaultProfilePage from '../../app/js/profiles/DefaultProfilePage'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('<DefaultProfilePage />', () => {
  describe('constructor', () => {
    it('shows that this test is being run', () => {
      expect(true).to.equal(true) 
    })
  })
  describe('render', () => {  
    it('finds the social proofs', () => { 
      const store = mockStore({
        profiles: {
          identity: {
            localIdentities: {},
            default: {},
            namesOwned: {},
            createProfileError: {},
          }
        },
        account: {
          identityAccount: {
            keypairs: {},
            addresses: {},
            addressIndex: {},
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
        identity: {}
      }
      const wrapper = shallow(<DefaultProfilePage {...props} store={store}/>)
      expect(wrapper.find('.profile-accounts').exists()).to.equal(true)

      var ul = wrapper.find('.profile-accounts ul')
      console.log(ul.toString())
       
    })
  })    
})
