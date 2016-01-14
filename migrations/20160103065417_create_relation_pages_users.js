
exports.up = function(knex, Promise) {
  return knex.schema.table("pages", (table) => {
    table.dropColumn("user_name");
    table.bigInteger("user_id")
      .unsigned()
      .notNullable()
      .references("users.id");
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table("pages", (table) => {
    table.dropForeign("user_id");
    table.dropColumn("user_id");
    table.string("user_name").notNullable();
  });
};
