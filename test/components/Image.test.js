import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'
import Image from '../../app/js/components/Image'

describe('<Image />', () => {
  describe('renders the component', () =>{
    const props = {
      src: 'test.jpg',
      fallbackSrc: 'fallback.jpg',
      retinaSupport: true
    }

    const wrapper = shallow(<Image {...props} />)

    it('uses an img tag', () => {
      expect(wrapper.find('img').exists()).to.equal(true)  
    })
    
    it('has a src attribute', () => {
      expect(wrapper.find('[src="test.jpg"]').exists()).to.equal(true)
    })

    /* TODO: Add test for retina support (may require change to
     object under test) */

    it('uses fallbackSrc on error', () => {
      wrapper.find('img').simulate('error')
      expect(wrapper.find('[src="fallback.jpg"]').exists()).to.equal(true)
    })

  })
})

