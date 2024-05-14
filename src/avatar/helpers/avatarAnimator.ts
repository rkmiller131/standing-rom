/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector3 } from 'three';
import { PoseSolver as Pose, HandSolver as Hand } from '../../mocap/solvers/index'
import { VRM } from '../../THREE_Interface'
import { getArmIKHint, rigRotation, solveTwoBoneIK } from './animationHelpers';

const _hint = new Vector3();
const _vector3 = new Vector3();

export const animateVRM = (
  vrm: React.RefObject<VRM>,
  results: any,
) => {
  if (!vrm.current) return;
  // Pose 3D Landmarks are with respect to Hip distance in meters
  const pose3DLandmarks = results.za;
  // Pose 2D landmarks are with respect to videoWidth and videoHeight
  const pose2DLandmarks = results.poseLandmarks;

  let riggedPose;
  // need to be flipped b/c stream is mirrored
  const leftHandLandmarks = results.rightHandLandmarks;
  const rightHandLandmarks = results.leftHandLandmarks;

  const enableLegs = false;

  // Animate Pose
  if (pose2DLandmarks && pose3DLandmarks) {
   riggedPose = Pose.solve(pose3DLandmarks, pose2DLandmarks, vrm, enableLegs);
   rigRotation(vrm, "rightUpperArm", riggedPose!.UpperArm.r, 0.3);
   rigRotation(vrm, "rightLowerArm", riggedPose!.LowerArm.r, 0.3);

    // getArmIKHint(
    //   vrm,
    //   vrm.current.humanoid.rawHumanBones.rightUpperArm.node.getWorldPosition(_vector3),
    //   'right',
    //   _hint
    // )

    // solveTwoBoneIK(
    //   riggedPose!.UpperArm.r, // root name
    //   riggedPose!.LowerArm.r, // midpoint
    //   "rightHand", // endpoint (tip)
    //   rigComponent.vrm,
    //   rightHandTransform.position,
    //   rightHandTransform.rotation,
    //   null,
    //   _hint,
    //   rightHandTargetBlendWeight,
    //   rightHandTargetBlendWeight
    // )
  }

  // Animate Hands
  if (leftHandLandmarks) {
    Hand.solve(vrm, pose3DLandmarks, leftHandLandmarks, "Left");
  }
  if (rightHandLandmarks) {
    Hand.solve(vrm, pose3DLandmarks, rightHandLandmarks, "Right");
  }
};