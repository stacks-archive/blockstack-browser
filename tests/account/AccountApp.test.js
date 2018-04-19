import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { AccountApp } from '../../app/js/account/AccountApp'

describe('AccountApp', () => {
  let props
  let wrapper

  before(() => {
    props = {
      children: {},
      storageConnected: true,
      location: {
        pathname: '/not-account'
      }
    }

    wrapper = shallow(<AccountApp {...props} />)
  })

  it('renders the NavBar', () => {
    expect(wrapper.find('Navbar').length).to.equal(1)
  })

  it('renders the SecondaryNavBar', () => {
    expect(wrapper.find('SecondaryNavBar').length).to.equal(1)
  })
})
