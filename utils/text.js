"use strict";

const cheerio = require("cheerio");

exports.extractTitleFromHtml = function (html) {
  const $ = cheerio.load(html);
  return $("title").text();
};
