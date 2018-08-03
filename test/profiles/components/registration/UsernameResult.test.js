import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import UsernameResult from '../../../../app/js/profiles/components/registration/UsernameResult';

describe('<UsernameResult />', () => {
  const defaultProps = () => ({
    name: 'foo',
    index: 123,
    isSubdomain: false
  });

  describe('when no availability object is passed', () => {
    it('renders the checking component', () => {
      const wrapper = shallow(<UsernameResult {...defaultProps()} />);
      expect(wrapper.text()).to.contain('Checking');
    });
  })

  describe('when availability object is passed', () => {
    describe('when checking availability', () => {
      const props = {
        ...defaultProps(),
        availability: {
          available: false,
          checkingPrice: false,
          checkingAvailability: true
        }
      }

      it('renders the checking component', () => {
        const wrapper = shallow(<UsernameResult {...props} />);
        expect(wrapper.text()).to.contain('Checking');
      });
    })

    describe('when available', () => {
      describe('when checking price', () => {
        const props = {
          ...defaultProps(),
          availability: {
            available: true,
            checkingPrice: true,
            checkingAvailability: false
          }
        }

        it('renders <UsernameResultDomain />', () => {
          const wrapper = shallow(<UsernameResult {...props} />);
          expect(wrapper.find('UsernameResultDomain').exists()).to.equal(true);
        });
      });

      describe('when isSubdomain is false', () => {
        const props = {
          ...defaultProps(),
          availability: {
            available: true,
            checkingPrice: false,
            checkingAvailability: false
          }
        }
        it('renders <UsernameResultDomain />', () => {
          const wrapper = shallow(<UsernameResult {...props} />);
          expect(wrapper.find('UsernameResultDomain').exists()).to.equal(true);
        });
      })

      describe('when isSubdomain is true', () => {
        const props = {
          ...defaultProps(),
          availability: {
            available: true,
            checkingPrice: false,
            checkingAvailability: false
          },
          isSubdomain: true
        }
        it('renders <UsernameResultSubdomain />', () => {
          const wrapper = shallow(<UsernameResult {...props} />);
          expect(wrapper.find('UsernameResultSubdomain').exists()).to.equal(true);
        });
      })
    })

    describe('when not available', () => {
      const props = {
        ...defaultProps(),
        availability: {
          available: false,
          checkingPrice: false,
          checkingAvailability: false
        }
      };
      it('renders the unavailable component', () => {
        const wrapper = shallow(<UsernameResult {...props} />);
        expect(wrapper.text()).to.contain('already taken');
      });
    })

  })
});
