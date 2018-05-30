import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import LandingView from '../../../app/js/welcome/components/LandingView'

describe('<LandingView />', () => {
  describe('webAppBuild is true', () => {
    let wrapper
    let props

    before(() => {
      props = {
        showNewInternetView: sinon.spy(),
        showRestoreView: sinon.spy(),
        webAppBuild: true
      }
      wrapper = shallow(<LandingView {...props} />)
    })

    it('renders the component', () => {
      expect(wrapper.find('img.m-b-20').length).to.equal(1)
    })

    it('renders the webAppBuild', () => {
      expect(wrapper.find('h3').text()).to.contain(
        'Welcome to the Blockstack Browser.'
      )
      expect(wrapper.find('p').text()).to.contain(
        'Join the new'
      )
    })
  })

  describe('webAppBuild is false', () => {
    let wrapper
    let props

    before(() => {
      props = {
        showNewInternetView: sinon.spy(),
        showRestoreView: sinon.spy(),
        webAppBuild: false
      }
      wrapper = shallow(<LandingView {...props} />)
    })

    it('renders the component', () => {
      console.log(wrapper.debug())
      expect(wrapper.find('img.m-b-20').length).to.equal(1)
    })

    it('renders the non-webAppBuild', () => {
      expect(wrapper.find('button').text()).to.contain(
        'Get Started'
      )
      expect(wrapper.find('a').text()).to.contain(
        'Restore an existing keychain'
      )
    })

    it('calls showRestoreView when click the a tag', () => {
      wrapper.find('a').simulate('click')
      return expect(props.showRestoreView.called).to.equal.true
    })
  })
})
