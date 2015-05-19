'use strict';

var parseCodeSection = require('./src/parse-code-section');

var execall = require('regexp.execall'),
    fzip = require('fzip'),
    camelCase = require('camel-case');


var makeSection = function (name, value) {
  name = camelCase(name);
  value = value.trim();

  switch (name) {
    case 'rawSource':
      name = 'source';
      break;

    case 'code':
    case 'optimizedCode':
      value = parseCodeSection(value);
      break;
  }

  var section = {};
  section[name] = value;
  return section;
};


module.exports = function (dump) {
  var positions = execall(/^--- (.*) ---$/gm, dump);

  return fzip(positions.slice(0, -1), positions.slice(1), function (left, right) {
    var name = left[1];
    if (name == 'End code') {
      return null;
    }

    return makeSection(name, dump.slice(left.index + left[0].length + 1,
                                        right.index - 1));
  })
    .map(function (section, index, sections) {
      if (section && Object.keys(section) == 'source') {
        sections[index + 1].source = section.source;
        return null;
      }
      return section;
    })
    .filter(Boolean);
};
