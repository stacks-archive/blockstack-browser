import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Navigation from '../../app/js/components/Navigation'

describe('<Navigation />', () => {
  describe('renders the component', () => {
    const props = {
      previous() {}
    }  
  
    const wrapper = shallow(<Navigation {...props} />)

    it('uses a ChevronLeftIcon', () => {
      expect(wrapper.find('ChevronLeftIcon').exists()).to.equal(true)
    })

    it('includes the previous label', () => {
      expect(wrapper.childAt(0).childAt(1).text()).to.contain('Back')
    })
  })

  describe('renders the component with a label', () => {
    const props = {
      previous() {},
      previousLabel: 'Previous Page'
    }

    const wrapper = shallow(<Navigation {...props} />)

    it('includes the supplied label', () => {
      expect(wrapper.childAt(0).childAt(1).text()).to.contain('Previous Page')
    })
  })
})
