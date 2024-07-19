import { VRM } from '@pixiv/three-vrm';
import { Bone, BufferGeometry, Material, Object3D, Skeleton, SkinnedMesh, Vector3 } from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

interface ikTargetTypes {
  avatarMesh: SkinnedMesh;
  rightArm: {
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
  target: 44, // change to the live mediapipe landmarks for the right hand 59
  effector: 43, // right hand
  links: [
    {
        index: 42, // lower right twist bone
        limitation: new Vector3(1, 0, 0),
        rotationMin: new Vector3(-0.25, 0, 0),
        rotationMax: new Vector3(0.25, 0, 0)
    },
    {
        index: 41, // right forearm
        // x is twist (supine vs pronated)
        // rotationMin: new Vector3(0, 0, 0),
        // rotationMax: new Vector3(0, 0, 0),
        limitation: new Vector3(0, 1, 0),
        rotationMin: new Vector3(-1, 0, 0),
        // rotationMin: new Vector3(-1, 0, -1),
        rotationMax: new Vector3(2, 3, 0)
    },
    {
        index: 40, // upper right twist bone
        limitation: new Vector3(1, 0, 0),
        rotationMin: new Vector3(-0.25, 0, 0),
        rotationMax: new Vector3(0.25, 0, 0)
    },
    {
        index: 39, // right shoulder
        // rotationMin: new Vector3(0, 0, 0),
        // rotationMax: new Vector3(0, 0, 0)
        // rotationMin: new Vector3(-1.5, -1, -2),
		    // rotationMax: new Vector3(1.5, 1, 2)
        // rotationMin: new Vector3(-1, 0, -1),
        // rotationMax: new Vector3(1, 1, 0)
        // y is forward backward reach with shoulder
        rotationMin: new Vector3(-1, -1, 0),
		    rotationMax: new Vector3(1, 2, 0)
    },
  ],
  iteration: 30
}]

// export const iks = [{
//   target: 59, // change to the live mediapipe landmarks for the right hand 22
//   effector: 43, // right hand
//   links: [
//     {
//         index: 41, // right forearm
//         rotationMin: new Vector3(0, -2, 0),
// 		    rotationMax: new Vector3(2, 2, 0)
//     },
//     {
//         index: 39, // right shoulder
//         rotationMin: new Vector3(-1.5, -1, -2),
// 		    rotationMax: new Vector3(1.5, 1, 2)
//     },
//   ],
//   iteration: 10
// }]

/*
 root, - for all ik chains, the skinned mesh will be a reconstruction of all avatar meshes, bound to a single skeleton
  |___bone0 = upper right arm
  |   |___bone1 = lower right arm
  |       |___bone2 = right hand
  |
  |__ target = a new Bone() with position of the right hand, and rotation from MP
               The position is a simple world matrix clone of the MP right hand + a little on x axis
               The rotation is a rollPitchYaw calculation based off of right hand landmarks
               for the palm of the right hand (3 landmarks total)

  Each limb will have its own IK solve, where the keys on ikTargets are the limb,
  values are another object containing the skinned mesh and associated skeleton.
  Create a skeleton with positions as they are loaded, but with rotations zeroed out if not already:
  https://discourse.threejs.org/t/help-with-walk-animation-using-ik-solver/17753

*/
export function setupIKSolver(vrm: VRM) {
  buildSkeletonMesh(vrm);
}

function buildSkeletonMesh(vrm: VRM) {
  const bones: Bone[] = [];
  const skinnedMeshes: SkinnedMesh[] = [];
  let combinedGeometry: BufferGeometry | null = null;
  let combinedMaterial: Material | undefined | null = null;

  // set up the base IK target bone references
  const targetRightHand = new Bone();
  targetRightHand.name = 'right_hand_target'

  vrm.scene.traverse((child) => {
    if (child instanceof SkinnedMesh) {
      if (!combinedGeometry) {
        combinedGeometry = child.geometry.clone();
        combinedMaterial = child.material ? child.material.clone() : undefined;
      } else {
        mergeGeometries([combinedGeometry, child.geometry], true);
      }
      skinnedMeshes.push(child);
    }

    // child.rotation.set(0, 0, 0);

    // save reference to bones for the right arm chain
    if (child.name === 'upperarm_r') {
      ikTargets.rightArm.rightUpperArm = child;
      ikTargets.rightArm.rightUpperArm.add(targetRightHand);
      ikTargets.rightArm.ikTarget = targetRightHand; // this is for the transform controls, can delete later
    }
    if (child.name === 'lowerarm_r') ikTargets.rightArm.rightLowerArm = child;
    if (child.name === 'hand_r') {
      ikTargets.rightArm.rightHand = child;

      const rightHandPos = new Vector3(child.position.clone().x, child.position.clone().y, child.position.clone().z); // cringe, I know, I'll fix later
      targetRightHand.position.set(rightHandPos.x + 0.5, rightHandPos.y, rightHandPos.z);
    }
    // if (child instanceof Bone) bones.push(child);
    if (child instanceof Bone && child.name !== 'right_hand_target') bones.push(child);
    if (child.name === 'hand_r'){
        bones.push(targetRightHand);
    }
  })

  console.log('bones array is ', bones)
  const unifiedSkinnedMesh = new SkinnedMesh(combinedGeometry!, combinedMaterial!);
  ikTargets.avatarMesh = unifiedSkinnedMesh;
  const skeleton = new Skeleton(bones);
  // when you add the root bone to the skinned mesh and then bind the skeleton, the transformations of the root bone propagate through the
  // entire skeleton. So the root bone has a scale of 1, and this is being set as the avatar is loaded, perhaps after being saved to the primitive that gets rendered
  // with a scale of 0.75, so just hot fix adding that here. Other interesting note: adding root bone stops animateVRM from moving the skelly
  // skeleton.bones[0].scale.set(0.75, 0.75, 0.75);
  // ikTargets.avatarMesh.add(bones[0]); // root bone for entire mesh (hips)
  ikTargets.avatarMesh.bind(skeleton);

}