import { IHips, MPVectorPose } from '../constants/Types';
import { clamp } from 'three/src/math/MathUtils.js';
import { rigHips } from '../rigging/rigHips';
import Vector from '../constants/Vector';

/**
 * Calculates Hip rotation and world position
 * @param {Array} lm3d : array of 3D pose vectors from mediapipe
 * @param {Array} lm2d : array of 2D pose vectors from mediapipe
 */
export const calcHips = (lm3d: MPVectorPose, lm2d: Omit<MPVectorPose, 'z'>) => {
  //Find 2D normalized Hip and Shoulder Joint Positions/Distances
  const hipLeft2d = Vector.fromArray(lm2d[23]);
  const hipRight2d = Vector.fromArray(lm2d[24]);
  const shoulderLeft2d = Vector.fromArray(lm2d[11]);
  const shoulderRight2d = Vector.fromArray(lm2d[12]);
  const hipCenter2d = hipLeft2d.lerp(hipRight2d, 1);
  const shoulderCenter2d = shoulderLeft2d.lerp(shoulderRight2d, 1);
  const spineLength = hipCenter2d.distance(shoulderCenter2d);

  const hips: IHips = {
    position: {
      x: clamp(hipCenter2d.x - 0.4, -1, 1), //subtract .4 to bring closer to 0,0 center
      y: 0,
      z: clamp(spineLength - 1, -2, 0),
    },
  };
  hips.worldPosition = {
    x: hips.position.x,
    y: 0,
    z: hips.position.z * Math.pow(hips.position.z * -2, 2),
  };
  hips.worldPosition.x *= hips.worldPosition.z;

  hips.rotation = Vector.rollPitchYaw(lm3d[23], lm3d[24]);
  // fix -PI, PI jumping
  if (hips.rotation.y > 0.5) {
    hips.rotation.y -= 2;
  }
  hips.rotation.y += 0.5;
  // Stop jumping between left and right shoulder tilt
  if (hips.rotation.z > 0) {
    hips.rotation.z = 1 - hips.rotation.z;
  }
  if (hips.rotation.z < 0) {
    hips.rotation.z = -1 - hips.rotation.z;
  }
  const turnAroundAmountHips = remap(Math.abs(hips.rotation.y), 0.2, 0.4);
  hips.rotation.z *= 1 - turnAroundAmountHips;
  hips.rotation.x = 0; //temp fix for inaccurate X axis

  const spine = Vector.rollPitchYaw(lm3d[11], lm3d[12]);
  // fix -PI, PI jumping
  if (spine.y > 0.5) {
    spine.y -= 2;
  }
  spine.y += 0.5;
  // Stop jumping between left and right shoulder tilt
  if (spine.z > 0) {
    spine.z = 1 - spine.z;
  }
  if (spine.z < 0) {
    spine.z = -1 - spine.z;
  }
  // fix weird large numbers when 2 shoulder points get too close
  const turnAroundAmount = remap(Math.abs(spine.y), 0.2, 0.4);
  spine.z *= 1 - turnAroundAmount;
  spine.x = 0; //temp fix for inaccurate X axis

  return rigHips(hips, spine);
};

/**
 * Returns a remapped value between 0 and 1 using min and max values
 * @param {Number} value : transformed value
 * @param {Number} min : minimum value
 * @param {Number} max : maximum value
 */
export function remap (val: number, min: number, max: number) {
  //returns min to max -> 0 to 1
  return (clamp(val, min, max) - min) / (max - min);
};