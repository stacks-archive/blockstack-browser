import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import SearchItem from '../../../app/js/profiles/components/SearchItem'

describe('<SearchItem />', () => {
  let props
  let wrapper
  before(() => {
    props = {
      domainName: 'humphrey.id',
      profile: {}
    }

    wrapper = shallow(<SearchItem {...props} />)
    console.log(wrapper.debug())
  })

  it('renders the component with a Link tag', () => {
    expect(wrapper.find('Link').length).to.equal(1)   
  })

  it('includes an Image component', () => {
    expect(wrapper.find('Image').length).to.equal(1) 
  })

  it('displays the domain name', () => {
    expect(wrapper.find('.livesearch-id').text()).to.contain(props.domainName)
  })
})
