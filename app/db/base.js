'use strict';

const _ = require('lodash');

module.exports = function(bookshelf) {
  const Model = bookshelf.Model;

  Model.prototype.findOrSave = function(options) {
    return this.fetch(_.extend({}, options, { require: false }))
      .then((result) => {
        if (result) return result;
        return this.save();
      });
  };
};
