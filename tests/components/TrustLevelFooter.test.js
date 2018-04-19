import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import TrustLevelFooter from '../../app/js/components/TrustLevelFooter'

describe('<TrustLevelFooter />', () => {
  let wrapper
  let props

  before(() => {
    props = {
      onClick: sinon.spy(),
      maxTrustLevel: 10,
      trustLevel: 5
    }

    wrapper = shallow(<TrustLevelFooter {...props} />)
  })

  it('renders the footer', () => {
    expect(wrapper.find('.footer').length).to.equal(1)
  })

  it('calls onClick prop function', () => {
    wrapper.find('.footer').simulate('click')
    return expect(props.onClick.called).to.be.true
  })
})
