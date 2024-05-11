import { Matrix4, Plane, Quaternion, Vector3 } from 'three'

const plane = new Plane()
const directionVector = new Vector3()
const thirdVector = new Vector3()
const rotationMatrix = new Matrix4()

export const getQuaternionFromPointsAlongPlane = (
  a: Vector3,
  b: Vector3,
  planeRestraint: Vector3,
  target: Quaternion,
  invert = false
) => {
  plane.setFromCoplanarPoints(invert ? b : a, invert ? a : b, planeRestraint)
  const orthogonalVector = plane.normal
  directionVector.subVectors(a, b).normalize()
  thirdVector.crossVectors(orthogonalVector, invert ? directionVector.reflect(new Vector3(0, 1, 0)) : directionVector)
  rotationMatrix.makeBasis(directionVector, thirdVector, orthogonalVector)
  return target.setFromRotationMatrix(rotationMatrix)
}
