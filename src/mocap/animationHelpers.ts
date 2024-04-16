import { VRMSchema } from ''
import { Euler, Quaternion, Vector3 } from 'three'
// Animate Rotation -----------------------------------------------
export const rigRotation = (
  vrm,
  name,
  rotation = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  if (!vrm.current) {return}
  const Part = vrm.current.humanoid.getBoneNode(
    THREE.VRMSchema.HumanoidBoneName[name]
  );
  if (!Part) {return}

  const euler = new Euler(
    rotation.x * dampener,
    rotation.y * dampener,
    rotation.z * dampener
  );
  const quaternion = new Quaternion().setFromEuler(euler);
  Part.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

// Animate Position -----------------------------------------------
// export const rigPosition = (
//   vrm,
//   name,
//   position = { x: 0, y: 0, z: 0 },
//   dampener = 1,
//   lerpAmount = 0.3
// ) => {
//   if (!vrm.current) {return}
//   const Part = vrm.current.humanoid.getBoneNode(
//     THREE.VRMSchema.HumanoidBoneName[name]
//   );
//   if (!Part) {return}
//   const vector = new Vector3(
//     position.x * dampener,
//     position.y * dampener,
//     position.z * dampener
//   );
//   Part.position.lerp(vector, lerpAmount); // interpolate
// };
