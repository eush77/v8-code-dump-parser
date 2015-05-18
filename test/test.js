'use strict';

var parse = require('..');

var tape = require('tape');

var fs = require('fs'),
    path = require('path');


var testDump = function (name, test) {
  var dump = fs.readFileSync(path.join(__dirname, 'data', name),
                             { encoding: 'utf8' });
  var sections = parse(dump);
  tape(name, test.bind(null, sections));
};


testDump('print_code', function (sections, t) {
  t.equal(sections.length, 565, 'length is right');

  var stats = sections.reduce(function (acc, section) {
    Object.keys(section).forEach(function (key) {
      acc[key] |= 0;
      ++acc[key];
    });
    return acc;
  }, {});

  t.deepEqual(stats, {
    code: 563,
    optimizedCode: 2,
    source: 221
  }, 'section keys counts are correct');

  t.ok(sections.every(function (section) {
    return 'code' in section != 'optimizedCode' in section;
  }), 'each section contains exactly one of "code" and "optimizedCode"');

  t.end();
});


testDump('print_opt_code', function (sections, t) {
  t.equal(sections.length, 2, 'length is right');

  var keys = sections.map(function (section) {
    return Object.keys(section).sort();
  });
  t.deepEqual(keys, [['optimizedCode', 'source'], ['optimizedCode', 'source']],
              'sections keys are correct');

  t.end();
});
