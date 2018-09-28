import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import ProfileCompletion from '../../../app/js/profiles/components/ProfileCompletion'

describe('<ProfileCompletion />', () => {
  let wrapper
  let props

  const testDetails = [
    {
      proportion: 'partially',
      completePct: 0.5,
    },
    {
      proportion: '0%',
      completePct: 0,
    }
  ].forEach((testdata) => {
    describe(`when profile is ${testdata.proportion} complete`, () => {
      before(() => {
        props = {
          completePct: testdata.completePct 
        }

        wrapper = shallow(<ProfileCompletion {...props} />)
      })

      it('renders the component', () => {
        expect(wrapper.find('.profile-completion').length).to.equal(1)
      })

      it('makes the width of the progress bar reflect the percent complete', () => {
        expect(wrapper.find('div[role="progressbar"]')
          .prop('style')['width']).to.equal((testdata.completePct * 100) + '%')
      })

      it(`${testdata.completePct === 0 ? 'includes' : 'omits'} the progress-bar-zero class`, () => {
        expect(wrapper.find('div[role="progressbar"] > span').length).to.equal(1)
        expect(wrapper.find('div[role="progressbar"] > span.progress-bar-zero').length).to.equal(testdata.completePct === 0 ? 1: 0)
      })
    })
  })
})
