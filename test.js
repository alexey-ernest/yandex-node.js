/**
 * Comparing algorithms for finding all subsets of sum N.
 */

var sum = require('./sum')
    sumr = require('./sumr'),
    assert = require('assert');

// Generating input array
var i = 0,
    len = 100,
    data = [];
for (i = 0; i < len; i+=1) {
  data[i] = (1 + Math.random() * 9) | 0;
}

// executing and comparing algorithms
var start,
    end;

// algorithm based on decomposition and permutations
start = new Date();
var sum10 = sum(10, data);
end = new Date();
console.log('Sums of 10:', sum10.length, ' time:', end - start, 'ms');

// algorithm based on recursion
start = new Date();
var sum10r = sumr(10, data);
end = new Date();
console.log('Sums of 10 (recurrent):', sum10.length, ' time:', end - start, 'ms');

assert(sum10.length === sum10r.length);