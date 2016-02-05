'use strict';

exports.up = (knex, Promise) => {
  return knex.schema.createTable('pages', (table) => {
    table.bigIncrements('id').primary();
    table.string('user_name').notNullable();
    table.string('from');
    table.datetime('datetime').notNullable();
    table.string('title');
    table.string('url').notNullable();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('pages');
};
