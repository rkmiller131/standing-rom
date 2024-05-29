// import { Bone } from 'three';
import { CCDIKSolver } from 'three/examples/jsm/Addons.js'

// const targetBone = new Bone();
let ikSolver;

// https://codesandbox.io/p/sandbox/ik-solver-for-three-js-7dh9b?file=%2Fsrc%2Findex.js%3A171%2C1
// https://github.com/pickles976/LearningRobotics/blob/main/IK/kinematics_3D/TODO.md
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_animation_skinning_ik.html

export function calcIKArms(vrm, ikTargets, ikObj, lm3d) {
    // console.log('lets find the lm3d of the right hand, make a bone out of it ', lm3d[16])
    if (!vrm.current.scene.skeleton || !lm3d) return;
    // targetBone.copy(vrm.current.scene.skeleton.bones[22])
    // targetBone.position.x = (lm3d[15].x);
    // targetBone.position.y = (lm3d[15].y);
    // targetBone.position.z = (lm3d[15].z);
    // ikTargets.avatar.skeleton.bones[0].add(targetBone)
    // ikObj.target = targetBone;

    ikSolver = new CCDIKSolver(ikTargets.avatar, ikObj);
    // console.log('iksolver returns ', ikSolver)
    ikSolver.update();
}