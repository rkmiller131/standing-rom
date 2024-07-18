/* eslint-disable @typescript-eslint/no-explicit-any */
import { Euler, Quaternion, Vector3 } from 'three';
import { CCDIKSolver } from 'three/examples/jsm/Addons.js';

// Animate Rotation -----------------------------------------------
export const rigRotation = (
  vrm: any,
  name: string,
  rotation = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3,
) => {
  if (
    !vrm.current ||
    !vrm.current.humanoid ||
    !vrm.current.humanoid.humanBones[name]
  )
    return;

  const Part = vrm.current.humanoid.humanBones[name];
  if (!Part.node) {
    console.error(`Node not found for bone: ${name}`);
    return;
  }

  let spineAdjustmentY = 0;
  if (name === 'rightUpperArm' || name === 'leftUpperArm') {
    const spineQuat = vrm.current.humanoid.humanBones['spine'].node.quaternion;
    const spineEuler = new Euler().setFromQuaternion(spineQuat);
    spineAdjustmentY =
      name === 'rightUpperArm' ? spineEuler.y - 0.4 : spineEuler.y + 0.4;
  }

  const euler = new Euler(
    rotation.x * dampener,
    (rotation.y + spineAdjustmentY) * dampener,
    rotation.z * dampener,
  );
  const quaternion = new Quaternion().setFromEuler(euler);
  Part.node.quaternion.slerp(quaternion, lerpAmount); // interpolate
};

export const rigIKTargetRotation = (
  ikSolver: CCDIKSolver, 
  index: number, 
  rotation = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  const targetBone = ikSolver.mesh.skeleton.bones[index];
  const euler = new Euler(
    rotation.x * dampener,
    rotation.y * dampener,
    rotation.z * dampener
  )
  const quaternion = new Quaternion().setFromEuler(euler);
  targetBone.quaternion.slerp(quaternion, lerpAmount);
  // targetBone.updateMatrix();

  // if (targetBone.parent) {
  //   targetBone.parent.updateMatrix();
  // }
}

// Animate Position -----------------------------------------------
export const rigPosition = (
  vrm: any,
  name: string,
  position = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3,
) => {
  if (
    !vrm.current ||
    !vrm.current.humanoid ||
    !vrm.current.humanoid.humanBones[name]
  )
    return;

  const Part = vrm.current.humanoid.humanBones[name];
  if (!Part.node) {
    console.error(`Node not found for bone: ${name}`);
    return;
  }
  if (!Part) {
    return;
  }
  const vector = new Vector3(
    position.x * dampener,
    position.y * dampener,
    position.z * dampener,
  );
  Part.position.lerp(vector, lerpAmount); // interpolate
  // Part.position.add(vector)
};

export const rigIKTargetPosition = (
  ikSolver: CCDIKSolver, 
  index: number, 
  position = { x: 0, y: 0, z: 0 },
  dampener = 1,
  lerpAmount = 0.3
) => {
  const targetBone = ikSolver.mesh.skeleton.bones[index];
  const vector = new Vector3(
    position.x * dampener,
    position.y * dampener,
    position.z * dampener
  )
  targetBone.position.lerp(vector, lerpAmount);
}