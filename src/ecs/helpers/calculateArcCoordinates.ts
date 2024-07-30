import { Vector3 } from 'three';
// HELPFUL VIDEOS:
// https://youtu.be/zjMuIxRvygQ?feature=shared&t=194 <-got the formula from here
// https://eater.net/quaternions

/**
 * Calculates the coordinates of a point after rotating it around the origin in 3D space.
 * @param {Vector3} origin - The central point of the rotation (center of circle or arc).
 * @param {string} sideSpawned - Specifies the side spawned: 'left', 'right', 'frontL', or 'frontR'.
 * @param {Vector3} startingPoint - The starting coordinates to be rotated such as the avatar hand position or first target position.
 * @param {number} angle - The angle of desired rotation in radians.
 * @returns {Vector3} - The coordinates of the new, rotated point.
 */
export function calculateArcCoordinates(
  origin: Vector3,
  sideSpawned: string,
  startingPoint: Vector3,
  angle: number
) {
  const { x: ox, y: oy, z: oz } = origin;
  const { x: px, y: py, z: pz } = startingPoint;

  let qx, qy, qz;
  if (sideSpawned === 'left' || sideSpawned === 'right') {
    // for left both angle needs to be negative and starting point x needs to be negative
    qz = pz; // constrain the z, we're doing lateral raises on the xy plane
    qx = ox + Math.cos(angle) * (px - ox) - Math.sin(angle) * (py - oy);
    qy = oy + Math.sin(angle) * (px - ox) + Math.cos(angle) * (py - oy);
  } else if (sideSpawned === 'frontL' || sideSpawned === 'frontR') {
    qx = px; // constrain the x, we're doing frontal raises on the yz plane
    qy = oy + Math.cos(angle) * (py - oy) - Math.sin(angle) * (pz - oz);
    qz = oz + Math.sin(angle) * (py - oy) + Math.cos(angle) * (pz - oz);
    qz -= 0.1; // move bubbles *slightly* further out from the avatar (they were a little too close)
  } else if (sideSpawned === 'crossL') {
    qy = py; // mirroring crossbody: for the xz plane, rotating a point around an origin by an angle involves transforming both x and z coords based on the angle
    qx = ox - Math.cos(angle) * (px - ox) - Math.sin(angle) * (py - oy); // use subtraction on cos to reflect movement across the body in the opposite direction
    qz = oz + Math.sin(angle) * (py - oy) + Math.cos(angle) * (pz - oz); // the use of cos and sin are also flipped to reflect opposite movement
    qz -= 0.05;
  } else if (sideSpawned === 'crossR') {
    qy = py; // constrain the y, we're doing horizontal adduction on the xz plane
    qx = ox + Math.sin(angle) * (px - ox) + Math.cos(angle) * (py - oy);
    qz = oz + Math.cos(angle) * (py - oy) - Math.sin(angle) * (pz - oz);
    qz -= 0.05;
  }

  const result = new Vector3(qx, qy, qz);
  return result;
}