import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import UsernameResultDomain from '../../../../app/js/profiles/components/registration/UsernameResultDomain';

describe('<UsernameResultDomain />', () => {
  const defaultProps = () => ({
    name: 'foo',
    index: 123,
    price: 0.15
  });

  it('renders component', () => {
    const wrapper = shallow(<UsernameResultDomain {...defaultProps()} />);
    expect(wrapper.find('.username-search-result').length).to.equal(1)
  })

  describe('when checking price is true', () => {
    describe('by prop default', () => {
      it('renders the checking price text', () => {
        const wrapper = shallow(<UsernameResultDomain {...defaultProps()} />);
        expect(wrapper.text()).to.contain('Checking price');
      });
    })

    describe('when passed directly', () => {
      it('renders the checking price text', () => {
        const props = {
          ...defaultProps(),
          checkingPrice: true
        }
        const wrapper = shallow(<UsernameResultDomain {...props} />);
        expect(wrapper.text()).to.contain('Checking price');
      });
    })
  })

  describe('when checking price is false', () => {
    const props = {
      ...defaultProps(),
      checkingPrice: false
    };
    it('renders the Register link', () => {
      const wrapper = shallow(<UsernameResultDomain {...props} />);
      expect(wrapper.find('Link').exists()).to.equal(true);
    })
  })
});
