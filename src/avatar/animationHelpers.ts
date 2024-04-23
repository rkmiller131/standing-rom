/* eslint-disable @typescript-eslint/no-explicit-any */
import { Euler, Quaternion, Vector3 } from 'three'

// Animate Rotation -----------------------------------------------
export const rigRotation = (
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
