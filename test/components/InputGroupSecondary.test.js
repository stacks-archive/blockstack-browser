import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import InputGroupSecondary from '../../app/js/components/InputGroupSecondary'

describe('<InputGroupSecondary />', () => {
  describe('renders the component with an input tag', () => {
    const props = {
      label: 'The DevOps Handbook',
      placeholder: 'Designing Data Intensive Applications',
      name: 'The Republic'
    }

    const wrapper = shallow(<InputGroupSecondary {...props} />)

    it('creates a label tag', () => {
      expect(wrapper.find('label').text()).to.equal('The DevOps Handbook')
    })

    it('creates placeholder text', () => {
      expect(wrapper.find('[placeholder="Designing Data Intensive Applications"]').exists()).to.equal(true)
    })

    it('names the input tag', () => {
      expect(wrapper.find('input[name="The Republic"]').exists()).to.equal(true)
    })
  })

  describe('renders the component with a textarea tag', () => {
    const props = {
      textarea: true,
      textareaRows: 4,
      label: ''
    }

    const wrapper = shallow(<InputGroupSecondary {...props} />)

    it('uses a textarea tag', () => {
      expect(wrapper.find('textarea').exists()).to.equal(true)
    })

    it('sets the number of rows', () => {
      expect(wrapper.find('[rows=4]').exists()).to.equal(true)
    })
  })
})
