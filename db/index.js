const knexConfig = require('../knexfile');
const env = process.env.NODE_ENV || 'development';

const knex = require('knex')(knexConfig[env]);
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('bookshelf-camelcase');

require("./base")(bookshelf);

exports.bookshelf = bookshelf;
exports.models = {};

// load all models
const fs = require("fs");
const path = require("path");
const _ = require("lodash");

const currentFile = path.basename(__filename);

_(fs.readdirSync(__dirname))
  .filter((filename) => filename != currentFile)
  .forEach((filename) => require(path.join(__dirname, filename)))
  .commit();
