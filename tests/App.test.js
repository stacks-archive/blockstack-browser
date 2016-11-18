'use strict';

import React              from 'react';
import TestUtils          from 'react-addons-test-utils';

import fixtures           from '../utils/fixtures';
import copyObject         from '../utils/copyObject';
import App                from '../app/js/App';
import CurrentUserStore   from '../app/js/stores/CurrentUserStore';
import CurrentUserActions from '../app/js/actions/CurrentUserActions';

describe('App', function() {

  const USER = copyObject(fixtures.user);
  let rendered;
  let props;

  function renderComponent() {
    rendered = TestUtils.renderIntoDocument(
      <App {...props}>
        <div className="test-child" />
      </App>
    );
  }

  beforeEach(function() {
    props = {
      params: {},
      query: {}
    };

    renderComponent();
  });

  it('#componentDidMount should listen to the user store and check login status', function() {
    sandbox.stub(CurrentUserStore, 'listen');
    sandbox.stub(CurrentUserActions, 'checkLoginStatus');

    rendered.componentDidMount();

    sinon.assert.calledOnce(CurrentUserStore.listen);
    sinon.assert.calledWith(CurrentUserStore.listen, rendered.onUserChange);
    sinon.assert.calledOnce(CurrentUserActions.checkLoginStatus);
  });

  it('#onUserChange should set the error state if an error is received', function() {
    const err = { message: 'Test error message.' };

    rendered.onUserChange(err, null);

    assert.deepEqual(rendered.state.error, err);
  });

  it('#onUserChange should set the user state and clear error if a new user is received', function() {
    rendered.onUserChange(null, USER);

    assert.strictEqual(rendered.state.currentUser, USER);
    assert.isNull(rendered.state.error);
  });

  it('#renderChildren should return all the cloned children', function() {
    assert.doesNotThrow(TestUtils.findRenderedDOMComponentWithClass.bind(null, rendered, 'test-child'));
  });
});
