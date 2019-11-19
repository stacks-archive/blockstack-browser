import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import SaveButton from '../../app/js/components/SaveButton'

describe('<SaveButton />', () => {
  let onSaveSpy
  let wrapper

  before(() => {
    const props = {
      onSave: onSaveSpy
    }

    wrapper = shallow(<SaveButton {...props} />)
  })

  it('renders the save button', () => {
    expect(wrapper.find('.btn-primary').length).to.equal(1)
    expect(wrapper.find('.btn-primary').text()).to.contain('Save')
  })

  it('renders the saving button onClick', () => {
    wrapper.find('.btn-primary').simulate('click')
    expect(wrapper.find('.btn-success').length).to.equal(1)
    expect(wrapper.find('.btn-success').text()).to.contain('Saving...')
    return expect(wrapper.state('profileJustSaved')).true
  })
})
