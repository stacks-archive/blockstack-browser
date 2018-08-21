import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Navbar, { ICONS } from '../../app/js/components/Navbar'

describe('<Navbar />', () => {
  describe('renders the component', () => {
    const wrapper = shallow(<Navbar />)

    it('creates four <Link /> tags', () => {
      expect(wrapper.find('Link')).to.have.length(4)
    })
  })

  const tabDetails = [
    {
      name: 'home',
      activeIcon: ICONS.homeNavActive,
      regularIcon: ICONS.homeNav
    },
    {
      name:'settings',
      activeIcon: ICONS.settingsNavActive,
      regularIcon: ICONS.settingsNav
    },
    {
      name:'wallet',
      activeIcon: ICONS.walletNavActive,
      regularIcon: ICONS.walletNav
    },
    {
      name: 'profile',
      prop: 'avatar',
      activeIcon: ICONS.avatarNavActive,
      regularIcon: ICONS.avatarNav
    }]

  tabDetails.forEach((tab) => {
    describe(
    `renders the component with active ${tab.name} tab`, () => {
      const props = {
        activeTab: tab.prop || tab.name
      }

      const wrapper = shallow(<Navbar {...props} />)

      it(`uses the active ${tab.name} tab icon`, () => {
        expect(wrapper.find(`img[src="${tab.activeIcon}"]`)
        .exists()).to.equal(true)
      })

      const tabs = tabDetails.filter(temp => temp.name !== tab.name)

      tabs.forEach((innerLoopTab) => {
        it(`uses the regular ${innerLoopTab.name} tab icon`, () => {
          expect(wrapper.find(`img[src="${innerLoopTab.regularIcon}"]`)
          .exists()).to.equal(true)
        })
      })
    })
  })
})
