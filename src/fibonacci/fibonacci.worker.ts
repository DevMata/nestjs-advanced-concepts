function calculateFibonacci(n = 10) {
  if (n < 2) {
    return 1;
  }
  return calculateFibonacci(n - 1) + calculateFibonacci(n - 2);
}

module.exports = (n: number) => {
  return calculateFibonacci(n);
};
