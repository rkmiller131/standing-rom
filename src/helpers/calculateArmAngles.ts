import { VRM } from "@pixiv/three-vrm";
import { Euler, MathUtils, Quaternion } from "three";

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

export default function calculateArmAngles(vrm: React.RefObject<VRM>): {
  leftArmAngle: number;
  rightArmAngle: number;
} {
  // const leftArmQuat = vrm.current!.humanoid.normalizedHumanBones.leftUpperArm.node.quaternion;
  // const rightArmQuat = vrm.current!.humanoid.normalizedHumanBones.rightUpperArm.node.quaternion;

  // // rotatedLeftArm.setFromEuler(ninetyDegreeAdjust);
  // // rotatedRightArm.setFromEuler(ninetyDegreeAdjust);

  // const updatedLeftArmQuat = leftArmQuat!.multiply(rotatedLeftArm);
  // const updatedRightArmQuat = rightArmQuat!.multiply(rotatedRightArm);

  // leftArmAngleEuler.setFromQuaternion(updatedLeftArmQuat);
  // rightArmAngleEuler.setFromQuaternion(updatedRightArmQuat);
  // // console.log('~~ left Arm quaternion normalized vs normal bone quat ', leftArmQuat)
  // // console.log('~~ not normalized lefty ', vrm.current?.humanoid.humanBones.leftUpperArm.node.quaternion)

  // leftArmAngleEuler.setFromQuaternion(leftArmQuat);
  // rightArmAngleEuler.setFromQuaternion(rightArmQuat);

  // const leftArmAngle = Math.round(MathUtils.radToDeg(leftArmAngleEuler.z));
  // const rightArmAngle = Math.round(180 - MathUtils.radToDeg(rightArmAngleEuler.z));

  // -----------------------------------------------------------------------------------------
  // const leftArmQuat = vrm.current!.humanoid.humanBones.leftUpperArm.node.quaternion;
  // const leftArmEuler = new Euler().setFromQuaternion(leftArmQuat!);

  // const leftArmAngle = Math.round(MathUtils.radToDeg(leftArmEuler.x));

  // const rightArmQuat = vrm.current!.humanoid.humanBones.rightUpperArm.node.quaternion;
  // const rightArmEuler = new Euler().setFromQuaternion(rightArmQuat);

  // const rightArmAngle = Math.round(MathUtils.radToDeg(rightArmEuler.x));

  // -------------------------------------------------------------------------------------------

  const ninetyDegreeAdjust = new Euler(0, 0, Math.PI / 2);
  const leftArmQuat =
    vrm.current!.humanoid.humanBones.leftUpperArm.node.quaternion;
  const rightArmQuat =
    vrm.current!.humanoid.humanBones.rightUpperArm.node.quaternion;

  const rotatedLeftArm = new Quaternion().setFromEuler(ninetyDegreeAdjust);
  const rotatedRightArm = new Quaternion().setFromEuler(ninetyDegreeAdjust);

  const updatedLeftArmQuat = leftArmQuat.clone().multiply(rotatedLeftArm);
  const updatedRightArmQuat = rightArmQuat.clone().multiply(rotatedRightArm);

  const leftArmAngleEuler = new Euler().setFromQuaternion(updatedLeftArmQuat);
  const rightArmAngleEuler = new Euler().setFromQuaternion(updatedRightArmQuat);

  const leftArmAngle = Math.round(MathUtils.radToDeg(leftArmAngleEuler.z));
  const rightArmAngle = Math.round(
    180 - MathUtils.radToDeg(rightArmAngleEuler.z)
  );

  return { leftArmAngle, rightArmAngle };
}
