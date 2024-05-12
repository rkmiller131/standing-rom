/* eslint-disable @typescript-eslint/no-explicit-any */
// import { HandSolver as Hand } from './solvers'
import { PoseSolver as Pose, HandSolver as Hand } from '../../mocap/solvers/index'
// import {PoseSolver as KalidoPose} from './solvers'
// import { rigRotation } from './animationHelpers'
import { VRM } from '../../THREE_Interface'
// import { rigRotation2 } from './animationHelpers';
// import { mocapComponent } from '../../mocap/mocapComponent';

export const animateVRM = (
  vrm: React.RefObject<VRM>,
  results: any,
  // videoRef: React.RefObject<HTMLVideoElement>
) => {
  if (!vrm.current) return;
  // Take the results from Holistic and animate character based on its Pose and Hand Keypoints.
  // let riggedPose, riggedLeftHand, riggedRightHand;

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
  //  if (!riggedPose) return;

    // this returns nothing... need to make pose.solve return the body parts after all.
    // console.log('the motion capture rig looks like: ', riggedPose.worldLandmarks[14]);

    // free motion tilting:
    // rigRotation(vrm, "hips", riggedPose!.Hips.rotation, 0.7);

    // rigPosition(
    //   vrm,
    //   "Hips",
    //   {
    //     x: -riggedPose!.Hips.position.x, // Reverse direction
    //     y: riggedPose!.Hips.position.y + 1, // Add a bit of height
    //     z: -riggedPose!.Hips.position.z // Reverse direction
    //   },
    //   1,
    //   0.07
    // );

    // rigRotation(vrm, "chest", riggedPose!.Spine, 0.25, .3);
    // rigRotation(vrm, "spine", riggedPose!.Spine, 0.45, .3);

    // rigRotation(vrm, "rightUpperArm", riggedPose!.RightUpperArm, 1, .3);
    // rigRotation(vrm, "rightLowerArm", riggedPose!.RightLowerArm, 1, .3);
    // rigRotation(vrm, "leftUpperArm", riggedPose!.LeftUpperArm, 1, .3);
    // rigRotation(vrm, "leftLowerArm", riggedPose!.LeftLowerArm, 1, .3);

    // comment out to lock the legs:
    // rigRotation(vrm, "leftUpperLeg", riggedPose!.LeftUpperLeg, 1, .3);
    // rigRotation(vrm, "leftLowerLeg", riggedPose!.LeftLowerLeg, 1, .3);
    // rigRotation(vrm, "rightUpperLeg", riggedPose!.RightUpperLeg, 1, .3);
    // rigRotation(vrm, "rightLowerLeg", riggedPose!.RightLowerLeg, 1, .3);
    // riggedPose = KalidoPose.solve(pose3DLandmarks, pose2DLandmarks, {
    //   runtime: "mediapipe",
    //   enableLegs: false
    // })
  }

  // Animate Hands
  if (leftHandLandmarks) {
    Hand.solve(vrm, pose3DLandmarks, leftHandLandmarks, "Left");
    // rigRotation2(vrm, "leftHand", {
    //   // Combine pose rotation Z and hand rotation X Y
    //   z: riggedPose!.LeftHand.z,
    //   y: riggedLeftHand!.LeftWrist.y,
    //   x: riggedLeftHand!.LeftWrist.x
    // });
    // rigRotation2(vrm, "leftRingProximal", riggedLeftHand!.LeftRingProximal);
    // rigRotation2(vrm, "leftRingIntermediate", riggedLeftHand!.LeftRingIntermediate);
    // rigRotation2(vrm, "leftRingDistal", riggedLeftHand!.LeftRingDistal);
    // rigRotation2(vrm, "leftIndexProximal", riggedLeftHand!.LeftIndexProximal);
    // rigRotation2(vrm, "leftIndexIntermediate", riggedLeftHand!.LeftIndexIntermediate);
    // rigRotation2(vrm, "leftIndexDistal", riggedLeftHand!.LeftIndexDistal);
    // rigRotation2(vrm, "leftMiddleProximal", riggedLeftHand!.LeftMiddleProximal);
    // rigRotation2(vrm, "leftMiddleIntermediate", riggedLeftHand!.LeftMiddleIntermediate);
    // rigRotation2(vrm, "leftMiddleDistal", riggedLeftHand!.LeftMiddleDistal);
    // rigRotation2(vrm, "leftThumbProximal", riggedLeftHand!.LeftThumbProximal);
    // rigRotation2(vrm, "leftThumbIntermediate", riggedLeftHand!.LeftThumbIntermediate);
    // rigRotation2(vrm, "leftThumbDistal", riggedLeftHand!.LeftThumbDistal);
    // rigRotation2(vrm, "leftLittleProximal", riggedLeftHand!.LeftLittleProximal);
    // rigRotation2(vrm, "leftLittleIntermediate", riggedLeftHand!.LeftLittleIntermediate);
    // rigRotation2(vrm, "leftLittleDistal", riggedLeftHand!.LeftLittleDistal);
  }
  if (rightHandLandmarks) {
    Hand.solve(vrm, pose3DLandmarks, leftHandLandmarks, "Right");
    // rigRotation2(vrm, "rightHand", {
    //   // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
    //   z: riggedPose!.RightHand.z,
    //   y: riggedRightHand!.RightWrist.y,
    //   x: riggedRightHand!.RightWrist.x
    // });
    // rigRotation2(vrm, "rightRingProximal", riggedRightHand!.RightRingProximal);
    // rigRotation2(vrm, "rightRingIntermediate", riggedRightHand!.RightRingIntermediate);
    // rigRotation2(vrm, "rightRingDistal", riggedRightHand!.RightRingDistal);
    // rigRotation2(vrm, "rightIndexProximal", riggedRightHand!.RightIndexProximal);
    // rigRotation2(vrm, "rightIndexIntermediate",riggedRightHand!.RightIndexIntermediate);
    // rigRotation2(vrm, "rightIndexDistal", riggedRightHand!.RightIndexDistal);
    // rigRotation2(vrm, "rightMiddleProximal", riggedRightHand!.RightMiddleProximal);
    // rigRotation2(vrm, "rightMiddleIntermediate", riggedRightHand!.RightMiddleIntermediate);
    // rigRotation2(vrm, "rightMiddleDistal", riggedRightHand!.RightMiddleDistal);
    // rigRotation2(vrm, "rightThumbProximal", riggedRightHand!.RightThumbProximal);
    // rigRotation2(vrm, "rightThumbIntermediate", riggedRightHand!.RightThumbIntermediate);
    // rigRotation2(vrm, "rightThumbDistal", riggedRightHand!.RightThumbDistal);
    // rigRotation2(vrm, "rightLittleProximal", riggedRightHand!.RightLittleProximal);
    // rigRotation2(vrm, "rightLittleIntermediate", riggedRightHand!.RightLittleIntermediate);
    // rigRotation2(vrm, "rightLittleDistal", riggedRightHand!.RightLittleDistal);
  }
};