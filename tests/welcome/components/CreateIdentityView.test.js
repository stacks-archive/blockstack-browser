import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import CreateIdentityView from '../../../app/js/welcome/components/CreateIdentityView'

describe('<CreateIdentityView />', () => {
  let wrapper
  let props

  before(() => {
    props = {
      showNextView: sinon.spy()
    }
    wrapper = shallow(<CreateIdentityView {...props} />)
  })
  it('renders the component', () => {
    expect(wrapper.find('.modal-heading.m-t-15.p-b-10').length).to.equal(1)
    expect(wrapper.find('.modal-heading.m-t-15.p-b-10').text()).to.contain(
      'Blockstack has no 3rd parties: a keychain on your device gives you access'
    )
  })

  it('renders the img tag', () => {
    expect(wrapper.find('img').length).to.equal(1)
  })

  it('renders the button', () => {
    expect(wrapper.find('button').length).to.equal(1)
  })

  it('calls showNextView on Back click', () => {
    wrapper.find('button').simulate('click')
    return expect(props.showNextView.called).to.be.true
  })
})
