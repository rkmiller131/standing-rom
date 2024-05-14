/* eslint-disable @typescript-eslint/no-explicit-any */
import { VRM, VRMHumanBoneName } from '@pixiv/three-vrm';
import { Euler, MathUtils, Matrix4, Quaternion, Vector3 } from 'three'
import { Object3DUtils } from './Object3DUtils';

// const rotate90degreesAroundXAxis = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), -Math.PI / 2)

// Animate Rotation -----------------------------------------------
export const rigRotation = (
  vrm: any,
  name: string,
  rotation: Quaternion,
  lerpAmount = 0.3
) => {
  if (!vrm.current || !vrm.current.humanoid || !vrm.current.humanoid.humanBones[name]) return;

  const Part = vrm.current.humanoid.humanBones[name];
  if (!Part.node) {
    console.error(`Node not found for bone: ${name}`);
    return;
  }

  // const targetRotation = new Quaternion(
  //   rotation.x,
  //   rotation.y,
  //   rotation.z,
  //   rotation.w
  // );
  Part.node.quaternion.slerp(rotation, lerpAmount)
};

// original kalidokit solver for rig rotation - vector3 instead of quaternion
export const rigRotation2 = (
  vrm: any,
  name: string,
  rotation = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!vrm.current || !vrm.current.humanoid || !vrm.current.humanoid.humanBones[name]) return;

  const Part = vrm.current.humanoid.humanBones[name];
  if (!Part.node) {
    console.error(`Node not found for bone: ${name}`);
    return;
  }

  const euler = new Euler(
    rotation.x * dampener,
    rotation.y * dampener,
    rotation.z * dampener
  );
  const quaternion = new Quaternion().setFromEuler(euler);
  Part.node.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

// Animate Position -----------------------------------------------
export const rigPosition = (
  vrm: any,
  name: string,
  position = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!vrm.current || !vrm.current.humanoid || !vrm.current.humanoid.humanBones[name]) return;

  const Part = vrm.current.humanoid.humanBones[name];
  if (!Part.node) {
    console.error(`Node not found for bone: ${name}`);
    return;
  }
  if (!Part) {return}
  const vector = new Vector3(
    position.x * dampener,
    position.y * dampener,
    position.z * dampener
  );
  Part.position.lerp(vector, lerpAmount); // interpolate
  // Part.position.add(vector)
};

// FROM EE IK ALGORITHMS --------------------------------------------
const mat4 = new Matrix4();
const _quat = new Quaternion();
const _vector3 = new Vector3();
const handLocalPosition = new Vector3();

export const getArmIKHint = (
  vrm: any,
  shoulderWorldPosition: Vector3,
  side: 'left' | 'right',
  hint: Vector3
) => {
  // transform component for the whole avatar, essentially (pos, rotation of whole vrm)
  const transform = vrm.current.scene;
  const hand = vrm.current.humanoid.humanBones[side + 'Hand'].node;
  // make a line pointing in the oppopsite direction the fingers are pointing
  // traverse the line back by the length of the forearm

  const avatarInverseMatrix = mat4.copy(transform.matrixWorld).invert()
  handLocalPosition.copy(hand.position).applyMatrix4(avatarInverseMatrix)

  const handLocalQuat = _quat.copy(transform.rotation).invert().multiply(hand.rotation)
  hint
    .set(side === 'left' ? -0.25 : 0.25, -0.25, 0)
    .applyQuaternion(handLocalQuat)
    .add(handLocalPosition)

  // ensure hint stays out of body
  const shoulderLocalPosition = _vector3.copy(shoulderWorldPosition).applyMatrix4(avatarInverseMatrix)
  hint.x =
    side === 'left'
      ? Math.max(hint.x, shoulderLocalPosition.x + 0.05)
      : Math.min(hint.x, shoulderLocalPosition.x - 0.05)
  hint.applyMatrix4(transform.matrixWorld)
}

// EE UPPER AND LOWER ARM/LEG IK SOLVER -----------------------------------------------
const targetPos = new Vector3(),
  rootBoneWorldPosition = new Vector3(),
  midBoneWorldPosition = new Vector3(),
  tipBoneWorldPosition = new Vector3(),
  rotAxis = new Vector3(),
  rootToMidVector = new Vector3(),
  midToTipVector = new Vector3(),
  rootToTipVector = new Vector3(),
  rootToTargetVector = new Vector3(),
  rootToHintVector = new Vector3(),
  acNorm = new Vector3(),
  atNorm = new Vector3(),
  abProj = new Vector3(),
  ahProj = new Vector3(),
  targetRot = new Quaternion(),
  rot = new Quaternion()

