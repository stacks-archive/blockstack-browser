'use strict';

import React     from 'react';
import TestUtils from 'react-addons-test-utils';

import StatusBar    from '../../app/js/components/StatusBar';

describe('Component: StatusBar', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <StatusBar {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  it('should render properly', function() {
    assert.doesNotThrow(TestUtils.findRenderedDOMComponentWithClass.bind(null, rendered, 'status-bar'));
  });

});
