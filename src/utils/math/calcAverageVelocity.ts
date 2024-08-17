/**
 * Calculates the average velocity of an array of numbers, used for end game results compilation.
 * @param {number[]} array - An array of velocities to calculate the average from.
 * @returns {string} The calculated average velocity rounded to two decimal places, or '0' if the result is NaN.
 */
export default function calcAverageVelocity(array: number[]) {
  const humanLimits = array.filter((value) => value < 2);
  const sumVelocity = humanLimits.reduce((accumulator, currentValue) => {
      return accumulator + currentValue;
  }, 0);

  const averageVelocity = sumVelocity / array.length;
  let velocityDisplay = averageVelocity.toFixed(2);
  if (isNaN(Number(velocityDisplay))) velocityDisplay = '0';

  return {
    avg: velocityDisplay,
    max: Math.max(...humanLimits)
  }
}
