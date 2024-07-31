import { clamp } from 'three/src/math/MathUtils.js';
import Vector from '../constants/Vector';
import { PI, RIGHT, Side } from '../constants/Types';

/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} UpperArm : normalized rotation values
 * @param {Object} LowerArm : normalized rotation values
 * @param {Object} Hand : normalized rotation values
 * @param {Side} side : left or right
 */
export const rigArm = (UpperArm: Vector, LowerArm: Vector, Hand: Vector, side: Side = RIGHT) => {
  // Invert modifier based on left vs right side
  const invert = side === RIGHT ? 1 : -1;

  //            -2.3
  UpperArm.z *= -2.5 * invert;
  // UpperArm.z *= PI * invert;
  // UpperArm.z -= Math.min(LowerArm.z, 0); // might need to be the shoulder to hip point
  // UpperArm.z -= -invert * Math.max(LowerArm.x, 0); // might need to be x?

  //Modify UpperArm rotationY as influenced by  position of lowerarm and hand vectors
  UpperArm.y *= PI * invert; // flip on y axis (upside down)
  UpperArm.y -= Math.max(LowerArm.x, 0); // align upper arm's y rotation with position of  lower arm along x axis
  UpperArm.y -= -invert * Math.max(LowerArm.z, 0);
  UpperArm.x -= 0.2 * invert; // 0.3

  LowerArm.z *= -2.14 * invert;
  LowerArm.y *= 2.5 * invert; // 2.14
  LowerArm.x *= 2.5 * invert; // 2.14

  //Clamp values to human limits
  UpperArm.x = clamp(UpperArm.x, -0.5, PI);
  LowerArm.x = clamp(LowerArm.x, -0.3, 0.3);

  Hand.y = clamp(Hand.z * 2, -0.5, 0.5); //side to side
  Hand.z = Hand.z * -2.6 * invert; //up down

  return {
      //Returns Values in Radians for direct 3D usage
      UpperArm: UpperArm,
      LowerArm: LowerArm,
      Hand: Hand,
  };
};