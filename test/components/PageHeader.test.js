import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import PageHeader from '../../app/js/components/PageHeader'

describe('<PageHeader />', () => {
  let wrapper
  const props = {
    title: 'title',
    subtitle: 'subtitle'
  }

  before(() => {
    wrapper = shallow(<PageHeader {...props} />)
  })

  it('renders the component', () => {
    expect(wrapper.find('.page-header').length).to.equal(1)
  })

  it('renders the proper title text', () => {
    expect(wrapper.find('.h1-modern').text()).to.contain('title')
  })

  it('renders the proper subtitle text', () => {
    expect(wrapper.find('.p-r-1').text()).to.contain('subtitle')
  })
})
