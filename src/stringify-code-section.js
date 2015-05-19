'use strict';

var ensureInstructionsFirst = function (attrs) {
  if (attrs[0][0] == 'instructions') {
    return;
  }

  for (var i = 1; i < attrs.length; ++i) {
    if (attrs[i][0] == 'instructions') {
      var temp = attrs[0];
      attrs[0] = attrs[i];
      attrs[i] = temp;
      return;
    }
  }

  throw new Error('No instructions found in the code section.');
};


module.exports = function (code) {
  var singleLineAttributes = [];
  var multiLineAttributes = [];

  Object.keys(code).forEach(function (key) {
    (code[key].indexOf('\n') >= 0 ? multiLineAttributes : singleLineAttributes)
      .push([key, code[key]]);
  });

  singleLineAttributes = singleLineAttributes
    .map(function (attr) {
      return attr.join(' = ');
    })
    .join('\n');

  ensureInstructionsFirst(multiLineAttributes);

  multiLineAttributes = multiLineAttributes
    .map(function (attr) {
      return attr[1];
    })
    .join('\n\n');

  return singleLineAttributes + '\n' + multiLineAttributes;
};
