/* eslint-disable */
module.exports = function getRandomItem(list, weightsArray) {
  const args = Array.from(arguments);
  let probabilities;

  if (args.length === 1) {
    const fiftyFifty = Array(list.length)
      .fill(0)
      .map(_ => Number.parseFloat(1 / list.length));
    probabilities = fiftyFifty;
  } else if (args.length === 2) {
    probabilities = weightsArray;
  } else {
    throw new Error('Invalid number of arguments');
  }

  let r = Math.random();
  let idx = probabilities.length - 1;

  probabilities.some((probability, i) => {
    if (r < probability) {
      idx = i;
      return true;
    }
    r -= probability;
  });

  return list[idx];
};
