import React from 'react'
import { shallow } from 'enzyme'
import { expect } from 'chai'
import { IdentityItem } from '../../../app/js/profiles/components/IdentityItem'

describe('<IdentityItem />', () => {
  let wrapper
  let props = {
        avatarUrl: 'myAvatarUrl',
        pending: true,
        ownerAddress: 'myOwnerAddress',
        canAddUsername: true,
        onClick: function() {},
        router: {},
        index: 0,
        profileUrl: 'myProfileUrl'
  }

  const itemsThatShouldAlwaysAppear = () => {
    it('should render user avatar', () => {
      props.username = ''
      wrapper = shallow(<IdentityItem {...props} />)
      expect(wrapper.find('UserAvatar[id="myOwnerAddress"]').length).to.equal(1)
      expect(wrapper.find('UserAvatar[avatarUrl="myAvatarUrl"]').length).to.equal(1)
      expect(wrapper.find('UserAvatar[username="?"]').length).to.equal(1)

      props.username = 'myUsername'
      wrapper = shallow(<IdentityItem {...props} />)
      expect(wrapper.find('UserAvatar[username="myUsername"]').length).to.equal(1)
    })

    it('should render two tooltips', () => {
      expect(wrapper.find('ToolTip').length).to.equal(2)

      let pendingToolTipWrapper = wrapper.find('ToolTip[id="usernamePending"]')
      expect(pendingToolTipWrapper.length).to.equal(1)
      expect(pendingToolTipWrapper.html()).to.contain(
        'Name registration in progress...')

      let addressToolTipWrapper = wrapper.find('ToolTip[id="ownerAddress"]')
      expect(addressToolTipWrapper.length).to.equal(1)
      expect(addressToolTipWrapper.html()).to.contain(
        'This is your identity address.')
    })

    it('should render the owner address', () => {
      expect(wrapper.find('p.card-subtitle').html()).to.contain(props.ownerAddress)
    })

    it('should say whether the identity is default', () => {
      props.isDefault = false
      wrapper = shallow(<IdentityItem {...props} />)
      expect(wrapper.find('ul.list-card li > span').length).to.equal(1)  
      expect(wrapper.find('ul.list-card li > span').html()).to.not.contain('Default ID')

      props.isDefault = true
      wrapper = shallow(<IdentityItem {...props} />)
      expect(wrapper.find('ul.list-card li > span').html()).to.contain('Default ID')
    })
  }

  describe('when allowed to register a username', () => {
    const mockEvent = {
      preventDefault: () => { return true },
      stopPropagation: () => { return true },
    }

    beforeEach(() => {
      props.canAddUsername = true
      wrapper = shallow(<IdentityItem {...props} />)
    })

    itemsThatShouldAlwaysAppear()

    it('should render a context menu', () => {
      expect(wrapper.find('ContextMenu').length).to.equal(1)
    })

    it('should process transfer from onename', () => {
      sinon.stub(window, 'open', () => {
        return {
          focus: () => { return true}
        }
      })
      const url = `https://onename.com/settings?action=export&address=${props.ownerAddress}&url=${props.profileUrl}`

      const menuItem = wrapper.find('MenuItem') 
      menuItem.simulate('click', mockEvent)
      expect(window.open.calledWith(url, '_blank')).to.equal(true)
    })

    it('should render a link to add username', () => {
      expect(wrapper.find('p.card-title a').text()).to.contain('Add username')
    })

    it('the link should use the correct URL', () => {
      props.router.push = () => { return true }
      sinon.stub(props.router, 'push')
      const url = `/profiles/i/add-username/${props.index}/search`
    
      const anchor = wrapper.find('p.card-title a')
      anchor.simulate('click', mockEvent)
      expect(props.router.push.calledWith(url)).to.equal(true)
    })

  
    it('should not render a username field', () => {
      expect(wrapper.find('p.card-title span').length).to.equal(0)
    })
  })  
  
  describe('when not allowed to add a username', () => {
    beforeEach(() => {
      props.canAddUsername = false
      props.username = 'myUsername'
      wrapper = shallow(<IdentityItem {...props} />)
    })

    itemsThatShouldAlwaysAppear()

    it('should not render a context menu', () => {
      expect(wrapper.find('ContextMenu').length).to.equal(0)
    })

    it('should not render a link', () => {
      expect(wrapper.find('p.card-title a').length).to.equal(0)
    })

    it('should render a username field', () => {
      expect(wrapper.find('p.card-title span').text()).to.contain(props.username)
    })
    
    it('should say whether username is pending', () => {
      props.pending = false
      wrapper = shallow(<IdentityItem {...props} />)
      expect(wrapper.find('p.card-title span i').length).to.equal(0)

      props.pending = true
      wrapper = shallow(<IdentityItem {...props} />)
      expect(wrapper.find('p.card-title span i').length).to.equal(1)
    })
  })
})
