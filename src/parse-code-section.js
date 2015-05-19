'use strict';

var zipmap = require('zipmap'),
    camelCase = require('camel-case');


module.exports = function (dump) {
  var headSize = /^Instructions /m.exec(dump).index;

  var attributes = dump.slice(0, headSize).trim().split('\n')
        .map(function (line) {
          return line.split(' = ');
        });

  dump.slice(headSize).split(/\n\n+/).forEach(function (attribute) {
    attributes.push([camelCase(attribute.match(/^[^(\n]*/)[0]), attribute]);
  });

  return zipmap(attributes);
};
