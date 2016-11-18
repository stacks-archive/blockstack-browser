'use strict';

import React        from 'react';
import TestUtils    from 'react-addons-test-utils';

import NotFoundPage from '../../app/js/pages/NotFoundPage';

describe('Page: Not Found', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <NotFoundPage {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  it('should render properly', function() {
    assert.doesNotThrow(TestUtils.findRenderedDOMComponentWithClass.bind(null, rendered, 'not-found-page'));
  });

});
