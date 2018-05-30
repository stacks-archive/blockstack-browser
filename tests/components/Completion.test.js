import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Completion from '../../app/js/components/Completion'

describe('<Completion />', () => {
  it('renders the component', () => {
    const wrapper = shallow(<Completion />)
    expect(wrapper.find('.tooltip').length).to.equal(1)
  })
})
