/* eslint-disable @typescript-eslint/no-explicit-any */
import { Euler, Quaternion, Vector3 } from 'three'
import { TFVectorPose } from '../Types'
import { PoseIndices } from '../constants'
import { getQuaternionFromPointsAlongPlane } from './getQuaternionFromPointsAlongPlane'
import { mocapComponent } from '../../mocapComponent'

const spineRotation = new Quaternion();
const shoulderRotation = new Quaternion();
const hipCenter = new Vector3();
const fallbackShoulderQuaternion = new Quaternion();
const hipToShoulderQuaternion = new Quaternion();
const threshhold = 0.6;

export const solveSpine = (
  vrm: any,
  lowestWorldY: number,
  landmarks: TFVectorPose,
  trackingLowerBody: boolean
) => {
  const rightHip = landmarks[PoseIndices.RIGHT_HIP]
  const leftHip = landmarks[PoseIndices.LEFT_HIP]

  if (!rightHip || !leftHip) return

  const rightShoulder = landmarks[PoseIndices.RIGHT_SHOULDER]
  const leftShoulder = landmarks[PoseIndices.LEFT_SHOULDER]

  if (rightShoulder.visibility! < threshhold || leftShoulder.visibility! < threshhold) return

  spineRotation.identity()
  shoulderRotation.identity()

  const hipleft = new Vector3(rightHip.x, lowestWorldY - rightHip.y, rightHip.z)
  const hipright = new Vector3(leftHip.x, lowestWorldY - leftHip.y, leftHip.z)

  if (trackingLowerBody) {
    for (let i = 0; i < 2; i++) {
      if (feetGrounded[i]) {
        const footLandmark =
          landmarks[i == feetIndices.rightFoot ? PoseIndices.RIGHT_ANKLE : PoseIndices.LEFT_ANKLE].y
        const footY = footLandmark * -1 + vrm.current.humanoid.humanBones.Hips.node.position.y;
        MotionCaptureRigComponent.footOffset[entity] = footY
      }
    }
    hipCenter.copy(hipleft).add(hipright).multiplyScalar(0.5)
  } else {
    hipCenter.copy(new Vector3(0, avatar.hipsHeight, 0))
  }

  const shoulderLeft = new Vector3(-rightShoulder.x, lowestWorldY - rightShoulder.y, -rightShoulder.z)
  const shoulderRight = new Vector3(-leftShoulder.x, lowestWorldY - leftShoulder.y, -leftShoulder.z)

  const shoulderCenter = new Vector3().copy(shoulderLeft).add(shoulderRight).multiplyScalar(0.5)
  hipToShoulderQuaternion.setFromUnitVectors(Vector3_Up, vec3.subVectors(shoulderCenter, hipCenter).normalize())

  /**@todo better hips rotation calculation needed */
  const hipWorldQuaterion = getQuaternionFromPointsAlongPlane(
    hipright,
    hipleft,
    shoulderCenter,
    new Quaternion(),
    false
  )
  hipWorldQuaterion.multiply(new Quaternion().setFromEuler(new Euler(0, Math.PI, Math.PI)))

  // const restLegLeft = rig.vrm.humanoid.normalizedRestPose[VRMHumanBoneName.LeftUpperLeg]!
  // const restLegRight = rig.vrm.humanoid.normalizedRestPose[VRMHumanBoneName.RightUpperLeg]!
  // const averageHipToLegHeight = (restLegLeft.position![1] + restLegRight.position![1]) / 2

  // multiply the hip normal quaternion by the rotation of the hips around this ne
  // const hipPositionAlongPlane = new Vector3(0, -averageHipToLegHeight, 0)
  //   .applyQuaternion(hipToShoulderQuaternion)
  //   .add(hipCenter)

  if (trackingLowerBody) {
    MotionCaptureRigComponent.hipRotation.x = hipWorldQuaterion.x
    MotionCaptureRigComponent.hipRotation.y = hipWorldQuaterion.y
    MotionCaptureRigComponent.hipRotation.z = hipWorldQuaterion.z
    MotionCaptureRigComponent.hipRotation.w = hipWorldQuaterion.w
  } else {
    if (leftHip.visibility! + rightHip.visibility! > 1) spineRotation.copy(hipWorldQuaterion)
    else {
      fallbackShoulderQuaternion.setFromUnitVectors(
        Vector3_Right,
        new Vector3().subVectors(shoulderRight, shoulderLeft)
      )
      spineRotation.copy(fallbackShoulderQuaternion)
    }
  }
  hipWorldQuaterion.set(
    MotionCaptureRigComponent.hipRotation.x,
    MotionCaptureRigComponent.hipRotation.y,
    MotionCaptureRigComponent.hipRotation.z,
    MotionCaptureRigComponent.hipRotation.w
  )

  MotionCaptureRigComponent.hipPosition.x = hipCenter.x
  MotionCaptureRigComponent.hipPosition.y = hipCenter.y
  MotionCaptureRigComponent.hipPosition.z = hipCenter.z
  mocapComponent.schema.rig[VRMHumanBoneName.Hips].x = hipWorldQuaterion.x
  mocapComponent.schema.rig[VRMHumanBoneName.Hips].y = hipWorldQuaterion.y
  mocapComponent.schema.rig[VRMHumanBoneName.Hips].z = hipWorldQuaterion.z
  mocapComponent.schema.rig[VRMHumanBoneName.Hips].w = hipWorldQuaterion.w

  mocapComponent.schema.rig[VRMHumanBoneName.Spine].x = spineRotation.x
  mocapComponent.schema.rig[VRMHumanBoneName.Spine].y = spineRotation.y
  mocapComponent.schema.rig[VRMHumanBoneName.Spine].z = spineRotation.z
  mocapComponent.schema.rig[VRMHumanBoneName.Spine].w = spineRotation.w

  mocapComponent.schema.rig[VRMHumanBoneName.Chest].x = shoulderRotation.x
  mocapComponent.schema.rig[VRMHumanBoneName.Chest].y = shoulderRotation.y
  mocapComponent.schema.rig[VRMHumanBoneName.Chest].z = shoulderRotation.z
  mocapComponent.schema.rig[VRMHumanBoneName.Chest].w = shoulderRotation.w
}