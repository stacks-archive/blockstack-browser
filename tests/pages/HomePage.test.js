'use strict';

import React     from 'react';
import TestUtils from 'react-addons-test-utils';

import HomePage  from '../../app/js/pages/HomePage';

describe('Page: Home', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <HomePage {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  it('should render properly', function() {
    assert.doesNotThrow(TestUtils.findRenderedDOMComponentWithClass.bind(null, rendered, 'home-page'));
  });

});
