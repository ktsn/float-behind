'use strict'

const OAUTH_ENDPOINT = 'https://slack.com/oauth/authorize'
const OAUTH_REDIRECT_URL = process.env.SERVICE_HOST + '/oauth/slack/callback'
const OAUTH_CLIENT_ID = process.env.SLACK_CLIENT_ID
const OAUTH_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET
const OAUTH_SCOPE = 'team:read,users:read,identify'

const _ = require('lodash')
const Promise = require('bluebird')
const axios = require('axios')
const { snakeToCamel, camelToSnake, paramsToString } = require('./transform')

const axiosReq = axios.create({
  baseURL: 'https://slack.com/api/'
})

class SlackApi {
  constructor(token) {
    this.token = token
  }

  oauthAccess(code) {
    return this.sendGet('oauth.access', {
      clientId: OAUTH_CLIENT_ID,
      clientSecret: OAUTH_CLIENT_SECRET,
      code,
      redirectUri: OAUTH_REDIRECT_URL
    })
  }

  authTest() {
    return this.sendGet('auth.test')
  }

  usersInfo(userId) {
    return this.sendGet('users.info', {
      user: userId
    })
  }

  sendGet(method, params) {
    if (this.token) {
      params = _.assign({}, params, { token: this.token })
    }

    return axiosReq
      .get(method, {
        params: camelToSnake(params)
      })
      .then((response) => {
        const data = snakeToCamel(response.data)
        if (data.ok) {
          return data
        } else {
          return Promise.reject(data)
        }
      })
  }

  static get oauthUrl() {
    const paramsStr = paramsToString(camelToSnake({
      clientId: OAUTH_CLIENT_ID,
      scope: OAUTH_SCOPE,
      redirectUri: OAUTH_REDIRECT_URL
    }))
    return `${OAUTH_ENDPOINT}?${paramsStr}`
  }
}

module.exports = SlackApi
