import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Navbar from '../../app/js/components/Navbar'

describe('<Navbar />', () => {
  describe('renders the component', () => {
    const wrapper = shallow(<Navbar />)

    it('creates four <Link /> tags', () => {
      expect(wrapper.find('Link')).to.have.length(4)
    })
  })

  describe('renders the component with active home tab', () => {
    const props = {
      activeTab: 'home'
    } 

    const wrapper = shallow(<Navbar {...props} />)

    it('uses the active home tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-home-hover.svg"]').exists()).to.equal(true)
    })

    it('uses the regular settings tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-settings.svg"]').exists()).to.equal(true)
    })

    it('uses the regular wallet tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-wallet.svg"]').exists()).to.equal(true)
    })

    it('uses the regular profile tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-profile.svg"]').exists()).to.equal(true)
    })
  })

  describe('renders the component with active settings tab', () => {
    const props = {
      activeTab: 'settings'
    } 

    const wrapper = shallow(<Navbar {...props} />)

    it('uses the regular home tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-home.svg"]').exists()).to.equal(true)
    })

    it('uses the active settings tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-settings-hover.svg"]').exists()).to.equal(true)
    })

    it('uses the regular wallet tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-wallet.svg"]').exists()).to.equal(true)
    })

    it('uses the regular profile tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-profile.svg"]').exists()).to.equal(true)
    })
  })

  describe('renders the component with active wallet tab', () => {
    const props = {
      activeTab: 'wallet'
    } 

    const wrapper = shallow(<Navbar {...props} />)

    it('uses the regular home tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-home.svg"]').exists()).to.equal(true)
    })

    it('uses the regular settings tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-settings.svg"]').exists()).to.equal(true)
    })

    it('uses the active wallet tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-wallet-hover.svg"]').exists()).to.equal(true)
    })

    it('uses the regular profile tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-profile.svg"]').exists()).to.equal(true)
    })
  })

  describe('renders the component with active profile tab', () => {
    const props = {
      activeTab: 'avatar'
    } 

    const wrapper = shallow(<Navbar {...props} />)

    it('uses the regular home tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-home.svg"]').exists()).to.equal(true)
    })

    it('uses the regular settings tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-settings.svg"]').exists()).to.equal(true)
    })

    it('uses the regular wallet tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-wallet.svg"]').exists()).to.equal(true)
    })

    it('uses the active profile tab icon', () => {
      expect(wrapper.find('img[src="/images/icon-nav-profile-hover.svg"]').exists()).to.equal(true)
    })
  })
})
