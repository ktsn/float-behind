'use strict';

const OAUTH_ENDPOINT = 'https://slack.com/oauth/authorize';
const OAUTH_REDIRECT_URL = process.env.SERVICE_HOST + '/oauth/slack/callback';
const OAUTH_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
const OAUTH_SCOPE = 'team:read,users:read,identify';

const _ = require('lodash');
const Promise = require('bluebird');
const axios = require('axios');

const axiosReq = axios.create({
  baseURL: 'https://slack.com/api/'
});

class SlackApi {
  constructor(token) {
    this.token = token;
  }

  oauthAccess(code) {
    return this.sendGet('oauth.access', {
      clientId: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      code: code,
      redirectUri: OAUTH_REDIRECT_URL
    });
  }

  authTest() {
    return this.sendGet('auth.test');
  }

  usersInfo(userId) {
    return this.sendGet('users.info', {
      user: userId
    });
  }

  sendGet(method, params) {
    if (this.token) {
      params = _.assign({}, params, { token: this.token });
    }

    return axiosReq
      .get(method, {
        params: SlackApi.camelToSnake(params)
      })
      .then((response) => {
        const data = SlackApi.snakeToCamel(response.data);
        if (data.ok) {
          return data;
        } else {
          return Promise.reject(data);
        }
      });
  }

  static get oauthUrl() {
    const paramsStr = SlackApi.paramsToString(SlackApi.camelToSnake({
      clientId: OAUTH_CLIENT_ID,
      scope: OAUTH_SCOPE,
      redirectUri: OAUTH_REDIRECT_URL
    }));
    return `${OAUTH_ENDPOINT}?${paramsStr}`;
  }

  static camelToSnake(obj) {
    return SlackApi.transformKeys(obj, _.snakeCase);
  }

  static snakeToCamel(obj) {
    return SlackApi.transformKeys(obj, _.camelCase);
  }

  static transformKeys(obj, transform) {
    const to = {};

    _(obj)
      .keys()
      .forEach((key) => {
        if (obj[key] != null && typeof obj[key] === 'object') {
          to[transform(key)] = SlackApi.transformKeys(obj[key], transform);
        } else {
          to[transform(key)] = obj[key];
        }
      })
      .commit();

    return to;
  }

  static paramsToString(params) {
    return _(params)
      .pairs()
      .map((p) => `${p[0]}=${p[1]}`)
      .join('&');
  }
}

module.exports = SlackApi;
