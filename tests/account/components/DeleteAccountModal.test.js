import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import DeleteAccountModal from '../../../app/js/account/components/DeleteAccountModal'

describe('<DeleteAccountModal />', () => {
  let props
  let wrapper

  before(() => {
    props = {
      isOpen: true,
      contentLabel: 'my-content-label',
      closeModal: sinon.spy(),
      deleteAccount: sinon.spy()
    }

    wrapper = shallow(<DeleteAccountModal {...props} />)
  })

  it('renders the component', () => {
    expect(wrapper.find('Modal').length).to.equal(1)
  })

  it('calls deleteAccount prop function', () => {
    wrapper.find('.btn-danger').simulate('click')
    return expect(props.deleteAccount.called).to.be.true
  })
})
