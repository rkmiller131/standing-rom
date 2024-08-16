/**
 * Calculates the average velocity of an array of numbers, used for end game results compilation.
 * @param {number[]} array - An array of velocities to calculate the average from.
 * @returns {string} The calculated average velocity rounded to two decimal places, or '0' if the result is NaN.
 * note: Provide a default empty array to ensure forEach can be called on the array.
 */
export default function calcAverageVelocity(
  right: Array<number> = [],
  left: Array<number> = [],
) {
  let rightSum = 0;
  let leftSum = 0;
  let rightCount = right.length;
  let leftCount = left.length;

  let rightMax = 0;
  let leftMax = 0;

  let rightAverage = 0;
  let leftAverage = 0;

  right.forEach((velocity) => {
    if (velocity === 0) {
      return;
    }

    if (velocity) {
      rightSum += velocity;
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
      if (velocity > leftMax) {
        leftMax = velocity;
      }
    }
  });

  rightAverage = rightSum / rightCount || 0;
  leftAverage = leftSum / leftCount || 0;

  return {
    rightMax,
    leftMax,
    rightAverage,
    leftAverage,
  };
}
