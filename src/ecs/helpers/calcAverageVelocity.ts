export default function calcAverageVelocity(array: number[]) {
  const sumVelocity = array.reduce((accumulator, currentValue) => {
    return accumulator + currentValue;
  }, 0);

  const averageVelocity = sumVelocity / array.length;
  let velocityDisplay = averageVelocity.toFixed(2);
  if (isNaN(Number(velocityDisplay))) velocityDisplay = '0';

  return velocityDisplay;
}