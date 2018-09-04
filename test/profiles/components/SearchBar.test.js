import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { SearchBar } from '../../../app/js/profiles/components/SearchBar'

describe('<SearchBar />', () => {
  let wrapper
  const props = {
      query: 'search term',
      placeholder: 'Search...',
      updateQuery: () => {}
  }
  const context = { 
    router: {
      push: function(newPath) { 
        this.newPath = newPath
      },
      getPath: function() { return this.newPath }
    }
  }

  beforeEach(() => {
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

  it('correctly creates a new path for a blockstackID', () => {
    const id = 'blockstack.id'
    makeQuery(id)
    expect(wrapper.context().router.getPath())
      .to.equal(`/profiles/${id}`)
  })

  it('correctly creates a new path for a search query', () => {
    const query = 'a query'
    makeQuery(query)
    expect(wrapper.context().router.getPath())
      .to.equal(`/profiles/i/search/${query.replace(' ', '%20')}`)
  })

  function makeQuery(query) {
    wrapper.find('input').simulate('change', {
      target: {
        value: query
      }
    }) 
    wrapper.find('input').simulate('keypress', {
      key: 'Enter'
    })
  }
})
