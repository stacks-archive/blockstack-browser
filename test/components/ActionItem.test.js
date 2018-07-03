import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import ActionItem from '../../app/js/components/ActionItem'

describe('<ActionItem />', () => {
  describe('incomplete', () => {
    let wrapper
    const props = {
      action: 'action-1',
      destinationUrl: 'https://blockstack.com/actions/action-1',
      destinationName: 'action-1-name',
      completed: false
    }

    before(() => {
      wrapper = shallow(<ActionItem {...props} />)
    })

    it('renders the component', () => {
      expect(wrapper.find('.action-item').length).to.equal(1)
    })

    it('renders the toolTip a tag', () => {
      expect(wrapper.find('.tooltip-link').length).to.equal(1)
    })
  })

  describe('complete', () => {
    let wrapper
    const props = {
      action: 'action-1',
      destinationUrl: 'https://blockstack.com/actions/action-1',
      destinationName: 'action-1-name',
      completed: true
    }

    before(() => {
      wrapper = shallow(<ActionItem {...props} />)
    })

    it('does not render the component', () => {
      expect(wrapper.find('.action-item').length).to.equal(0)
    })
  })
})
