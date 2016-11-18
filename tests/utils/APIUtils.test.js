'use strict';

import request  from 'superagent';
import APIUtils from '../../app/js/utils/APIUtils';

describe('Util: APIUtils', function() {

  it('#normalizeResponse should normalize the body of a response object with varying keys', function() {
    const beforeObj = {
        camel_case: 'yes', //eslint-disable-line camelcase
        WhatIsThisCase: 'yes'
    };
    const afterObj = { camelCase: 'yes', whatIsThisCase: 'yes' };

    assert.deepEqual(APIUtils.normalizeResponse(beforeObj), afterObj);
  });

  it('#get should make a GET request', function() {
    const path = 'auth/check';

    sandbox.stub(request, 'get');

    APIUtils.get(path);

    sinon.assert.calledOnce(request.get);
    sinon.assert.calledWith(request.get, APIUtils.root + path);
  });

  it('#post should make a POST request', function() {
    const path = 'auth/login';
    const user = {
      username: 'test',
      password: 'test'
    };

    sandbox.stub(request, 'post');

    APIUtils.post(path, user);

    sinon.assert.calledOnce(request.post);
    sinon.assert.calledWith(request.post, APIUtils.root + path, user);
  });

  it('#patch should make a PATCH request', function() {
    const path = 'user/1';
    const user = {
      email: 'new@test.com'
    };

    sandbox.stub(request, 'patch');

    APIUtils.patch(path, user);

    sinon.assert.calledOnce(request.patch);
    sinon.assert.calledWith(request.patch, APIUtils.root + path, user);
  });

  it('#put should make a PUT request', function() {
    const path = 'user/1';
    const user = {
      email: 'new@test.com'
    };

    sandbox.stub(request, 'put');

    APIUtils.put(path, user);

    sinon.assert.calledOnce(request.put);
    sinon.assert.calledWith(request.put, APIUtils.root + path, user);
  });

  it('#del should make a DELETE request', function() {
    const path = 'user/1';

    sandbox.stub(request, 'del');

    APIUtils.del(path);

    sinon.assert.calledOnce(request.del);
    sinon.assert.calledWith(request.del, APIUtils.root + path);
  });

});
