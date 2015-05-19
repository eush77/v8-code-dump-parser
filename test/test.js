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

  t.deepEqual(Object.keys(sections[0]), ['code'], 'first section / subsections');
  t.deepEqual(Object.keys(sections[0].code).sort(),
              ['kind', 'major_key', 'name', 'instructions',
               'safepoints', 'relocInfo'].sort(),
              'first section / code / attributes');

  [['kind', 'STUB'],
   ['major_key', '<NoCache>Stub'],
   ['name', 'ArrayNoArgumentConstructorStub']].forEach(function (attr) {
     t.equal(sections[0].code[attr[0]], attr[1],
             'first section / code / ' + attr[0]);
   });

  t.ok(sections[0].code.instructions.indexOf('REX.W movq') >= 0,
       'first section / code / instructions');

  t.end();
});


testDump('print_opt_code', function (sections, t) {
  t.equal(sections.length, 2, 'length is right');

  var keys = sections.map(function (section) {
    return Object.keys(section).sort();
  });
  t.deepEqual(keys, [['optimizedCode', 'source'], ['optimizedCode', 'source']],
              'sections keys are correct');

  t.deepEqual(Object.keys(sections[0]).sort(), ['optimizedCode', 'source'],
              'first section / subsections');
  t.deepEqual(Object.keys(sections[0].optimizedCode).sort(),
              ['optimization_id', 'source_position', 'kind', 'name', 'stack_slots',
               'instructions', 'deoptimizationInputData',
               'safepoints', 'relocInfo'].sort(),
              'first section / optimizedCode / attributes');

  [['optimization_id', '0'],
   ['source_position', '144'],
   ['kind', 'OPTIMIZED_FUNCTION'],
   ['name', 'sub'],
   ['stack_slots', '1']].forEach(function (attr) {
     t.equal(sections[0].optimizedCode[attr[0]], attr[1],
             'first section / optimizedCode / ' + attr[0]);
   });

  t.ok(sections[0].optimizedCode.instructions.indexOf('REX.W movq') >= 0,
       'first section / optimizedCode / instructions');

  t.end();
});
