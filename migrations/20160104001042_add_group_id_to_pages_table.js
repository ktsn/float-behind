'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.table('pages', (table) => {
    table.bigInteger('group_id')
      .unsigned()
      .notNullable()
      .references('groups.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('pages', (table) => {
    table.dropForeign('group_id');
    table.dropColumn('group_id');
  });
};
