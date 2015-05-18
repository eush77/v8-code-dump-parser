'use strict';

var execall = require('regexp.execall'),
    fzip = require('fzip'),
    camelCase = require('camel-case');


var sectionName = (function () {
  var nameMap = {
    rawSource: 'source'
  };

  return function (name) {
    return nameMap[name = camelCase(name)] || name;
  };
}());


module.exports = function (dump) {
  var positions = execall(/^--- (.*) ---$/gm, dump);

  return fzip(positions.slice(0, -1), positions.slice(1), function (left, right) {
    var name = left[1];
    if (name == 'End code') {
      return null;
    }

    var section = {};
    section[sectionName(name)] =
      dump.slice(left.index + left[0].length + 1, right.index - 1);
    return section;
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
