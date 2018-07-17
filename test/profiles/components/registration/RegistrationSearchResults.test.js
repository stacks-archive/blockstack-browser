import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import RegistrationSearchResults from '../../../../app/js/profiles/components/registration/RegistrationSearchResults';

describe('<RegistrationSearchResults />', () => {
  const availableNames = {
    'foo.id': {},
    'domain': {}
  };
  const nameSuffixes = [
    'foo.id',
    'domain',
    'unavailableDomain'
  ];

  const defaultProps = () => ({
    showSearchBox: () => {},
    searchingUsername: 'name',
    index: 12,
    nameSuffixes,
    availableNames
  });

  describe('when available names are passed', () => {
    let wrapper;
    before(() => {
      wrapper = shallow(<RegistrationSearchResults {...defaultProps()} />);
    })

    it('renders the modal heading', () => {
      expect(wrapper.find('.modal-heading').length).to.equal(1)
    })

    it('renders one result with isSubdomain set to true', () => {
      let subdomainResultCount = 0;
      const results = wrapper.find('UsernameResult[isSubdomain]').forEach(node => {
        if (node.props().isSubdomain) subdomainResultCount++
      });
      expect(subdomainResultCount).to.equal(1)
    })

    it('renders two results with isSubdomain set to false', () => {
      let domainResultCount = 0;
      const results = wrapper.find('UsernameResult[isSubdomain]').forEach(node => {
        if (!node.props().isSubdomain) domainResultCount++
      });
      expect(domainResultCount).to.equal(2)
    })
  })

  describe('when clicking cancel', () => {
    let wrapper, props;
    beforeEach(() => {
      props = {
        ...defaultProps(),
        showSearchBox: sinon.spy()
      }
      wrapper = shallow(<RegistrationSearchResults {...props} />);
    })

    afterEach(() => {
      props.showSearchBox.reset();
    })

    it('fires the `showSearchBox method`', () => {
      wrapper.find('button').simulate('click');
      expect(props.showSearchBox.called).to.be.true
    })
  })
});
