import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { AccountMenu } from '../../app/js/account/AccountMenu'

describe('AccountMenu', () => {
  let props
  let wrapper

  before(() => {
    props = {
      children: {}
    }

    wrapper = shallow(<AccountMenu {...props} />)
  })

  it('renders the component', () => {
    expect(wrapper.find('.list-group').length).to.equal(1)
  })

  it('renders the 5 Link Components', () => {
    expect(wrapper.find('Link').length).to.equal(5)
  })
})
