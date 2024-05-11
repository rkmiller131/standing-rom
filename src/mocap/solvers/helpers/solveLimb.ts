import { Quaternion, Vector3 } from 'three'
import { NormalizedLandmark } from '../Types'
import { mocapComponent } from '../../mocapComponent'
import { VRMHumanBoneName } from '@pixiv/three-vrm'

const startPoint = new Vector3();
const midPoint = new Vector3();
const endPoint = new Vector3();
const vec3 = new Vector3();

/**
 * Solves the rotation of a limb based on three landmarks in 3D space.
 * @param {number} lowestWorldY - The lowest Y coordinate in the world space.
 * @param {NormalizedLandmark} start - The starting landmark of the limb.
 * @param {NormalizedLandmark} mid - The middle landmark of the limb.
 * @param {NormalizedLandmark} end - The ending landmark of the limb.
 * @param {Vector3} axis - The axis vector used for quaternion calculation.
 * @param {VRMHumanBoneName | null} [parentTargetBoneName=null] - The name of the parent bone in the VRM skeleton. Defaults to null.
 * @param {VRMHumanBoneName} startTargetBoneName - The name of the bone representing the starting landmark.
 * @param {VRMHumanBoneName} midTargetBoneName - The name of the bone representing the middle landmark.
 * @param {number} [minimumVisibility=-1] - The minimum visibility threshold. Defaults to -1.
 */
export const solveLimb = (
  lowestWorldY: number,
  start: NormalizedLandmark,
  mid: NormalizedLandmark,
  end: NormalizedLandmark,
  axis: Vector3,
  parentTargetBoneName = null as VRMHumanBoneName | null,
  startTargetBoneName: VRMHumanBoneName,
  midTargetBoneName: VRMHumanBoneName,
  minimumVisibility = -1
) => {
  if (!start || !mid || !end) return

  if (minimumVisibility > -1 && (start.visibility! + mid.visibility! + end.visibility!) / 3 < minimumVisibility) return

  startPoint.set(start.x, lowestWorldY - start.y, -start.z)
  midPoint.set(mid.x, lowestWorldY - mid.y, -mid.z)
  endPoint.set(end.x, lowestWorldY - end.y, -end.z)

  const startQuaternion = new Quaternion().setFromUnitVectors(axis, vec3.subVectors(startPoint, midPoint).normalize())
  const midQuaternion = new Quaternion().setFromUnitVectors(axis, vec3.subVectors(midPoint, endPoint).normalize())

  // world space rotation of the start of the limb
  const startLocal = new Quaternion().copy(startQuaternion)
  if (parentTargetBoneName) {
    // store the new rotation values in our mocap component quaternion schema for that bone
    // multply the startLocal by inverse of the parent quaternion, converting the rotation from world space to local space
    // that way it can later animate correctly relative to its parent
    startLocal.premultiply(
      new Quaternion(
        mocapComponent.schema.rig[parentTargetBoneName].x,
        mocapComponent.schema.rig[parentTargetBoneName].y,
        mocapComponent.schema.rig[parentTargetBoneName].z,
        mocapComponent.schema.rig[parentTargetBoneName].w
      ).invert()
    )
  }
  const midLocal = new Quaternion().copy(midQuaternion).premultiply(startQuaternion.clone().invert())

  mocapComponent.schema.rig[startTargetBoneName].x = startLocal.x
  mocapComponent.schema.rig[startTargetBoneName].y = startLocal.y
  mocapComponent.schema.rig[startTargetBoneName].z = startLocal.z
  mocapComponent.schema.rig[startTargetBoneName].w = startLocal.w

  mocapComponent.schema.rig[midTargetBoneName].x = midLocal.x
  mocapComponent.schema.rig[midTargetBoneName].y = midLocal.y
  mocapComponent.schema.rig[midTargetBoneName].z = midLocal.z
  mocapComponent.schema.rig[midTargetBoneName].w = midLocal.w
}