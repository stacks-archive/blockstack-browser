import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import HomeButton from '../../app/js/components/HomeButton'

describe('<HomeButton />', () => {
  it('renders the component', () => {
    const wrapper = shallow(<HomeButton />)
    expect(wrapper.find('.btn-home-button').length).to.equal(1)
    expect(wrapper.find('Link').length).to.equal(1)
  })
})
