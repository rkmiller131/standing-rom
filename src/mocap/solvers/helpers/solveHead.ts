import { Quaternion, Vector3 } from 'three'
// import { NormalizedLandmark } from '../Types'
import { mocapComponent } from '../../mocapComponent'
import { VRMHumanBoneName } from '@pixiv/three-vrm'
// import { getQuaternionFromPointsAlongPlane } from './getQuaternionFromPointsAlongPlane'

const headRotation = new Quaternion();
// const leftEarVec3 = new Vector3();
// const rightEarVec3 = new Vector3();
// const noseVec3 = new Vector3();

const rotate90degreesAroundXAxis = new Quaternion().setFromAxisAngle(new Vector3(1, 0, 0), -Math.PI / 2);

/**
 * Solves the rotation of the head and updates the mocapComponent rig schema with quaternion values.
 * @param {NormalizedLandmark} leftEar - The landmark representing the position of the left ear.
 * @param {NormalizedLandmark} rightEar - The landmark representing the position of the right ear.
 * @param {NormalizedLandmark} nose - The landmark representing the position of the nose.
 */
export const solveHead = (
  // leftEar: NormalizedLandmark,
  // rightEar: NormalizedLandmark,
  // nose: NormalizedLandmark
) => {
  // leftEarVec3.set(-leftEar.x, -leftEar.y, -leftEar.z)
  // rightEarVec3.set(-rightEar.x, -rightEar.y, -rightEar.z)
  // noseVec3.set(-nose.x, -nose.y, -nose.z)

  // getQuaternionFromPointsAlongPlane(leftEarVec3, rightEarVec3, noseVec3, headRotation, true)

  headRotation.multiply(rotate90degreesAroundXAxis)

  mocapComponent.schema.rig[VRMHumanBoneName.Head].x = headRotation.x
  mocapComponent.schema.rig[VRMHumanBoneName.Head].y = headRotation.y
  mocapComponent.schema.rig[VRMHumanBoneName.Head].z = headRotation.z
  mocapComponent.schema.rig[VRMHumanBoneName.Head].w = headRotation.w
}