export function solveTwoBoneIK(
  rootName: VRMHumanBoneName,
  midName: VRMHumanBoneName,
  tipName: VRMHumanBoneName,
  vrm: VRM,
  targetPosition: Vector3, // world space
  targetRotation: Quaternion, // world space
  rotationOffset: Quaternion | null = null,
  hint: Vector3 | null = null,
  targetPosWeight = 1,
  targetRotWeight = 0,
  hintWeight = 1
) {
  targetPos.copy(targetPosition)
  targetRot.copy(targetRotation)

  const rawRoot = vrm.humanoid.getRawBoneNode(rootName)!
  const rawMid = vrm.humanoid.getRawBoneNode(midName)!
  const rawTip = vrm.humanoid.getRawBoneNode(tipName)!
  const root = vrm.humanoid.getNormalizedBoneNode(rootName)!
  const mid = vrm.humanoid.getNormalizedBoneNode(midName)!
  const tip = vrm.humanoid.getNormalizedBoneNode(tipName)!

  rootBoneWorldPosition.setFromMatrixPosition(rawRoot.matrixWorld)
  midBoneWorldPosition.setFromMatrixPosition(rawMid.matrixWorld)
  tipBoneWorldPosition.setFromMatrixPosition(rawTip.matrixWorld)

  /** Apply target position weight */
  if (targetPosWeight) targetPos.lerp(tipBoneWorldPosition, 1 - targetPosWeight)

  rootToMidVector.subVectors(midBoneWorldPosition, rootBoneWorldPosition)
  midToTipVector.subVectors(tipBoneWorldPosition, midBoneWorldPosition)
  rootToTipVector.subVectors(tipBoneWorldPosition, rootBoneWorldPosition)
  rootToTargetVector.subVectors(targetPos, rootBoneWorldPosition)

  const rootToMidLength = rootToMidVector.length()
  const midToTipLength = midToTipVector.length()
  const rootToTipLength = rootToTipVector.length()
  const maxLength = rootToMidLength + midToTipLength
  if (rootToTargetVector.lengthSq() > maxLength * maxLength) {
    rootToTargetVector.normalize().multiplyScalar((rootToMidLength + midToTipLength) * 0.999)
  }

  const rootToTargetLength = rootToTargetVector.length()

  const hasHint = hint && hintWeight > 0
  if (hasHint) rootToHintVector.copy(hint).sub(rootBoneWorldPosition)

  const oldAngle = triangleAngle(rootToTipLength, rootToMidLength, midToTipLength)
  const newAngle = triangleAngle(rootToTargetLength, rootToMidLength, midToTipLength)
  const rotAngle = oldAngle - newAngle

  rotAxis.crossVectors(rootToMidVector, midToTipVector)

  rot.setFromAxisAngle(rotAxis.normalize(), rotAngle)
  Object3DUtils.premultiplyWorldQuaternion(mid, rot)

  Object3DUtils.updateParentsMatrixWorld(tip, 1)

  tipBoneWorldPosition.setFromMatrixPosition(rawTip.matrixWorld)
  rootToTipVector.subVectors(tipBoneWorldPosition, rootBoneWorldPosition)

  rot.setFromUnitVectors(acNorm.copy(rootToTipVector).normalize(), atNorm.copy(rootToTargetVector).normalize())
  Object3DUtils.premultiplyWorldQuaternion(root, rot)

  /** Apply hint */
  if (hasHint) {
    if (rootToTipLength > 0) {
      Object3DUtils.updateParentsMatrixWorld(tip, 2)
      root.quaternion.identity()
      midBoneWorldPosition.setFromMatrixPosition(rawMid.matrixWorld)
      tipBoneWorldPosition.setFromMatrixPosition(rawTip.matrixWorld)
      rootToMidVector.subVectors(midBoneWorldPosition, rootBoneWorldPosition)
      rootToTipVector.subVectors(tipBoneWorldPosition, rootBoneWorldPosition)

      acNorm.copy(rootToTipVector).divideScalar(rootToTipLength)
      abProj.copy(rootToMidVector).addScaledVector(acNorm, -rootToMidVector.dot(acNorm)) // Prependicular component of vector projection
      ahProj.copy(rootToHintVector).addScaledVector(acNorm, -rootToHintVector.dot(acNorm))

      if (ahProj.lengthSq() > 0) {
        rot.setFromUnitVectors(abProj, ahProj)
        if (hintWeight > 0) {
          rot.x *= hintWeight
          rot.y *= hintWeight
          rot.z *= hintWeight
          Object3DUtils.premultiplyWorldQuaternion(root, rot)
        }
      }
    }
  }
  /** Apply tip rotation */
  Object3DUtils.getWorldQuaternion(tip, tip.quaternion)
  /** Apply target rotation weight */
  if (targetRotWeight === 1) {
    tip.quaternion.copy(targetRot)
  } else if (targetRotWeight > 0) {
    tip.quaternion.fastSlerp(targetRot, targetRotWeight)
  }
  Object3DUtils.worldQuaternionToLocal(tip.quaternion, mid)
  if (rotationOffset != undefined) tip.quaternion.premultiply(rotationOffset)
}

// IK TWO BONE SOLVER HELPERS ------------------------------------------------------------
function triangleAngle(aLen: number, bLen: number, cLen: number): number {
  const c = MathUtils.clamp((bLen * bLen + cLen * cLen - aLen * aLen) / (bLen * cLen * 2), -1, 1)
  return Math.acos(c)
}