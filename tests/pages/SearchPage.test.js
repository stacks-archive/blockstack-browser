'use strict';

import React      from 'react';
import TestUtils  from 'react-addons-test-utils';

import SearchPage from '../../app/js/pages/SearchPage';

describe('Page: Search', function() {

  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <SearchPage {...props} />
    );
  }

  beforeEach(function() {
    props = {};
    renderComponent();
  });

  it('should render properly', function() {
    assert.doesNotThrow(TestUtils.findRenderedDOMComponentWithClass.bind(null, rendered, 'search-page'));
  });

  it('should update state on input box change', function() {
    const input = rendered.refs.searchInput;
    const newValue = 'giraffe';

    input.value = newValue;
    TestUtils.Simulate.change(input);

    assert.strictEqual(rendered.state.query, newValue);
  });

  it('should render the updated state in the related span', function() {
    const input = rendered.refs.searchInput;
    const span = rendered.refs.queryDisplay;
    const newValue = 'giraffe';

    input.value = newValue;
    TestUtils.Simulate.change(input);

    assert.strictEqual(span.textContent, newValue);
  });

});
