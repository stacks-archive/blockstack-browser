import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { EditAccount } from '../../../app/js/profiles/components/EditAccount'

describe('<EditAccount />', () => {
  let wrapper
  let props = {
    api: {
      bitcoinAddressUrl: function() { return 'mybitcoinaddress'},
      ethereumAddressUrl: function() { return 'myethereumaddress' }
    },
    indentifier: 'myidentifier',
    service: 'facebook',
  }

  let isVerifiedArray = [true, false]
  isVerifiedArray.forEach((isVerified) => {
    it(`should have the correct verified class when ${isVerified ? 'verified': 'unverified'}`, () => {
      props.verified = verified
      wrapper = shallow(<EditAccount {...props} />)
      expect(wrapper.find('div.profile-account').hasClass('verified')).to.equal(verified)
    })
  })

  describe('when there is an account type', () => {
    it('displays the service name', () => {
      expect(wrapper.find('div.heading').text()).to.contain(props.service)
    })

    it('renders an InputGroup', () => {
      expect(wrapper.find('InputGroup').length).to.equal(1)
    }) 

    it('should should render the icon code', () => {
      let instance = wrapper.instance()
      expect(instance.getIconClass()).to.equal('fa-facebook')
    })

    let serviceDescriptors = [
      { service: 'twitter',
        descriptor: 'account'},
      { service: 'bitcoin',
        descriptor: 'address'},
      { service: 'ssh',
        descriptor: 'key'}]

    serviceDescriptors.forEach((sd) => {
      it(`should render the appropriate placeholder text for ${sd.service}`, () => {
        props.service = sd.service
        wrapper = shallow(<EditAccount {...props} />)
        expect(wrapper.find('div.profile-account div > span').text()).to.contain(sd.descriptor)
      })
    })
  })

  describe('when there is no account type', () => {
    it('should render a span', () => {
      props.service = null
      wrapper = shallow(<EditAccount {...props} />)
      expect(wrapper.find('span').length).to.equal(1)
    })
  })
})  
