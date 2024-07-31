import { Vector3 } from 'three';
// NOTE: This was originally used for cross body, where the bubbles would spawn from right hip to left shoulder,
// however Belinda specified cross body shoulder ROM happens from T pose to opposite shoulder. This function can
// be used in the future for any spawning that needs to be done in a straight, linear path.

/**
 * Calculates linear xy coordinates for a target between two positions, based on its index.
 * @param {Vector3} startPosition - The starting hand position.
 * @param {Vector3} endPosition - The ending cross body shoulder position.
 * @param {number} numSegments - Total number of targets to be spawned along this path.
 * @param {number} index - The index of the current target.
 * @returns {Vector3} - The calculated position of the current target.
 */
export function calcLinearCoordinates(
  startPosition: Vector3,
  endPosition: Vector3,
  numSegments: number,
  index: number
) {
  const directionVector = endPosition.clone().sub(startPosition).normalize();
  const segmentLength = directionVector.length() / numSegments;

  const position = startPosition.clone().add(directionVector.clone().multiplyScalar(segmentLength * index));
  position.add(new Vector3(0, 0, -0.3)); // stick out from the avatar torso a bit

  return position;
}