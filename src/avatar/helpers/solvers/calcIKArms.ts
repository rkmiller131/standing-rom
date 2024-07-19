// import { Bone } from 'three';
import { CCDIKSolver } from 'three/examples/jsm/Addons.js'
import { iks, ikTargets } from '../setupIKSolver';
import { rigIKTargetRotation } from '../animationHelpers';

// const targetBone = new Bone();
let ikSolver: CCDIKSolver | null = null;

// https://codesandbox.io/p/sandbox/ik-solver-for-three-js-7dh9b?file=%2Fsrc%2Findex.js%3A171%2C1
// https://github.com/pickles976/LearningRobotics/blob/main/IK/kinematics_3D/TODO.md
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_ik.html

export function calcIKArms(rightHand) {
    if (!ikSolver) {
        ikSolver = new CCDIKSolver(ikTargets.avatarMesh, iks);
    }
    // rig the right hand for iktargets
    rigIKTargetRotation(ikSolver, 44, { x: rightHand.x, y: rightHand.y, z: rightHand.z })

    console.log('before ik update ', ikSolver.mesh.skeleton.bones[44])
    ikSolver.update();
    ikSolver.mesh.skeleton.bones[44].updateMatrixWorld();
    console.log('after ik update ', ikSolver.mesh.skeleton.bones[44])
    // console.log('ikSolver is ', ikSolver)
    // console.log('right hand data is ', rightHand) // xyz vector

    // return {
    //     rightArmTarget: {},
    //     leftArmTarget: {}
    // }
}