var assert = require('assert');

/**
 * P(n) - decomposes number into summands.
 *
 * @param      {Number}  n       Number to decompose.
 * @param      {Number}  k       All summands should not exceed k.
 * @param      {Array}   curr    Current decomposition.
 * @param      {Number}  i       Current index.
 * @param      {Array}   res     Resulting array.
 * @return     {Array}   Array of all possible decompositions.
 */
function decompose(n, k, curr, i, res) {
  if (n < 0 || n !== ~~n) {
    throw new Error('n should be positive int value');
  }

  // check inputs
  if (typeof k === 'undefined') {
    k = n;
  }
  if (typeof curr === 'undefined') {
    curr = [];
  }
  if (typeof i === 'undefined') {
    i = 0;
  }
  if (typeof res === 'undefined') {
    res = [];
  }

  if (n < 0) return;
  if (n == 0) {
    // nothing else to decompose
    res.push(curr.slice(0, i));
    return;
  }

  if (n - k >= 0) {
    // fixing k
    curr[i] = k;
    decompose(n - k, k, curr, i + 1, res);
  }
  
  if (k - 1 > 0) {
    // decomposing the part with all numbers below k
    decompose(n, k - 1, curr, i, res);
  }

  return res;
}



/**
 * C(n,k) - all permutations of k numbers from n set.
 *
 * @param      {number}  n       Set to choose numbers from.
 * @param      {number}  k       k numbers
 * @return     {Array}   All permutations.
 */
function permutations(n, k) {
  if (k > n) {
    return [];
  }

  var i,
      p,
      a = [],
      res = [];
  // initial permutation
  for (i = 0; i < k; i+=1) {
    a[i] = i;
  }

  if (n === k) {
    return [a];
  }

  p = k - 1;
  while (p >= 0) {
    res.push(a.slice(0));

    if (a[k - 1] == n - 1) {
      p--;
    } else {
      p = k - 1;
    }

    if (p >= 0) {
      for (i = k - 1; i >= p; i-=1) {
        a[i] = a[p] + i - p + 1;
      }
    }
  }

  return res;
}

/**
 * Finds all combinations with sum n
 *
 * @param      {Number}  n       Sum.
 * @param      {Array}   a       Input array of integer values.
 */
function sum(n, a) {
  var i,
      len = a.length,
      el,
      dict = {};
  for (i = len; i--; ) {
    el = a[i];
    if (!dict[el]) {
      dict[el] = [];
    }

    dict[el].push(i);
  }

  // decompose sum into summands
  var dec = decompose(n, n-1);

  var sums = [],
      nums,
      counts,
      declen,
      j, k, p,
      perms,
      permslen,
      perm,
      permlen,
      mult,
      multlen,
      tmpmult,
      skipdec;
  for (i = 0, len = dec.length; i < len; i+=1) {
    // building map of numbers and their count
    counts = {};
    declen = dec[i].length;
    skipdec = false;
    for (j = 0; j < declen; j+=1) {
      if (!dict[dec[i][j]]) {
        // there is no number from decomposition in the initial array
        skipdec = true;
        break;
      }

      if (!counts[dec[i][j]]) {
        counts[dec[i][j]] = 0;
      }
      counts[dec[i][j]]++;
    }

    if (skipdec) {
      // skipping incompatible decomposition
      continue;
    }

    // building all permutations of each summand
    nums = Object.keys(counts);
    declen = nums.length;
    perms = [];
    skipdec = false;
    for (j = 0; j < declen; j+=1) {
      if (!dict[nums[j]]) {
        continue;
      }

      perm = permutations(dict[nums[j]].length, counts[nums[j]]).map(function (p) {
        return p.map(function (i) {
          return dict[nums[j]][i];
        });
      });

      if (!perm.length) {
        skipdec = true;
        break;
      }

      perms.push(perm);
    }

    if (skipdec) {
      // skipping incompatible decomposition
      continue;
    }

    // multiplying permutations of each summand to get all combinations
    mult = [[]];
    permslen = perms.length;
    for (j = 0; j < permslen; j+=1) {
      tmpmult = [];
      for (k = 0, permlen = perms[j].length; k < permlen; k+=1) {
        for (p = 0, multlen = mult.length; p < multlen; p+=1) {
          tmpmult.push(mult[p].concat(perms[j][k]));
        }
      }
      mult = tmpmult;
    }

    sums = sums.concat(mult);
  }

  return sums;
}


// Generating input array
var i = 0,
    len = 100,
    data = [];
for (i = 0; i < len; i+=1) {
  data[i] = (1 + Math.random() * 9) | 0;
}

var sum10 = sum(10, data);
console.log('Sums of 10: ', sum10.length);

// validating result
for (i = 0, len = sum10.length; i < len; i+=1) {
  sum = sum10[i].reduce(function (current, i) {
    return current + data[i];
  }, 0);
  assert(sum === 10);
}

var sumr = require('./sum10r');
var sum10r = sumr(10, data);
console.log('Sums of 10 (recurrent): ', sum10r.length);
