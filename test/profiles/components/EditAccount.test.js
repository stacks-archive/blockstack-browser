import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { EditAccount } from '../../../app/js/profiles/components/EditAccount'

import { getWebAccountTypes } from '../../../app/js/utils'

describe('<EditAccount />', () => {
  let wrapper
  let props = {
    api: {},
    indentifier: 'myidentifier',
    service: 'facebook',
  }

  const isVerifiedArray = [true, false]
  isVerifiedArray.forEach((isVerified) => {
    it(`should have the correct verified class when ${isVerified ?
        'verified': 'unverified'}`, () => {
      props.verified = isVerified
      wrapper = shallow(<EditAccount {...props} />)
      expect(wrapper.find('div.profile-account').hasClass('verified'))
            .to.equal(isVerified)
    })
  })

  it('should be able to capitalize a string', () => {
    const instance = wrapper.instance()
    expect(instance.capitalize('abcd')).to.equal('Abcd')
  })

  it('should truncate the identifier beyond 40 characters', () => {
    const newID = 
      'awonderfullylongidentifierthatshouldnotbesolongasittakesuptoomuchroom'
    wrapper.setState({
      identifier: newID 
    })
    const instance = wrapper.instance()
    expect(instance.getIdentifier()).to.equal(newID.slice(0, 40) + '...')
  })

  describe('when there is a service', () => {
    before(() => {
      wrapper = shallow(<EditAccount {...props} />)
    })

    it('displays the service name', () => {
      expect(wrapper.find('div.heading').text()).to.contain(props.service)
    })

    it('renders an InputGroup', () => {
      expect(wrapper.find('InputGroup').length).to.equal(1)
    }) 

    it('updates the identifier on change', () => {
      const newID = 'myNewID'
      wrapper.find('InputGroup').simulate('change', {
        target: {
          value: newID
        }
      })
      expect(wrapper.state('identifier')).to.equal(newID)
    })

    it('should should render the icon class', () => {
      const expectedIcon = getWebAccountTypes(props.api)[props.service].iconClass 
      expect(wrapper.find('div.heading > i').hasClass(expectedIcon)).to.equal(true)
    })

    it('should replace the identifier in the URL template', () => {
      const instance = wrapper.instance()
      const urlTemplate = getWebAccountTypes(props.api)[props.service].urlTemplate
      expect(instance.getAccountUrl()).to.equal(urlTemplate.replace(
        '{identifier}', props.identifier)) 
    })

    const serviceDescriptors = [
      { service: 'twitter',
        descriptor: 'account'},
      { service: 'bitcoin',
        descriptor: 'address'},
      { service: 'ssh',
        descriptor: 'key'}]

    serviceDescriptors.forEach((sd) => {
      describe(`when the service is ${sd.service}`, () => {
        beforeEach(() => {
          props.service = sd.service
          wrapper = shallow(<EditAccount {...props} />)
        })

        it('should render the appropriate placeholder text', () => {
          expect(wrapper.find('div.profile-account div > span').text())
            .to.contain(sd.descriptor)
        })

        it('should get the appropriate identifier type', () => {
          const instance = wrapper.instance()
          expect(instance.getIdentifierType(sd.service))
            .to.contain(sd.descriptor)
        })
      })
    })
  })

  describe('when there is no service', () => {
    it('should render a span', () => {
      props.service = null
      wrapper = shallow(<EditAccount {...props} />)
      expect(wrapper.find('span').length).to.equal(1)
    })
  })
})  
