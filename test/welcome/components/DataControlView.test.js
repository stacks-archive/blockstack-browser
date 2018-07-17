import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import DataControlView from '../../../app/js/welcome/components/DataControlView'

describe('<DataControlView />', () => {
  let wrapper
  let props

  before(() => {
    props = {
      showNextView: sinon.spy()
    }
    wrapper = shallow(<DataControlView {...props} />)
  })
  it('renders the component', () => {
    expect(wrapper.find('.modal-heading.m-t-15.p-b-10').length).to.equal(1)
    expect(wrapper.find('.modal-heading.m-t-15.p-b-10').text()).to.contain(
      'On Blockstack you’ll find apps that give you control over your data'
    )
  })

  it('renders the button', () => {
    expect(wrapper.find('button').length).to.equal(1)
  })

  it('calls showNextView on Back click', () => {
    wrapper.find('button').simulate('click')
    return expect(props.showNextView.called).to.be.true
  })
})
