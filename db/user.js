'use strict';

const db = require('./index');

const User = db.bookshelf.Model.extend({
  tableName: 'users',
  hidden: ['slackAccessToken', 'slackUserId'],

  pages: function () {
    return this.hasMany(db.models.Page);
  },
  floatPages: function () {
    return this.belongsToMany(db.models.Page, 'float_pages');
  },
  groups: function() {
    return this.belongsToMany(db.models.Group);
  }
}, {
  createFromSlack: function(slackUserId, slackTeamId, slackAccessToken) {
    return this.where('slack_user_id', slackUserId)
      .fetch({ withRelated: 'groups' })
      .then((user) => {
        if (user) return user;

        return User.forge({
          slackUserId, slackAccessToken
        }).save();
      })
      .tap((user) => {
        const groups = user.related('groups');
        let group = groups.findWhere({ slackTeamId });

        if (group) return;

        return db.models.Group.forge({ slackTeamId })
          .findOrSave()
          .then((group) => {
            return groups.attach(group);
          });
      });
  }
});

module.exports = db.models.User = User;
