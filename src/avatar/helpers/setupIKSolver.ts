import { VRM } from '@pixiv/three-vrm';
import { Bone, Object3D, Skeleton, SkinnedMesh, Vector3 } from 'three';

interface ikTargetTypes {
  rightArm: {
    armMesh: SkinnedMesh;
    rightUpperArm: Object3D;
    rightLowerArm: Object3D;
    rightHand: Object3D;
    ikTarget: Bone;
  }
}
export const ikTargets = {
  rightArm: {}
} as ikTargetTypes;
export const iks = [{
  target: 23, // change to the live mediapipe landmarks for the right hand 22
  effector: 22,
  links: [
    {
        index: 21,
        rotationMin: new Vector3( 1.2, - 1.8, - .4 ),
		    rotationMax: new Vector3( 1.7, - 1.1, .3 )
    },
    {
        index: 20,
        rotationMin: new Vector3( 1.2, - 1.8, - .4 ),
		    rotationMax: new Vector3( 1.7, - 1.1, .3 )
    },
  ]
}]

/*
 root, - for the right arm, the skinned mesh will be the shirt, bound to a skeleton
  |___bone0 = upper right arm
  |   |___bone1 = lower right arm
  |       |___bone2 = right hand
  |
  |__ target = a new Bone() with position and rotation from MP
               The position is a simple world matrix clone of the MP right hand
               The rotation is a rollPitchYaw calculation based off of right hand landmarks
               for the palm of the right hand (3 landmarks)

  Each limb will have its own IK solve, where the keys on ikTargets are the limb,
  values are another object containing the skinned mesh associated and built skeleton
  Create a skeleton with positions as they are loaded, but with rotations zeroed out:
  https://discourse.threejs.org/t/help-with-walk-animation-using-ik-solver/17753

*/
export function setupIKSolver(vrm: VRM) {
  createRightArm(vrm);
}

function createRightArm(vrm: VRM) {
  const bones = [];
  vrm.scene.traverse((node) => {
    if (node.name === 'upperarm_r') ikTargets.rightArm.rightUpperArm = node;
    if (node.name === 'lowerarm_r') ikTargets.rightArm.rightLowerArm = node;
    if (node.name === 'hand_r') ikTargets.rightArm.rightHand = node;
    if (node.name === 'CC_Game_Body') ikTargets.rightArm.armMesh = node as SkinnedMesh;
    if (node instanceof Bone) {
      bones.push(node);
    }
  });

  // const shoulder = new Bone();
  // const elbow = new Bone();
  // const hand = new Bone();

  // shoulder.add(elbow);
  // elbow.add(hand);

  // shoulder.position.setFromMatrixPosition(ikTargets.rightArm.rightUpperArm.matrixWorld);
  // bones.push(shoulder);

  // elbow.position.setFromMatrixPosition(ikTargets.rightArm.rightLowerArm.matrixWorld);
  // bones.push(elbow);

  // hand.position.setFromMatrixPosition(ikTargets.rightArm.rightHand.matrixWorld);
  // bones.push(hand);

  // const skeleton = new Skeleton(bones);
  // const mesh = ikTargets.rightArm.armMesh;
  // mesh.add(bones[0]) // root bone, in this case upper right arm
  // mesh.bind(skeleton);

  ikTargets.rightArm.rightUpperArm.rotation.set(0, 0, 0);
  ikTargets.rightArm.rightLowerArm.rotation.set(0, 0, 0);
  ikTargets.rightArm.rightHand.rotation.set(0, 0, 0);
  // const rootBone = ikTargets.rightArm.rightUpperArm;

  const targetBone = new Bone();
  targetBone.name = 'right_hand_target';
  const handPos = ikTargets.rightArm.rightHand.position.clone();
  targetBone.position.set(handPos.x + 0.5, handPos.y, handPos.z)
  ikTargets.rightArm.rightHand.add(targetBone);
  bones.splice(23, 0, targetBone);

  const skeleton = new Skeleton(bones);
  ikTargets.rightArm.armMesh.add(bones[0]);
  ikTargets.rightArm.armMesh.bind(skeleton);
  // ikTargets.rightArm.armMesh.skeleton.bones.push(targetBone);
  // rootBone.add(targetBone);
  ikTargets.rightArm.ikTarget = targetBone;
}