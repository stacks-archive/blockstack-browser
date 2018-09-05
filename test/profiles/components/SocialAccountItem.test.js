import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { SocialAccountItem } from '../../../app/js/profiles/components/SocialAccountItem'

describe('<SocialAccountItem />', () => {
  let wrapper
  let props = {
    listItem: true,
    editing: true,
    service: 'facebook',
    identifier: 'myIdentifier',
    api: {}
  }

  describe('when verified', () => {
    before(() => {
      props.verified = true
      wrapper = shallow(<SocialAccountItem {...props} />)
    })

    it('should render a list item which has verified class', () => {
      expect(wrapper.find('li').hasClass('verified')).to.equal(true)
    })

    it('should render an icon with a check circle', () => {
      expect(wrapper.find('span.status i').hasClass('fa-check-circle')).to.equal(true)
    })

    it('should render a tooltip which states "Verified"', () => {
      expect(wrapper.find('ReactTooltip').dive().text()).to.contain('Verified')
    })
  }) 
})
