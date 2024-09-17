import { Vector3 } from 'three';
import { avatarProportions } from '../avatar/setupAvatarProportions';
import { calcArcCoordinates } from '../math/calcArcCoordinates';

/**
 * Generates an array of bubble entities based on the specified number of repetitions and spawn side.
 * Each bubble entity represents a position in 3D space determined by the spawn side and the number of repetitions.
 * The function calculates positions for bubbles to be spawned around an avatar model, taking into account different spawn sides.
 *
 * @param {number} reps - The number of repetitions for generating bubble target positions.
 * @param {'right'|'left'|'frontR'|'frontL'|'crossR'|'crossL'} spawnSide - The side of the avatar from which the bubbles should spawn.
 * @returns {Array<Object>} An array of bubble entities, each containing an `age`, `spawnPosition`, and `active` property.
 */
export default function generateBubbles(
  reps: number,
  spawnSide: 'right' | 'left' | 'frontR' | 'frontL' | 'crossR' | 'crossL',
) {
  const bubbles = [];
  let origin = avatarProportions.spinePos;
  let startPosition, spawnPos;

  const startAngle =
    spawnSide !== 'crossL' && spawnSide !== 'crossR' ? 0 : Math.PI / 2;
  const endAngle =
    spawnSide !== 'crossL' && spawnSide !== 'crossR' ? Math.PI - 1.31 : Math.PI;
  const midAngle = (endAngle - startAngle) / 2;
  const angleIncrement = (endAngle - startAngle) / (reps - 1);

  for (let i = 0; i < reps; i++) {
    let angle = startAngle + i * angleIncrement;

    if (spawnSide === 'left') {
      // left hand position
      startPosition = new Vector3(
        -0.6 * avatarProportions.armLength,
        avatarProportions.handHeight,
        0,
      ).add(avatarProportions.avatarPos);
    } else if (spawnSide === 'right') {
      // right hand position
      startPosition = new Vector3(
        0.6 * avatarProportions.armLength,
        avatarProportions.handHeight,
        0,
      ).add(avatarProportions.avatarPos);
    } else if (spawnSide === 'frontL') {
      // left hand front position
      startPosition = new Vector3(
        -0.3 * avatarProportions.armLength,
        avatarProportions.handHeight,
        -0.2 * avatarProportions.armLength,
      ).add(avatarProportions.avatarPos);
    } else if (spawnSide === 'frontR') {
      // right hand front position
      startPosition = new Vector3(
        0.3 * avatarProportions.armLength,
        avatarProportions.handHeight,
        -0.2 * avatarProportions.armLength,
      ).add(avatarProportions.avatarPos);
    } else if (spawnSide === 'crossL') {
      // left shoulder position
      startPosition = new Vector3(
        -0.5 * avatarProportions.armLength,
        0.75 * avatarProportions.shoulderHeight,
        0,
      ).add(avatarProportions.avatarPos);
      // update with the actual origin of the left shoulder plus some extra -z(?)  [M: 1.53 / W: 1.46 avatarProportions.shoulderHeight]
      origin = new Vector3(-0.2, 0.8, -0.05).add(avatarProportions.avatarPos);
    } else if (spawnSide === 'crossR') {
      // right shoulder position
      startPosition = new Vector3(
        0.5 * avatarProportions.armLength,
        0.75 * avatarProportions.shoulderHeight,
        0,
      ).add(avatarProportions.avatarPos);
      origin = new Vector3(0.2, 0.8, -0.05).add(avatarProportions.avatarPos);
    }

    if (reps === 1) {
      angle = midAngle; // edge case fix: selecting 1 set and 1 rep needs an angle calc accommodation
    }

    if (spawnSide === 'left' || spawnSide === 'crossL') {
      angle = -angle; // necessary to mirror coordinates
    }

    // ---------------------------------------------------------------------------------------------------------------------------------
    // No longer have linear cross body bubbles (not going from hand to cross shoulder, but rather an arc of t pose to opposite shoulder)
    // Saving for reference later in case linear cross body is used --------------------------------------------------------------------
    // ---------------------------------------------------------------------------------------------------------------------------------
    // if (spawnSide === 'crossL' || spawnSide === 'crossR') {
    //   const endPosition = spawnSide === 'crossL' ? rightShoulderPosition : leftShoulderPosition;
    //   spawnPos = calculateLinearCoordinates(startPosition!, endPosition, numTargets, i);

    // } else {
    //   spawnPos = calculateArcCoordinates(avatarProportions.spinePos, spawnSide, startPosition!, angle);
    // }

    // ---------------------------------------------------------------------------------------------------------------------------------
    // Changing the linear coordinates to frontal raises instead of cross body - more consistent with the actual PT but hard to track
    // with a single web cam - the arm doesn't fully extend, so maybe still compensate with the frontal arc raises
    // ---------------------------------------------------------------------------------------------------------------------------------
    // if (spawnSide === 'frontL' || spawnSide === 'frontR') {
    //   const endPosition = spawnSide === 'frontL' ? new Vector3(-0.2, 0.8, -0.05).add(avatarProportions.avatarPos) : new Vector3(0.2, 0.8, -0.05).add(avatarProportions.avatarPos);
    //   spawnPos = calculateLinearCoordinates(startPosition!, endPosition, numTargets, i);
    // } else {
    //   spawnPos = calculateArcCoordinates(origin, spawnSide, startPosition!, angle);
    // }

    spawnPos = calcArcCoordinates(origin, spawnSide, startPosition!, angle);

    const bubbleEntity = {
      age: 0,
      spawnPosition: spawnPos,
      active: false,
    };

    if (spawnSide === 'crossL') {
      bubbles.unshift(bubbleEntity); // hot fix; these need to be in reverse order for this edge case
    } else {
      bubbles.push(bubbleEntity);
    }
  }
  return bubbles;
}
