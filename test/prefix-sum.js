'use strict';

var add = function (a, b) {
  return a + b;
};

var sub = function (a, b) {
  return a - b;
};

var alternatingPrefixSum = function (n) {
  var sum = 0;
  for (var i = 1; i <= n; ++i) {
    sum = (i % 2 ? add : sub)(sum, i);
  }
  return sum;
};

console.log(alternatingPrefixSum(10101));
