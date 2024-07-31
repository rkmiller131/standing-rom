import { IHips, PI, XYZ } from '../constants/Types';
import Vector from '../constants/Vector';

/**
 * Converts normalized rotations to radians and estimates world position of hips
 * @param {Object} hips : hip position and rotation values
 * @param {Object} spine : spine position and rotation values
 */
export const rigHips = (hips: IHips, spine: Vector | XYZ) => {
  //convert normalized values to radians
  if (hips.rotation) {
    hips.rotation.x *= Math.PI;
    hips.rotation.y *= Math.PI;
    hips.rotation.z *= Math.PI;
  }

  spine.x *= PI;
  spine.y *= PI;
  spine.z *= PI;

  return {
    Hips: hips,
    Spine: spine as XYZ,
  };
};