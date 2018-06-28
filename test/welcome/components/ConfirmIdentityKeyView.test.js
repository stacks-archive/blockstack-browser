import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import ConfirmIdentityKeyView from '../../../app/js/welcome/components/ConfirmIdentityKeyView'

describe('<ConfirmIdentityKeyView />', () => {
  let wrapper
  let props

  before(() => {
    props = {
      confirmIdentityKeyPhrase: sinon.spy(),
      showPreviousView: sinon.spy()
    }
    wrapper = shallow(<ConfirmIdentityKeyView {...props} />)
  })
  it('renders the component', () => {
    expect(wrapper.find('.modal-heading').length).to.equal(1)
  })

  it('renders the InputGroup', () => {
    expect(wrapper.find('InputGroup').length).to.equal(1)
  })

  it('renders button', () => {
    expect(wrapper.find('button').length).to.equal(1)
  })

  it('calls showPreviousView on Back click', () => {
    wrapper.find('a').simulate('click')
    return expect(props.showPreviousView.called).to.be.true
  })
})
