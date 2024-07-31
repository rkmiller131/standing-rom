import { clamp } from 'three/src/math/MathUtils.js';
import Vector from '../constants/Vector';
import { PI, RIGHT, Side } from '../constants/Types';
import Euler from '../constants/Euler';

export const offsets = {
  upperLeg: {
    z: 0.1,
  },
};

/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} UpperLeg : normalized rotation values
 * @param {Object} LowerLeg : normalized rotation values
 * @param {Side} side : left or right
 */
export const rigLeg = (
  UpperLeg: Vector,
  LowerLeg: Vector,
  side: Side = RIGHT,
) => {
  const invert = side === RIGHT ? 1 : -1;

  const rigedUpperLeg = new Euler({
    x: clamp(UpperLeg.x, 0, 0.5) * PI,
    y: clamp(UpperLeg.y, -0.25, 0.25) * PI,
    z: clamp(UpperLeg.z, -0.5, 0.5) * PI + invert * offsets.upperLeg.z,
    rotationOrder: 'XYZ',
  });
  const rigedLowerLeg = new Euler({
    x: LowerLeg.x * PI,
    y: LowerLeg.y * PI,
    z: LowerLeg.z * PI,
  });

  return {
    UpperLeg: rigedUpperLeg,
    LowerLeg: rigedLowerLeg,
  };
};