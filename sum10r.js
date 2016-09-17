var assert = require('assert');

function sum(n, data, i) {
  if (typeof i === 'undefined') {
    i = 0;
  }
  var len = data.length,
      sums = [],
      recsums;

  for (;i < len; i+=1) {
    if (data[i] < n) {
      recsums = sum(n - data[i], data, i + 1);
      recsums.forEach(function (s) {
        sums.push([i].concat(s));
      });
    } else if (data[i] === n) {
      sums.push([i]);
    }
  }
  return sums;
}

if (process.argv.length > 2) {
  var n = +process.argv[2],
      data = JSON.parse(process.argv[3]);

  var sums = sum(n, data);

  console.log('Sums: ', sums.length);

  // validating results
  var i,
      len = data.length,
      sum;
  for (i = 0; i < len; i+=1) {
    sum = sums[i].reduce(function (current, i) {
      return current + data[i];
    }, 0); 
    assert(sum === n);
  }
}

module.exports = sum;
