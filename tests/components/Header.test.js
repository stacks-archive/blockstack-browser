'use strict';

import React     from 'react';
import TestUtils from 'react-addons-test-utils';

import Header    from '../../app/js/components/Header';

describe('Component: Header', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <Header {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  it('should render properly', function() {
    assert.doesNotThrow(TestUtils.findRenderedDOMComponentWithTag.bind(null, rendered, 'header'));
  });

});
