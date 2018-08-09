import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import InputGroup from '../../app/js/components/InputGroup'

describe('<InputGroup />', () => {
  describe('renders the component', () => {
    const props = {
      name: 'input-group-test',
      label: 'Equality',
      data: {
        test: 'Blockchain Revolution'
      },
      centerText: true,
      placeholder: 'Zero Cost Marginal Society',
      accessoryIcon: true,
      accessoryIconClass: 'eloquent-javascript'
    }
    const wrapper = shallow(<InputGroup {...props} />)

    it('creates a div with text-center in the class name', () => {
      expect(wrapper.find('.text-center').exists()).to.equal(true)
    })

    it('creates a label tag', () => {
      expect(wrapper.find('label').text()).to.equal('Equality')
    })

    it('creates an input tag', () => {
      expect(wrapper.find('input').exists()).to.equal(true)
    })

    it('names the input tag', () => {
      expect(wrapper.find('input[name="input-group-test"]').exists()).to.equal(true)
    })

    it('creates a placeholder', () => {
      expect(wrapper.find(
            'input[placeholder="Zero Cost Marginal Society"]').exists()).to.equal(true)
    })

    it('creates an accessory icon', () => {
      expect(wrapper.find('span.eloquent-javascript').exists()).to.equal(true)
    })
  })   
})
