/* eslint-disable @typescript-eslint/no-explicit-any */
import { HandSolver as Hand } from './solvers';
import { rigRotation } from './animationHelpers';
import { VRM } from '../../THREE_Interface';
import { avatarSchema } from '../Avatar';
import { Euler, Quaternion, Vector3 } from 'three';
import { MathUtils, QuaternionO, Solve3D, V3O, V3 } from 'inverse-kinematics';

// const rightArmTarget = new Vector3();
const rightUpperArmEulerTest = new Euler();
const rightLowerArmEulerTest = new Euler();
const rightHandEulerTest = new Euler();

export const animateVRM = (
  vrm: React.RefObject<VRM>,
  results: any,
) => {
  if (!vrm.current) return;
  // Take the results from Holistic and animate character based on its Pose and Hand Keypoints.
  let riggedPose, riggedLeftHand, riggedRightHand;

  // Pose 3D Landmarks are with respect to Hip distance in meters
  const pose3DLandmarks = results.za;
  // Pose 2D landmarks are with respect to videoWidth and videoHeight
  const pose2DLandmarks = results.poseLandmarks;

  // need to be flipped b/c stream is mirrored
  const leftHandLandmarks = results.rightHandLandmarks;
  const rightHandLandmarks = results.leftHandLandmarks;

  // Animate Pose
  if (pose2DLandmarks && pose3DLandmarks && avatarSchema.rootBone) {
    const rightArmTarget = [pose3DLandmarks[15].x, pose3DLandmarks[15].y, pose3DLandmarks[15].z] as V3;
    const rightArmLinks = avatarSchema.ikTargets.rightArm.map((bone) => ({
      rotation: QuaternionO.fromObject(bone.quaternion),
      position: V3O.fromVector3(bone.position)
    }));
    const rightArmBase = {
      position: V3O.fromVector3(avatarSchema.rootBone.getWorldPosition((new Vector3()))),
      rotation: QuaternionO.fromObject(avatarSchema.rootBone.getWorldQuaternion(new Quaternion()))
    };
    const knownRangeOfMovement = rightArmLinks.reduce((acc, cur) => acc + V3O.euclideanLength(cur.position), 0);

    // eslint-disable-next-line no-inner-declarations
    function learningRate(errorDistance: number): number {
      const relativeDistanceToTarget = MathUtils.clamp(errorDistance / knownRangeOfMovement, 0, 1)
      const cutoff = 0.1

      if (relativeDistanceToTarget > cutoff) {
        return 10e-3
      }

      // result is between 0 and 1
      const remainingDistance = relativeDistanceToTarget / 0.02
      const minimumLearningRate = 10e-4

      return minimumLearningRate + remainingDistance * 10e-4
    }
    const results = Solve3D.solve(rightArmLinks, rightArmBase, rightArmTarget, {
      learningRate,
      acceptedError: knownRangeOfMovement / 1000,
      method: 'FABRIK',
    }).links

    const rightArmQuatToEul = {
      rightUpperArm: rightUpperArmEulerTest.setFromQuaternion(new Quaternion(results[0].rotation[0], results[0].rotation[1], results[0].rotation[2], results[0].rotation[3])),
      rightLowerArm: rightLowerArmEulerTest.setFromQuaternion(new Quaternion(results[1].rotation[0], results[1].rotation[1], results[1].rotation[2], results[1].rotation[3])),
      rightHand: rightHandEulerTest.setFromQuaternion(new Quaternion(results[2].rotation[0], results[2].rotation[1], results[2].rotation[2], results[2].rotation[3])),
    }
    // console.log('results are ', results[0]);

    rigRotation(vrm, 'rightUpperArm', rightArmQuatToEul.rightUpperArm);
    rigRotation(vrm, 'rightLowerArm', rightArmQuatToEul.rightLowerArm);
    rigRotation(vrm, 'rightHand', rightArmQuatToEul.rightHand);
    
}

  // Animate Hands
  if (leftHandLandmarks) {
    riggedLeftHand = Hand.solve(leftHandLandmarks, 'Left');
    rigRotation(vrm, 'leftHand', {
      // Combine pose rotation Z and hand rotation X Y
      z: riggedLeftHand!.LeftWrist.z,
      y: riggedLeftHand!.LeftWrist.y,
      x: riggedLeftHand!.LeftWrist.x,
    });
    rigRotation(vrm, 'leftRingProximal', riggedLeftHand!.LeftRingProximal);
    rigRotation(
      vrm,
      'leftRingIntermediate',
      riggedLeftHand!.LeftRingIntermediate,
    );
    rigRotation(vrm, 'leftRingDistal', riggedLeftHand!.LeftRingDistal);
    rigRotation(vrm, 'leftIndexProximal', riggedLeftHand!.LeftIndexProximal);
    rigRotation(
      vrm,
      'leftIndexIntermediate',
      riggedLeftHand!.LeftIndexIntermediate,
    );
    rigRotation(vrm, 'leftIndexDistal', riggedLeftHand!.LeftIndexDistal);
    rigRotation(vrm, 'leftMiddleProximal', riggedLeftHand!.LeftMiddleProximal);
    rigRotation(
      vrm,
      'leftMiddleIntermediate',
      riggedLeftHand!.LeftMiddleIntermediate,
    );
    rigRotation(vrm, 'leftMiddleDistal', riggedLeftHand!.LeftMiddleDistal);
    rigRotation(vrm, 'leftThumbProximal', riggedLeftHand!.LeftThumbProximal);
    rigRotation(
      vrm,
      'leftThumbIntermediate',
      riggedLeftHand!.LeftThumbIntermediate,
    );
    rigRotation(vrm, 'leftThumbDistal', riggedLeftHand!.LeftThumbDistal);
    rigRotation(vrm, 'leftLittleProximal', riggedLeftHand!.LeftLittleProximal);
    rigRotation(
      vrm,
      'leftLittleIntermediate',
      riggedLeftHand!.LeftLittleIntermediate,
    );
    rigRotation(vrm, 'leftLittleDistal', riggedLeftHand!.LeftLittleDistal);
  }
  if (rightHandLandmarks) {
    riggedRightHand = Hand.solve(rightHandLandmarks, 'Right');
    rigRotation(vrm, 'rightHand', {
      // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
      z: riggedRightHand!.RightWrist.z,
      y: riggedRightHand!.RightWrist.y,
      x: riggedRightHand!.RightWrist.x,
    });
    rigRotation(vrm, 'rightRingProximal', riggedRightHand!.RightRingProximal);
    rigRotation(
      vrm,
      'rightRingIntermediate',
      riggedRightHand!.RightRingIntermediate,
    );
    rigRotation(vrm, 'rightRingDistal', riggedRightHand!.RightRingDistal);
    rigRotation(vrm, 'rightIndexProximal', riggedRightHand!.RightIndexProximal);
    rigRotation(
      vrm,
      'rightIndexIntermediate',
      riggedRightHand!.RightIndexIntermediate,
    );
    rigRotation(vrm, 'rightIndexDistal', riggedRightHand!.RightIndexDistal);
    rigRotation(
      vrm,
      'rightMiddleProximal',
      riggedRightHand!.RightMiddleProximal,
    );
    rigRotation(
      vrm,
      'rightMiddleIntermediate',
      riggedRightHand!.RightMiddleIntermediate,
    );
    rigRotation(vrm, 'rightMiddleDistal', riggedRightHand!.RightMiddleDistal);
    rigRotation(vrm, 'rightThumbProximal', riggedRightHand!.RightThumbProximal);
    rigRotation(
      vrm,
      'rightThumbIntermediate',
      riggedRightHand!.RightThumbIntermediate,
    );
    rigRotation(vrm, 'rightThumbDistal', riggedRightHand!.RightThumbDistal);
    rigRotation(
      vrm,
      'rightLittleProximal',
      riggedRightHand!.RightLittleProximal,
    );
    rigRotation(
      vrm,
      'rightLittleIntermediate',
      riggedRightHand!.RightLittleIntermediate,
    );
    rigRotation(vrm, 'rightLittleDistal', riggedRightHand!.RightLittleDistal);
  }
};
