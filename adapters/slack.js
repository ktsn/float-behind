"use strict";

const getUrls = require("get-urls");
const axios = require("axios");
const _ = require("lodash");
const Promise = require("bluebird");
const moment = require("moment");
const textUtil = require("../utils/text");

const Page = require("../db/page");
const User = require("../db/user");
const Group = require("../db/group");

const OAUTH_ENDPOINT = "https://slack.com/oauth/authorize";
const TOKEN_ISSUE_ENDPOINT = "https://slack.com/api/oauth.access";
const OAUTH_REDIRECT_URL = process.env.SERVICE_HOST + "/oauth/slack/callback";
const OAUTH_CLIENT_ID = process.env.SLACK_CLIENT_ID;
const OAUTH_CLIENT_SECRET = process.env.SLACK_CLIENT_SECRET;
const OAUTH_SCOPE = "team:read,users:read,identify";

exports.getOAuthUrl = function () {
  const paramStr = paramsToString({
    clientId: OAUTH_CLIENT_ID,
    scope: OAUTH_SCOPE,
    redirectUri: OAUTH_REDIRECT_URL
  });

  return `${OAUTH_ENDPOINT}?${paramStr}`;
};

exports.fetchTokenByParam = function (redirectParam) {
  const paramStr = paramsToString({
    clientId: OAUTH_CLIENT_ID,
    clientSecret: OAUTH_CLIENT_SECRET,
    code: redirectParam.code,
    redirectUri: OAUTH_REDIRECT_URL
  });
  const url = `${TOKEN_ISSUE_ENDPOINT}?${paramStr}`;

  return axios
    .get(url)
    .then((response) => {
      return response.data["access_token"];
    });
};

exports.saveSlackUser = function(token) {
  return axios
    .get("https://slack.com/api/auth.test", {
      params: { token: token }
    })
    .then((response) => {
      const data = response.data;
      const slackUserId = data["user_id"];
      const slackTeamId = data["team_id"];

      return Promise.all([
        User.createFromSlack(slackUserId, slackTeamId, token),

        axios
          .get("https://slack.com/api/users.info", {
            params: {
              token: token,
              user: slackUserId
            }
          })
          .then((response) => response.data.user)
      ]);
    })
    .then((values) => {
      const user = values[0];
      const slackUser = values[1];

      return user.set({
        name: slackUser.name,
        email: slackUser.profile.email,
        iconUrl: slackUser.profile["image_48"]
      }).save();
    })
    .catch((err) => console.error(err));
};

exports.createPageByCommand = function (commandParam) {

  const param = snakeKeyToCamel(commandParam);
  const pageUrl = _.first(getUrls(param.text));

  // There is no url in text
  if (!pageUrl) {
    return Promise.resolve(null);
  }

  // get the title from the page
  const titlePromise = axios.get(pageUrl)
    .then((response) => textUtil.extractTitleFromHtml(response.data));

  // create the user for the command author if not exists
  const userPromise = User.where("slack_user_id", "=", param.userId)
    .fetch()
    .then((user) => {
      if (user) return Promise.resolve(user);

      const newUser = new User({
        slackUserId: param.userId,
        name: param.userName
      });

      return newUser.save();
    });

  // create a group having the posted page if not exists
  const groupPromise = Group.where("slack_team_id", "=", param.teamId)
    .fetch()
    .then((group) => {
      if (group) return Promise.resolve(group);

      const newGroup = new Group({
        slackTeamId: param.teamId
      });

      return newGroup.save();
    });

  // save and return the new page
  return Promise.all([titlePromise, userPromise, groupPromise])
    .then((values) => {
      const title = values[0];
      const user = values[1];
      const group = values[2];

      const page = new Page({
        userId: user.get("id"),
        groupId: group.get("id"),
        from: "Slack",
        datetime:  moment().toDate(),
        url: pageUrl,
        title: title
      });

      return page.save();
    });
};

function paramsToString(params) {
  const to = {};

  // translate param keys to snake case and escape param values
  _(params)
    .keys()
    .forEach((key) => {
      to[_.snakeCase(key)] = encodeURIComponent(params[key]);
    })
    .commit();

  return _(to)
    .pairs()
    .map((p) => `${p[0]}=${p[1]}`)
    .join("&");
}

function snakeKeyToCamel(obj) {
  const to = {};

  // translate object keys to camel case
  _(obj)
    .keys()
    .forEach((key) => {
      to[_.camelCase(key)] = obj[key];
    })
    .commit();

  return to;
}
