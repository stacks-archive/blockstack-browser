'use strict';

import fixtures           from '../../utils/fixtures';
import copyObject         from '../../utils/copyObject';
import CurrentUserStore   from '../../app/js/stores/CurrentUserStore';
import CurrentUserActions from '../../app/js/actions/CurrentUserActions';
import AuthAPI            from '../../app/js/utils/AuthAPI';

describe('Store: CurrentUser', function() {

  const USER = copyObject(fixtures.user);

  beforeEach(function() {
    CurrentUserStore.user = null;
  });

  it('#setUser should set this.user and trigger the store', function() {
    sandbox.stub(CurrentUserStore, 'trigger');

    CurrentUserStore.setUser(USER);

    sinon.assert.calledOnce(CurrentUserStore.trigger);
    sinon.assert.calledWith(CurrentUserStore.trigger, null, USER);
  });

  it('#throwError should trigger the store', function() {
    const err = { message: 'Test error' };

    sandbox.stub(CurrentUserStore, 'trigger');

    CurrentUserStore.throwError(err);

    sinon.assert.calledOnce(CurrentUserStore.trigger);
    sinon.assert.calledWith(CurrentUserStore.trigger, err);
  });

  it('#checkLoginStatus should check user\'s login status on action', function(done) {
    sandbox.stub(AuthAPI, 'checkLoginStatus').resolves(USER);
    sandbox.spy(CurrentUserStore, 'setUser');

    sandbox.stub(CurrentUserStore, 'trigger', () => {
      sinon.assert.calledOnce(AuthAPI.checkLoginStatus);
      sinon.assert.calledOnce(CurrentUserStore.setUser);
      sinon.assert.calledWith(CurrentUserStore.setUser, USER);

      done();
    });

    CurrentUserActions.checkLoginStatus();
  });

  it('#loginUser should log user in on action if API response is successful', function(done) {
    sandbox.stub(AuthAPI, 'login').resolves(USER);
    sandbox.spy(CurrentUserStore, 'setUser');

    sandbox.stub(CurrentUserStore, 'trigger', () => {
      sinon.assert.calledOnce(AuthAPI.login);
      sinon.assert.calledWith(AuthAPI.login, USER);
      sinon.assert.calledOnce(CurrentUserStore.setUser);
      sinon.assert.calledWith(CurrentUserStore.setUser, USER);

      done();
    });

    CurrentUserActions.login(USER);
  });

  it('#logoutUser should log user out on action', function(done) {
    sandbox.stub(AuthAPI, 'logout').resolves();
    sandbox.spy(CurrentUserStore, 'setUser');

    sandbox.stub(CurrentUserStore, 'trigger', () => {
      sinon.assert.calledOnce(AuthAPI.logout);
      sinon.assert.calledOnce(CurrentUserStore.setUser);
      sinon.assert.calledWith(CurrentUserStore.setUser, null);

      done();
    });

    CurrentUserActions.logout();
  });

});
