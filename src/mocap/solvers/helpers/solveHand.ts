/* eslint-disable @typescript-eslint/no-explicit-any */
import { VRMHumanBoneName } from '@pixiv/three-vrm'
import { NormalizedLandmark } from '../Types'
import { Quaternion, Vector3, Plane, Matrix4 } from 'three'
import { mocapComponent } from '../../mocapComponent'

const startPoint = new Vector3();
const ref1Point = new Vector3();
const ref2Point = new Vector3();
const directionVector = new Vector3();
const thirdVector = new Vector3();
const rotationMatrix = new Matrix4();
const plane = new Plane();

/**
 * Calculates rotation of a hand based on three landmarks: the wrist and two reference points, like the tips of the thumb and pinky fingers.
 * @param {any} vrm - The VRM object.
 * @param {number} lowestWorldY - The lowest Y coordinate in the world space.
 * @param {NormalizedLandmark} extent - The landmark representing the wrist.
 * @param {NormalizedLandmark} ref1 - The first reference landmark.
 * @param {NormalizedLandmark} ref2 - The second reference landmark.
 * @param {VRMHumanBoneName} parentTargetBoneName - The name of the parent bone, like the forearm.
 * @param {VRMHumanBoneName} extentTargetBoneName - The name of the bone to apply the rotation to.
 * @returns {void}
 */
export const solveHand = (
  vrm: any,
  lowestWorldY: number,
  extent: NormalizedLandmark,
  ref1: NormalizedLandmark,
  ref2: NormalizedLandmark,
  parentTargetBoneName: VRMHumanBoneName,
  extentTargetBoneName: VRMHumanBoneName
) => {
  if (!extent || !ref1 || !ref2) return

  if (ref1.visibility! + ref2.visibility! + extent.visibility! < 1) return

  const rig = vrm.current.humanoid.humanBones;

  // grabs the world quaternion of the parent bone (like forearm) to calc hand rotation from
  // world space to the local space of the parent bone
  const parentQuaternion = rig[parentTargetBoneName]!.node.getWorldQuaternion(new Quaternion());

  // define the plane of the hand and its orientation by setting these reference points to lm positions
  startPoint.set(extent.x, lowestWorldY - extent.y, extent.z)
  ref1Point.set(ref1.x, lowestWorldY - ref1.y, ref1.z)
  ref2Point.set(ref2.x, lowestWorldY - ref2.y, ref2.z)

  // define a plane based on three points - the plane's normalized vector represents the orthogonal direction to the plane of the hand.
  plane.setFromCoplanarPoints(ref1Point, ref2Point, startPoint);
  // Calculate direction between wrist and center of tip of hand (forward direction of the hand).
  directionVector.addVectors(ref1Point, ref2Point).multiplyScalar(0.5).sub(startPoint).normalize();
  const orthogonalVector = plane.normal;
  // Cross product of the directionVector and the plane's normal representing the side direction of the hand.
  thirdVector.crossVectors(directionVector, orthogonalVector)

  // construct a rotation matrix from these three vectors using makeBasis, which represents rotation of the hand in world space.
  // For the hands, negative x is forward, palm up is negative y, thumb side is positive z on left hand, negative z on right hand
  rotationMatrix.makeBasis(directionVector, orthogonalVector, thirdVector);

  // create a quaternion from that rotation matrix representing the rotation of the hand in world space.
  const limbExtentQuaternion = new Quaternion().setFromRotationMatrix(rotationMatrix)

  // convert world space quaternion to local space of the parent bone
  const extentQuaternionLocal = new Quaternion()
    .copy(limbExtentQuaternion)
    .premultiply(parentQuaternion.clone().invert())

  mocapComponent.schema.rig[extentTargetBoneName].x = extentQuaternionLocal.x
  mocapComponent.schema.rig[extentTargetBoneName].y = extentQuaternionLocal.y
  mocapComponent.schema.rig[extentTargetBoneName].z = extentQuaternionLocal.z
  mocapComponent.schema.rig[extentTargetBoneName].w = extentQuaternionLocal.w
}