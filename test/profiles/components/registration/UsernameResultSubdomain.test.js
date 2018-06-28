import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import UsernameResultSubdomain from '../../../../app/js/profiles/components/registration/UsernameResultSubdomain';

describe('<UsernameResultSubdomain />', () => {
  let wrapper;
  const defaultProps = () => ({
    name: 'foo',
    index: 123
  });

  describe('when rendering', () => {
    before(() => {
      wrapper = shallow(<UsernameResultSubdomain {...defaultProps()} />);
    })

    it('renders component', () => {
      expect(wrapper.find('.username-search-result').length).to.equal(1)
    })

    it('renders a link', () => {
      expect(wrapper.find('Link').exists()).to.equal(true);
    })
  })
});
