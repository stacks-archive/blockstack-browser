'use strict';

import React     from 'react';
import TestUtils from 'react-addons-test-utils';

import Footer    from '../../app/js/components/Footer';

describe('Component: Footer', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <Footer {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  it('should render properly', function() {
    assert.doesNotThrow(TestUtils.findRenderedDOMComponentWithTag.bind(null, rendered, 'footer'));
  });

});
