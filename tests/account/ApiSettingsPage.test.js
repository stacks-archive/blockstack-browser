import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import { ApiSettingsPage } from '../../app/js/account/ApiSettingsPage'

describe('ApiSettingsPage', () => {
  let props;
  let wrapper;

  before(() => {
    props = {
      api: { apiCustomizationEnabled: true },
      updateApi: sinon.spy(),
      resetApi: sinon.spy()
    }

    wrapper = shallow(<ApiSettingsPage {...props} />)
  })

  it('renders the component', () => {
    expect(wrapper.find('.m-t-10').length).to.equal(1)
    expect(wrapper.find('.m-t-10').text()).to.contain('Blockstack API Options')
  })

  it('renders all the InputGroup(s)', () => {
    expect(wrapper.find('InputGroup').length).to.equal(18)
  })
})
