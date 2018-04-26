import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import SupportButton from '../../app/js/components/SupportButton'

describe('<SupportButton />', () => {
  let wrapper
  let props

  before(() => {
    props = {
      onClick: sinon.spy()
    }

    wrapper = shallow(<SupportButton {...props} />)
  })

  it('renders the component', () => {
    expect(wrapper.find('.support-floater').length).to.equal(1)
  })

  it('calls onClick prop function', () => {
    wrapper.find('.support-floater').simulate('click')
    return expect(props.onClick.called).to.be.true
  })
})
