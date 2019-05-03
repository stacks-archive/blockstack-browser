import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Navbar, {
  navBarData as sections,
  NavItem
} from '../../app/js/components/Navbar'

describe('<Navbar />', () => {
  describe('renders the component', () => {
    const wrapper = shallow(<Navbar />)

    it('creates four <NavItem /> components', () => {
      expect(wrapper.find(NavItem)).to.have.lengthOf(4)
    })
  })

  sections.forEach(section => {
    describe('renders the component with each section', () => {
      section.forEach(item => {
        describe(`renders the component with active prop ${item.label}`, () => {
          const props = {
            location: {
              pathname: item.path
            }
          }
          const wrapper = shallow(<Navbar {...props} />)

          it(`item is active, ${item.label}`, () => {
            expect(wrapper.find('NavItem').prop('active')).to.have.lengthOf(1)
          })
        })
      })
    })
  })
})
