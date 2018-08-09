import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { EnterEmailView } from '../../../app/js/welcome/components/EnterEmailView'

describe('<EnterEmailView />', () => {
  let wrapper
  let props

  before(() => {
    props = {
      emailNotifications: sinon.spy(),
      skipEmailBackup: sinon.spy()
    }
    wrapper = shallow(<EnterEmailView {...props} />)
  })
  it('renders the component', () => {
    expect(wrapper.find('.modal-heading').length).to.equal(1)
    expect(wrapper.find('.modal-heading').text()).to.contain('Enter your email address')
  })

  it('renders the InputGroup', () => {
    expect(wrapper.find('InputGroup').length).to.equal(1)
  })

  it('renders button', () => {
    expect(wrapper.find('button').length).to.equal(1)
  })

  it('changes the state of email on input change', () => {
    wrapper.instance().onValueChange({
      target: { name: 'email', value: 'new-input' }
    })

    expect(wrapper.state('email')).to.contain('new-input')
  })
})
