import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { SearchBar } from '../../../app/js/profiles/components/SearchBar'

describe('<SearchBar />', () => {
  let props
  let wrapper
  const context = { 
    router: {},
  }
  before(() => {
    props = {
      query: 'search term',
      placeholder: 'Search...',
      updateQuery: () => {},
    }

    wrapper = shallow(<SearchBar {...props} />, { context })
  })

  it('renders a text input field', () => {
    expect(wrapper.find('input[type="text"]').length).to.equal(1)
  })

  it('renderss the placeholder text', () => {
    expect(wrapper.find('input').prop('placeholder')).to.contain(props.placeholder)
  })

  it('renders the search term', () => {
    expect(wrapper.find('input').prop('value')).to.contain(props.query)
  })

  it('updates the query when changed', () => {
    const changedQuery = 'new text'
    wrapper.find('input').simulate('change', {
      target: {
        value: changedQuery
      }
    }) 
    expect(wrapper.state('query')).to.equal(changedQuery)
  })

  it('submits the search query when Enter is pressed', () => {
    sinon.stub(wrapper.instance(), 'submitQuery')
    wrapper.find('input').simulate('keypress', {
      key: 'Enter'
    })
    expect(wrapper.instance().submitQuery.called).to.equal(true)
  })
  
})
