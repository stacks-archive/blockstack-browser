import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import AdvancedSidebar from '../../../app/js/profiles/components/AdvancedSidebar';

describe('AdvancedSidebar', () => {
  let props;
  let wrapper;

  before(() => {
    props = {
      activeTab: 'zone-file',
      name: 'tab-1'
    }

    wrapper = shallow(<AdvancedSidebar {...props} />)
  })

  it('renders the component', () => {
    expect(wrapper.find('.list-group').length).to.equal(1)
  })

  it('has an active tab', () => {
    expect(wrapper.find('.active').length).to.equal(1)
  })

  it('renders two Link Components', () => {
    expect(wrapper.find('Link').length).to.equal(2)
  })
})
