'use strict';

var parse = require('..');

var test = require('tape'),
    parseConcat = require('parse-concat-stream');

var spawn = require('child_process').spawn;


var onDump = function (v8option, cb) {
  var node = spawn('node', [v8option, 'prefix-sum.js'], {
    cwd: __dirname,
    stdio: ['ignore', 'pipe', 'ignore']
  });
  node.stdout.pipe(parseConcat({ parse: parse }, cb));
};


test('print_code', function (t) {
  onDump('--print-code', function (tree) {
    t.equal(tree.length, 595);
    t.end();
  });
});


test('print_opt_code', function (t) {
  onDump('--print-opt-code', function (tree) {
    t.equal(tree.length, 2);
    t.end();
  });
});
