import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Alert from '../../app/js/components/Alert'

describe('<Alert />', () => {
  describe('url exist and state is shown', () => {
    let wrapper
    const props = {
      messsage: 'error-1',
      url: 'https://blockstack.com/alert',
      status: 'status-good'
    }

    before(() => {
      wrapper = shallow(<Alert {...props} />)
    })

    it('renders the component', () => {
      expect(wrapper.find('.alert').length).to.equal(1)
    })

    it('renders the proper alert status', () => {
      expect(wrapper.find('.alert-status-good').length).to.equal(1)
    })

    it('renders the Link Component', () => {
      expect(wrapper.find('Link').length).to.equal(1)
    })

    it('hides the content on button click', () => {
      wrapper.find('.close').simulate('click')
      expect(wrapper.find('.alert').length).to.equal(0)
    })
  })

  describe('url does not exist', () => {
    let wrapper
    const props = {
      messsage: 'error-1',
      url: null,
      status: 'status-good'
    }

    before(() => {
      wrapper = shallow(<Alert {...props} />)
    })

    it('renders the component', () => {
      expect(wrapper.find('.alert').length).to.equal(1)
    })

    it('does not render the Link component', () => {
      expect(wrapper.find('Link').length).to.equal(0)
    })
  })
})
