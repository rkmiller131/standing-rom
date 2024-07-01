import { Vector3 } from 'three';
import { avatarProportions } from '../../avatar/helpers/setupAvatarProportions';
import { calculateArcCoordinates } from './calculateArcCoordinates';

export default function generateBubbles(reps: number, spawnSide: 'right' | 'left' | 'frontR' | 'frontL' | 'crossR' | 'crossL') {
  const bubbles = [];
  let origin = avatarProportions.spinePos;
  let startPosition, spawnPos;

  const startAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? 0 : Math.PI / 2;
  const endAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? Math.PI - 1.31 : Math.PI;
  const midAngle = (endAngle - startAngle) / 2;
  const angleIncrement = (endAngle - startAngle) / (reps - 1);

  for (let i = 0; i < reps; i++) {
    let angle = startAngle + i * angleIncrement;

    if (spawnSide === 'left') {
      // left hand position
      startPosition = new Vector3(-0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'right') {
      // right hand position
      startPosition = new Vector3(0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'frontL') {
      // left hand front position
      startPosition = new Vector3(-0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'frontR') {
      // right hand front position
      startPosition = new Vector3(0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'crossL') {
      // left shoulder position
      startPosition = new Vector3(-0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos);
      // update with the actual origin of the left shoulder plus some extra -z(?)
      origin = new Vector3(-0.2, 0.8, -0.05).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'crossR') {
      // right shoulder position
      startPosition = new Vector3(0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos);

      origin = new Vector3(0.2, 0.8, -0.05).add(avatarProportions.avatarPos);
    }

    if (reps === 1) {
      angle = midAngle; // edge case fix: selecting 1 set and 1 rep needs an angle calc accommodation
    }

    if (spawnSide === 'left' || spawnSide === 'crossL') {
      angle = -angle // necessary to mirror coordinates
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

    spawnPos = calculateArcCoordinates(origin, spawnSide, startPosition!, angle);

    const bubbleEntity = {
      age: 0,
      spawnPosition: spawnPos,
      active: false
    }

    bubbles.push(bubbleEntity);
  }
  return bubbles;
}