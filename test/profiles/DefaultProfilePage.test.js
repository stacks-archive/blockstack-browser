import React from 'react'
import { expect } from 'chai'
import Enzyme, { mount, shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { DefaultProfilePage } from '../../app/js/profiles/DefaultProfilePage'

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    localIdentities: [{
      profile: {
        '@context': 'http://schema.org',
        '@type': 'Person'
      },
      ownerAddress: 'onwards and upwards',
      verifications: [],
      trustlevel: 0
    }],
    defaultIdentity: 0,
    createNewProfile: () => {},
    updateProfile: () => {},
    refreshIdentities: () => {},
    refreshSocialProofVerifications: () => {},
    api: {},
    identityAddresses: [],
    nextUnusedAddressIndex: 1,
    encryptedBackupPhrase: 'onwards and upwards',
    setDefaultIdentity: () => {},
    identityKeypairs: [],
    storageConnected: false
  }

  const wrapper = shallow(<DefaultProfilePage {...props} />)

  return {
    props,
    wrapper
  }
}

describe('<DefaultProfilePage />', () => {
  it('should order placeholder proofs alphabetically', () => {
    const { wrapper } = setup()
    const accounts = wrapper.find('div.profile-accounts ul').children()
    expect(accounts.first().props().service < 
      accounts.last().props().service)
      .to.eq(true)
  })
})


