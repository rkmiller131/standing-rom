/**
 * Calculates the average velocity of an array of numbers, used for end game results compilation.
 * @param {number[]} array - An array of velocities to calculate the average from.
 * @returns {string} The calculated average velocity rounded to two decimal places, or '0' if the result is NaN.
 */
export default function calcAverageVelocity(right: number[], left: number[]) {
  let rightSum = 0;
  let leftSum = 0;
  let rightCount = 0;
  let leftCount = 0;

  let rightMax = 0;
  let leftMax = 0;

  right.forEach((velocity) => {
    if (velocity === 0) {
      return;
    }

    if (velocity) {
      rightSum += velocity;
      rightCount++;
      if (velocity > rightMax) {
        rightMax = velocity;
      }
    }
  });

  left.forEach((velocity) => {
    if (velocity === 0) {
      return;
    }

    if (velocity) {
      leftSum += velocity;
      leftCount++;
      if (velocity > leftMax) {
        leftMax = velocity;
      }
    }
  });

  return {
    rightMax,
    leftMax,
  };
}
