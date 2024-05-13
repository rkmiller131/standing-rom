/* eslint-disable @typescript-eslint/no-explicit-any */
import { PoseSolver as Pose, HandSolver as Hand } from '../../mocap/solvers/index'
import { VRM } from '../../THREE_Interface'

export const animateVRM = (
  vrm: React.RefObject<VRM>,
  results: any,
) => {
  if (!vrm.current) return;
  // Pose 3D Landmarks are with respect to Hip distance in meters
  const pose3DLandmarks = results.za;
  // Pose 2D landmarks are with respect to videoWidth and videoHeight
  const pose2DLandmarks = results.poseLandmarks;

  // need to be flipped b/c stream is mirrored
  const leftHandLandmarks = results.rightHandLandmarks;
  const rightHandLandmarks = results.leftHandLandmarks;

  const enableLegs = false;

  // Animate Pose
  if (pose2DLandmarks && pose3DLandmarks) {
   Pose.solve(pose3DLandmarks, pose2DLandmarks, vrm, enableLegs);
  }

  // Animate Hands
  if (leftHandLandmarks) {
    Hand.solve(vrm, pose3DLandmarks, leftHandLandmarks, "Left");
  }
  if (rightHandLandmarks) {
    Hand.solve(vrm, pose3DLandmarks, leftHandLandmarks, "Right");
  }
};