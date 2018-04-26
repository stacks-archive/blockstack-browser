import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import NewInternetView from '../../../app/js/welcome/components/NewInternetView'

describe('<NewInternetView />', () => {
  let wrapper
  let props

  before(() => {
    props = {
      showNextView: sinon.spy()
    }
    wrapper = shallow(<NewInternetView {...props} />)
  })
  it('renders the component', () => {
    expect(wrapper.find('.modal-heading.m-t-15.p-b-10').length).to.equal(1)
    expect(wrapper.find('.modal-heading.m-t-15.p-b-10').text()).to.contain(
      'Blockstack is a new internet designed for freedom & security'
    )
  })

  it('renders the button', () => {
    expect(wrapper.find('button').length).to.equal(1)
  })

  it('calls showNextView on Continue click', () => {
    wrapper.find('button').simulate('click')
    return expect(props.showNextView.called).to.be.true
  })
})
