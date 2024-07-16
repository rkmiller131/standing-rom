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
  target: 59, // change to the live mediapipe landmarks for the right hand 22
  effector: 43,
  links: [
    {
        index: 41,
        rotationMin: new Vector3( 1.2, - 1.8, - .4 ),
		    rotationMax: new Vector3( 1.7, - 1.1, .3 )
    },
    {
        index: 39,
        rotationMin: new Vector3( 1.2, - 1.8, - .4 ),
		    rotationMax: new Vector3( 1.7, - 1.1, .3 )
    },
  ]
}]

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

    child.rotation.set(0, 0, 0);

    // save reference to bones for the right arm chain
    if (child.name === 'upperarm_r') ikTargets.rightArm.rightUpperArm = child;
    if (child.name === 'lowerarm_r') ikTargets.rightArm.rightLowerArm = child;
    if (child.name === 'hand_r') {
      ikTargets.rightArm.rightHand = child;
      // const rightHandPos = new Vector3().setFromMatrixPosition(child.matrixWorld);
      const rightHandPos = new Vector3(child.position.clone().x, child.position.clone().y, child.position.clone().z); // cringe, I know, I'll fix later
      targetRightHand.position.set(rightHandPos.x + 0.1, rightHandPos.y, rightHandPos.z);
      ikTargets.rightArm.rightHand.add(targetRightHand);
      ikTargets.rightArm.ikTarget = targetRightHand; // this is for the transform controls, can delete later
    }
    if (child instanceof Bone) bones.push(child);
  })

  const unifiedSkinnedMesh = new SkinnedMesh(combinedGeometry!, combinedMaterial!);
  ikTargets.avatarMesh = unifiedSkinnedMesh;
  const skeleton = new Skeleton(bones);
  // for some reason, adding the root bone makes the avatar mesh large/not responsive to scale factors
  // ikTargets.avatarMesh.add(bones[0]); // root bone for entire mesh (hips)
  ikTargets.avatarMesh.bind(skeleton);

}