'use strict';

exports.up = function(knex, Promise) {
  return knex.schema
    .createTable('users', (table) => {
      table.bigIncrements('id').primary();
      table.string('slack_user_id').unique();
      table.string('slack_access_token');
      table.string('name').notNullable();
      table.string('email').unique();
      table.string('icon_url');
    })
    .createTable('groups', (table) => {
      table.bigIncrements('id').primary();
      table.string('slack_team_id').unique();
    })
    .createTable('groups_users', (table) => {
      table.bigInteger('user_id')
        .unsigned()
        .notNullable()
        .references('users.id')
        .onDelete('cascade');
      table.bigInteger('group_id')
        .unsigned()
        .notNullable()
        .references('groups.id')
        .onDelete('cascade');
      table.primary(['user_id', 'group_id']);
    });
};

exports.down = function(knex, Promise) {
  return knex.schema
    .dropTable('groups_users')
    .dropTable('groups')
    .dropTable('users');
};
