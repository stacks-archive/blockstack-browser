import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import WelcomeModal from '../../app/js/welcome/WelcomeModal'

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe('<WelcomeModal />', () => {
  describe('constructor', () => {
    describe('this.state.needToOnboardStorage', () => {
      it('initializes to true if storage was never connected', () => {
        const store = mockStore({
          account: {
            connectedStorageAtLeastOnce: false,
            email: 'satoshi.nakamoto@example.com',
            encryptedBackupPhrase: '1 DOGE = 1 DOGE',
            identityAccount: {
              addresses: []
            },
            promptedForEmail: false
          },
          settings: {
            api: {}
          }
        })
        const props = {
          accountCreated: false,
          storageConnected: false,
          coreConnected: false,
          closeModal: () => {},
          needToUpdate: false,
          router: {},
          email: 'satoshi.nakamoto@example.com'
        }
        const wrapper = shallow(<WelcomeModal {...props} store={store} />).dive()

        expect(wrapper.state('needToOnboardStorage')).to.equal(true)
      })

      it('initializes to false if storage has been connected at least once', () => {
        const store = mockStore({
          account: {
            connectedStorageAtLeastOnce: true,
            email: 'satoshi.nakamoto@example.com',
            encryptedBackupPhrase: '1 DOGE = 1 DOGE',
            identityAccount: {
              addresses: []
            },
            promptedForEmail: false
          },
          settings: {
            api: {}
          }
        })
        const props = {
          accountCreated: false,
          storageConnected: false,
          coreConnected: false,
          closeModal: () => {},
          needToUpdate: false,
          router: {},
          email: 'satoshi.nakamoto@example.com'
        }
        const wrapper = shallow(<WelcomeModal {...props} store={store} />).dive()

        expect(wrapper.state('needToOnboardStorage')).to.equal(false)
      })
    })

    describe('this.state.page', () => {
      it('initializes to 0 if core not connected, hasn\'t been prompted for email, and account hasn\'t been created', () => { // eslint-disable-line
        const store = mockStore({
          account: {
            connectedStorageAtLeastOnce: false,
            encryptedBackupPhrase: '1 DOGE = 1 DOGE',
            identityAccount: {
              addresses: []
            },
            promptedForEmail: false
          },
          settings: {
            api: {}
          }
        })
        const props = {
          accountCreated: false,
          storageConnected: false,
          coreConnected: false,
          closeModal: () => {
          },
          needToUpdate: false,
          router: {}
        }
        const wrapper = shallow(<WelcomeModal {...props} store={store} />).dive()

        expect(wrapper.state('page')).to.equal(0)
      })

      it('initializes to 4 if core is connected, has been prompted for email, and account hasn\'t been created', () => { // eslint-disable-line
        const store = mockStore({
          account: {
            connectedStorageAtLeastOnce: true,
            email: 'satoshi.nakamoto@example.com',
            encryptedBackupPhrase: '1 DOGE = 1 DOGE',
            identityAccount: {
              addresses: []
            },
            promptedForEmail: true
          },
          settings: {
            api: {}
          }
        })
        const props = {
          accountCreated: false,
          storageConnected: false,
          coreConnected: true,
          closeModal: () => {
          },
          needToUpdate: false,
          router: {}
        }
        const wrapper = shallow(<WelcomeModal {...props} store={store} />).dive()

        expect(wrapper.state('page')).to.equal(4)
      })

      it('initializes to 8 if everything complete except for storage onboarding', () => { // eslint-disable-line
        const store = mockStore({
          account: {
            connectedStorageAtLeastOnce: false,
            email: 'satoshi.nakamoto@example.com',
            encryptedBackupPhrase: '1 DOGE = 1 DOGE',
            identityAccount: {
              addresses: []
            },
            promptedForEmail: true
          },
          settings: {
            api: {}
          }
        })
        const props = {
          accountCreated: true,
          storageConnected: false,
          coreConnected: true,
          closeModal: () => {
          },
          needToUpdate: false,
          router: {}
        }
        const wrapper = shallow(<WelcomeModal {...props} store={store} />).dive()

        expect(wrapper.state('page')).to.equal(8)
      })
    })

    it('goes to update state page if modal is not open state needs to update', () => {
      const store = mockStore({
        account: {
          connectedStorageAtLeastOnce: true,
          email: 'satoshi.nakamoto@example.com',
          encryptedBackupPhrase: '1 DOGE = 1 DOGE',
          identityAccount: {
            addresses: []
          },
          promptedForEmail: true
        },
        settings: {
          api: {}
        }
      })
      const props = {
        accountCreated: true,
        storageConnected: true,
        coreConnected: true,
        closeModal: () => {},
        needToUpdate: true,
        router: {
          push: sinon.spy()
        },
        email: 'satoshi.nakamoto@example.com'
      }

      shallow(<WelcomeModal {...props} store={store} />).dive()
      expect(props.router.push.calledWith('/update')).to.equal(true)
    })
  })

  describe('componentWillReceiveProps', () => {
    it('caches email in state if email prop changes', () => {
      const store = mockStore({
        account: {
          connectedStorageAtLeastOnce: false,
          encryptedBackupPhrase: '1 DOGE = 1 DOGE',
          identityAccount: {
            addresses: []
          },
          promptedForEmail: false
        },
        settings: {
          api: {}
        }
      })
      const props = {
        accountCreated: false,
        storageConnected: false,
        coreConnected: false,
        closeModal: () => {
        },
        needToUpdate: false,
        router: {}
      }

      const wrapper = shallow(<WelcomeModal {...props} store={store} />).dive()

      expect(wrapper.state('email')).to.equal(null)
      wrapper.setProps({ email: 'satoshi.nakamoto@example.com' })
      expect(wrapper.state('email')).to.equal('satoshi.nakamoto@example.com')
    })

    it('sets page to step after email step once core is connected, prompted for email, but account not created yet', () => { // eslint-disable-line
      const store = mockStore({
        account: {
          connectedStorageAtLeastOnce: true,
          email: 'satoshi.nakamoto@example.com',
          encryptedBackupPhrase: '1 DOGE = 1 DOGE',
          identityAccount: {
            addresses: []
          },
          promptedForEmail: true
        },
        settings: {
          api: {}
        }
      })
      const props = {
        accountCreated: false,
        storageConnected: false,
        coreConnected: false,
        closeModal: () => {
        },
        needToUpdate: false,
        router: {}
      }
      const wrapper = shallow(<WelcomeModal {...props} store={store} />).dive()

      expect(wrapper.state('page')).to.equal(0)
      wrapper.setProps({ coreConnected: true })
      expect(wrapper.state('page')).to.equal(4)
      expect(wrapper.state('alert')).to.equal(null)
    })

    it('sets page to storage view after completing everything except for storage onboarding', () => { // eslint-disable-line
      const store = mockStore({
        account: {
          connectedStorageAtLeastOnce: false,
          encryptedBackupPhrase: '1 DOGE = 1 DOGE',
          identityAccount: {
            addresses: []
          },
          promptedForEmail: false
        },
        settings: {
          api: {}
        }
      })
      const props = {
        accountCreated: true,
        storageConnected: false,
        coreConnected: true,
        closeModal: () => {
        },
        needToUpdate: false,
        router: {}
      }
      const wrapper = shallow(<WelcomeModal {...props} store={store} />).dive()

      expect(wrapper.state('page')).to.equal(0)
      wrapper.setProps({ promptedForEmail: true })
      expect(wrapper.state('page')).to.equal(8)
      expect(wrapper.state('alert')).to.equal(null)
    })
  })
})
