'use strict';

exports.up = function(knex, Promise) {
  return knex.schema.createTable('float_pages', (table) => {
    table.comment('The pages that floats behind each user\\\'s desktop');
    table.bigInteger('page_id')
      .unsigned()
      .notNullable()
      .references('pages.id')
      .onDelete('cascade');
    table.bigInteger('user_id')
      .unsigned()
      .notNullable()
      .references('users.id')
      .onDelete('cascade');
    table.primary(['page_id', 'user_id']);
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('float_pages');
};
