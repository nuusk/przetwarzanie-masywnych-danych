function combination(n, k) {
  let tmp = 1;

  for (let i = k+1; i <= n; i++) {
    tmp *= i;
  }

  for (let i = 1; i <= n-k; i++) {
    tmp /= i;
  }

  return tmp;
}

module.exports = {
  combination: combination
};