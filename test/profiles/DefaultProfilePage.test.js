import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { DefaultProfilePage } from '../../app/js/profiles/DefaultProfilePage'

function setup(accounts = []) {
  const props = {
    localIdentities: [{
      profile: {
        '@context': 'http://schema.org',
        '@type': 'Person',
        account: accounts
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

function alphabeticalOrdered(accounts) {
  return accounts.first().props().service <
    accounts.last().props().service
}

describe('<DefaultProfilePage />', () => {
  describe('with no filled accounts', () => {
    const { wrapper } = setup()
    const accounts = wrapper.find( 'div.profile-accounts ul').children()
    it('should order placeholder proofs alphabetically', () => {
      expect(alphabeticalOrdered(accounts)).to.eq(true)
    })
  })

  describe('with filled accounts', () => {
    const filledAccounts = [{ service: 'twitter'}, 
                            { service: 'facebook'}]
    const { wrapper } = setup(filledAccounts)
    const list = wrapper.find('div.profile-accounts ul')
    it('should order verified proofs alphabetically', () => {
      const accounts = list.children('[placeholder=false]')
      expect(alphabeticalOrdered(accounts)).to.eq(true)
    })

    it('should order placeholder proofs alphabetically', () => {
      const accounts = list.children('[placeholder=true]')
      expect(alphabeticalOrdered(accounts)).to.eq(true)
    })

    it('should present filled proofs before placeholders',() => {
      const accounts = list.children()
      accounts.forEach((account, index) => {
        expect(account.prop('placeholder')).to.equal(index >= filledAccounts.length)
      })
    })
  })
})


