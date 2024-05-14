import { Quaternion, Vector3 } from 'three'
import { TFVectorPose } from '../Types'
import { mocapComponent } from '../../mocapComponent'
import { PoseIndices } from '../constants'

type ArmQuaternions = {
  r: Quaternion;
  l: Quaternion;
};

type ArmsCalculationResult = {
  UpperArm: ArmQuaternions;
  LowerArm: ArmQuaternions;
};

const rightStartPoint = new Vector3();
const rightMidPoint = new Vector3();
const rightEndPoint = new Vector3();
const rightVec3 = new Vector3();
const leftStartPoint = new Vector3();
const leftMidPoint = new Vector3();
const leftEndPoint = new Vector3();
const leftVec3 = new Vector3();
const rightAxis = new Vector3(1, 0, 0);
const leftAxis = new Vector3(-1, 0, 0);
const minimumVisibility = 0.75;

const UpperArm: ArmQuaternions = {
  r: new Quaternion(),
  l: new Quaternion()
}
const LowerArm: ArmQuaternions = {
  r: new Quaternion(),
  l: new Quaternion()
}

/**
 * Calculates the quaternions for the upper and lower arms based on filtered landmarks.
 *
 * @param {number} lowestWorldY - The lowest Y-coordinate in the world space.
 * @param {TFVectorPose} filteredLandmarks - The filtered, interpolated pose landmarks containing vectors and visibility.
 * @returns {{ UpperArm: { r: Quaternion, l: Quaternion }, LowerArm: { r: Quaternion, l: Quaternion } }} The calculated quaternions for the upper and lower arms.
 */
export const calcArms = (
  lowestWorldY: number,
  filteredLandmarks: TFVectorPose
): ArmsCalculationResult | undefined => {
  const rightStart = filteredLandmarks[PoseIndices.RIGHT_SHOULDER];
  const rightMid = filteredLandmarks[PoseIndices.RIGHT_ELBOW];
  const rightEnd = filteredLandmarks[PoseIndices.RIGHT_WRIST];

  const leftStart = filteredLandmarks[PoseIndices.LEFT_SHOULDER];
  const leftMid = filteredLandmarks[PoseIndices.LEFT_ELBOW];
  const leftEnd = filteredLandmarks[PoseIndices.LEFT_WRIST];

  if (!rightStart || !rightMid || !rightEnd || !leftStart || !leftMid || !leftEnd) return;

  // as long as the right arm is visible, calculate:
  if ((rightStart.visibility! + rightMid.visibility! + rightEnd.visibility!) / 3 > minimumVisibility) {

    rightStartPoint.set(rightStart.x, lowestWorldY - rightStart.y, -rightStart.z);
    rightMidPoint.set(rightMid.x, lowestWorldY - rightMid.y, -rightMid.z);
    rightEndPoint.set(rightEnd.x, lowestWorldY - rightEnd.y, -rightEnd.z);

    const rightStartQuaternion = new Quaternion().setFromUnitVectors(rightAxis, rightVec3.subVectors(rightStartPoint, rightMidPoint).normalize());
    const rightMidQuaternion = new Quaternion().setFromUnitVectors(rightAxis, rightVec3.subVectors(rightMidPoint, rightEndPoint).normalize());

    const rightStartLocal = new Quaternion().copy(rightStartQuaternion);
    rightStartLocal.premultiply(
      new Quaternion(
        mocapComponent.schema.rig["chest"].x,
        mocapComponent.schema.rig["chest"].y,
        mocapComponent.schema.rig["chest"].z,
        mocapComponent.schema.rig["chest"].w
      ).invert()
    );

    const rightMidLocal = new Quaternion().copy(rightMidQuaternion).premultiply(rightStartQuaternion.clone().invert());

    UpperArm.r.x = rightStartLocal.x;
    UpperArm.r.y = rightStartLocal.y;
    UpperArm.r.z = rightStartLocal.z;
    UpperArm.r.w = rightStartLocal.w;

    LowerArm.r.x = rightMidLocal.x;
    LowerArm.r.y = rightMidLocal.y;
    LowerArm.r.z = rightMidLocal.z;
    LowerArm.r.w = rightMidLocal.w;
  }

  // as long as the left arm is visible, calculate:
  if ((leftStart.visibility! + leftMid.visibility! + leftEnd.visibility!) / 3 > minimumVisibility) {
    leftStartPoint.set(leftStart.x, lowestWorldY - leftStart.y, -leftStart.z);
    leftMidPoint.set(leftMid.x, lowestWorldY - leftMid.y, -leftMid.z);
    leftEndPoint.set(leftEnd.x, lowestWorldY - leftEnd.y, -leftEnd.z);

    const leftStartQuaternion = new Quaternion().setFromUnitVectors(leftAxis, leftVec3.subVectors(leftStartPoint, leftMidPoint).normalize());
    const leftMidQuaternion = new Quaternion().setFromUnitVectors(leftAxis, leftVec3.subVectors(leftMidPoint, leftEndPoint).normalize());

    const leftStartLocal = new Quaternion().copy(leftStartQuaternion);
    leftStartLocal.premultiply(
      new Quaternion(
        mocapComponent.schema.rig["chest"].x,
        mocapComponent.schema.rig["chest"].y,
        mocapComponent.schema.rig["chest"].z,
        mocapComponent.schema.rig["chest"].w
      ).invert()
    );

    const leftMidLocal = new Quaternion().copy(leftMidQuaternion).premultiply(leftStartQuaternion.clone().invert());

    UpperArm.l.x = leftStartLocal.x;
    UpperArm.l.y = leftStartLocal.y;
    UpperArm.l.z = leftStartLocal.z;
    UpperArm.l.w = leftStartLocal.w;

    LowerArm.l.x = leftMidLocal.x;
    LowerArm.l.y = leftMidLocal.y;
    LowerArm.l.z = leftMidLocal.z;
    LowerArm.l.w = leftMidLocal.w;
  }

  return {
    UpperArm,
    LowerArm
  }
}