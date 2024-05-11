/* eslint-disable @typescript-eslint/no-explicit-any */
import { Euler, Quaternion, Vector3 } from 'three'
import { TFVectorPose } from '../Types'
import { PoseIndices, Vector3_Right, Vector3_Up } from '../constants'
import { getQuaternionFromPointsAlongPlane } from './getQuaternionFromPointsAlongPlane'
import { mocapComponent } from '../../mocapComponent'
import { calculateGroundedFeet } from './calculateGroundedFeet'

const spineRotation = new Quaternion();
const shoulderRotation = new Quaternion();
const hipCenter = new Vector3();
const fallbackShoulderQuaternion = new Quaternion();
const hipToShoulderQuaternion = new Quaternion();
const threshhold = 0.6;
const vec3 = new Vector3();
const hipsPos = new Vector3();

export const solveSpine = (
  vrm: any,
  lowestWorldY: number,
  landmarks: TFVectorPose,
  trackingLowerBody: boolean
) => {
  const rightHip = landmarks[PoseIndices.RIGHT_HIP];
  const leftHip = landmarks[PoseIndices.LEFT_HIP];

  if (!rightHip || !leftHip) return;

  const rightShoulder = landmarks[PoseIndices.RIGHT_SHOULDER];
  const leftShoulder = landmarks[PoseIndices.LEFT_SHOULDER];

  if (rightShoulder.visibility! < threshhold || leftShoulder.visibility! < threshhold) return;

  // maintain default orientation - still parented and can still move, but no rotations applied.
  spineRotation.identity();
  shoulderRotation.identity();

  // lm coords are in normalized space (0 bottom of screen, 1 top of screen). Convert to world space
  // where a higher y represents a lower position in the world with lowestY (actually highest y val) as a reference point.
  // Subtract the lm.y coord from the lowestY to flip the coord system so that higher val is lower in world.
  const hipleft = new Vector3(rightHip.x, lowestWorldY - rightHip.y, rightHip.z);
  const hipright = new Vector3(leftHip.x, lowestWorldY - leftHip.y, leftHip.z);

  if (trackingLowerBody) {
    const feetGrounded = calculateGroundedFeet(landmarks);
    for (let i = 0; i < 2; i++) {
      if (feetGrounded && feetGrounded[i]) {
        const footLandmark = landmarks[i === 0 ? PoseIndices.RIGHT_ANKLE : PoseIndices.LEFT_ANKLE].y;
        const footY = footLandmark * -1 + vrm.current.humanoid.humanBones.Hips.node.position.y;
        mocapComponent.schema.footOffset = footY;
      }
    }
    hipCenter.copy(hipleft).add(hipright).multiplyScalar(0.5);
    // perhaps implement a solve feet in here later?
    // .... solve feet .....
  } else {
    // without accurate measures to estimate hip height, use default for a constant, non dynamic hip position
    const hipsWorld = vrm.current.humanoid.rawHumanBones.hips.node.getWorldPosition(hipsPos);
    hipCenter.copy(new Vector3(0, hipsWorld.y, 0));
  }

  const shoulderLeft = new Vector3(-rightShoulder.x, lowestWorldY - rightShoulder.y, -rightShoulder.z);
  const shoulderRight = new Vector3(-leftShoulder.x, lowestWorldY - leftShoulder.y, -leftShoulder.z);

  const shoulderCenter = new Vector3().copy(shoulderLeft).add(shoulderRight).multiplyScalar(0.5);
  hipToShoulderQuaternion.setFromUnitVectors(Vector3_Up, vec3.subVectors(shoulderCenter, hipCenter).normalize());

  /**@todo better hips rotation calculation needed */
  const hipWorldQuaterion = getQuaternionFromPointsAlongPlane(
    hipright,
    hipleft,
    shoulderCenter,
    new Quaternion(),
    false
  )
  hipWorldQuaterion.multiply(new Quaternion().setFromEuler(new Euler(0, Math.PI, Math.PI)));

  // const restLegLeft = rig.vrm.humanoid.normalizedRestPose[VRMHumanBoneName.LeftUpperLeg]!
  // const restLegRight = rig.vrm.humanoid.normalizedRestPose[VRMHumanBoneName.RightUpperLeg]!
  // const averageHipToLegHeight = (restLegLeft.position![1] + restLegRight.position![1]) / 2

  // multiply the hip normal quaternion by the rotation of the hips around this ne
  // const hipPositionAlongPlane = new Vector3(0, -averageHipToLegHeight, 0)
  //   .applyQuaternion(hipToShoulderQuaternion)
  //   .add(hipCenter)

  if (trackingLowerBody) {
    mocapComponent.schema.hipRotation.x = hipWorldQuaterion.x
    mocapComponent.schema.hipRotation.y = hipWorldQuaterion.y
    mocapComponent.schema.hipRotation.z = hipWorldQuaterion.z
    mocapComponent.schema.hipRotation.w = hipWorldQuaterion.w
  } else {
    if (leftHip.visibility! + rightHip.visibility! > 1) {
      spineRotation.copy(hipWorldQuaterion);
    } else {
      fallbackShoulderQuaternion.setFromUnitVectors(
        Vector3_Right,
        new Vector3().subVectors(shoulderRight, shoulderLeft)
      );
      spineRotation.copy(fallbackShoulderQuaternion);
    }
  }
  hipWorldQuaterion.set(
    mocapComponent.schema.hipRotation.x,
    mocapComponent.schema.hipRotation.y,
    mocapComponent.schema.hipRotation.z,
    mocapComponent.schema.hipRotation.w
  );

  mocapComponent.schema.hipPosition.x = hipCenter.x
  mocapComponent.schema.hipPosition.y = hipCenter.y
  mocapComponent.schema.hipPosition.z = hipCenter.z
  mocapComponent.schema.rig["hips"].x = hipWorldQuaterion.x
  mocapComponent.schema.rig["hips"].y = hipWorldQuaterion.y
  mocapComponent.schema.rig["hips"].z = hipWorldQuaterion.z
  mocapComponent.schema.rig["hips"].w = hipWorldQuaterion.w

  mocapComponent.schema.rig["spine"].x = spineRotation.x
  mocapComponent.schema.rig["spine"].y = spineRotation.y
  mocapComponent.schema.rig["spine"].z = spineRotation.z
  mocapComponent.schema.rig["spine"].w = spineRotation.w

  mocapComponent.schema.rig["chest"].x = shoulderRotation.x
  mocapComponent.schema.rig["chest"].y = shoulderRotation.y
  mocapComponent.schema.rig["chest"].z = shoulderRotation.z
  mocapComponent.schema.rig["chest"].w = shoulderRotation.w
}