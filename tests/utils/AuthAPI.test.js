'use strict';

import fixtures   from '../../utils/fixtures';
import copyObject from '../../utils/copyObject';
import APIUtils   from '../../app/js/utils/APIUtils';
import AuthAPI    from '../../app/js/utils/AuthAPI';

describe('Util: AuthAPI', function() {

  const USER = copyObject(fixtures.user);

  it('#checkLoginStatus should make a request to check a user\'s login status', function() {
    const path = 'auth/check';

    sandbox.stub(APIUtils, 'get');

    AuthAPI.checkLoginStatus();

    sinon.assert.calledOnce(APIUtils.get);
    sinon.assert.calledWith(APIUtils.get, path);
  });

  it('#login should make a request to login a user', function() {
    const path = 'auth/login';

    sandbox.stub(APIUtils, 'post');

    AuthAPI.login(USER);

    sinon.assert.calledOnce(APIUtils.post);
    sinon.assert.calledWith(APIUtils.post, path, USER);
  });

  it('#logout should make a request to log a user out', function() {
    const path = 'auth/logout';

    sandbox.stub(APIUtils, 'post');

    AuthAPI.logout();

    sinon.assert.calledOnce(APIUtils.post);
    sinon.assert.calledWith(APIUtils.post, path);
  });

});
