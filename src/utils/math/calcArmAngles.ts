import { Euler, MathUtils, Quaternion } from 'three';
import { VRM } from '../../interfaces/THREE_Interface';

const ninetyDegreeAdjust = new Euler(0, 0, Math.PI / 2);
const rotatedLeftArm = new Quaternion().setFromEuler(ninetyDegreeAdjust);
const rotatedRightArm = new Quaternion().setFromEuler(ninetyDegreeAdjust);
const leftArmAngleEuler = new Euler();
const rightArmAngleEuler = new Euler();

/**
 * Calculates the angles of the left and right arms of a VRM model.
 *
 * @param {React.RefObject<VRM>} vrm - A reference object to the VRM model.
 * @returns {{ leftArmAngle: number, rightArmAngle: number }} The angles of the left and right arms in degrees.
 */
export default function calcArmAngles(vrm: React.RefObject<VRM>): {
  leftArmAngle: number;
  rightArmAngle: number;
} {
  const leftArmQuat = vrm.current!.humanoid.humanBones.leftUpperArm.node.quaternion;
  const rightArmQuat = vrm.current!.humanoid.humanBones.rightUpperArm.node.quaternion;

  const updatedLeftArmQuat = leftArmQuat.clone().multiply(rotatedLeftArm);
  const updatedRightArmQuat = rightArmQuat.clone().multiply(rotatedRightArm);

  leftArmAngleEuler.setFromQuaternion(updatedLeftArmQuat);
  rightArmAngleEuler.setFromQuaternion(updatedRightArmQuat);

  const leftArmAngleFlipped = Math.round(
    MathUtils.radToDeg(leftArmAngleEuler.z),
  );
  const rightArmAngleFlipped = Math.round(
    180 - MathUtils.radToDeg(rightArmAngleEuler.z),
  );

  const leftArmAngle = Math.abs(180 - leftArmAngleFlipped);
  const rightArmAngle = Math.abs(180 - rightArmAngleFlipped);

  return { leftArmAngle, rightArmAngle };
}
