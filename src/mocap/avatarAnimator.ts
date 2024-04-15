import { Pose, Hand } from 'kalidokit';
import { rigPosition, rigRotation } from './animationHelpers';

export const animateVRM = (vrm, results, videoRef) => {
  if (!vrm) {
    return;
  }
  // Take the results from `Holistic` and animate character based on its Pose and Hand Keypoints.
  let riggedPose, riggedLeftHand, riggedRightHand;

  // Pose 3D Landmarks are with respect to Hip distance in meters
  const pose3DLandmarks = results.ea;
  // Pose 2D landmarks are with respect to videoWidth and videoHeight
  const pose2DLandmarks = results.poseLandmarks;
  // Be careful, hand landmarks may be reversed
  const leftHandLandmarks = results.rightHandLandmarks;
  const rightHandLandmarks = results.leftHandLandmarks;

  // Animate Pose
  if (pose2DLandmarks && pose3DLandmarks) {
    riggedPose = Pose.solve(pose3DLandmarks, pose2DLandmarks, {
      runtime: "mediapipe",
      video: videoRef,
    });
    rigRotation("Hips", riggedPose!.Hips.rotation, 0.7);
    rigPosition(
      "Hips",
      {
        x: -riggedPose!.Hips.position.x, // Reverse direction
        y: riggedPose!.Hips.position.y + 1, // Add a bit of height
        z: -riggedPose!.Hips.position.z // Reverse direction
      },
      1,
      0.07
    );

    rigRotation("Chest", riggedPose!.Spine, 0.25, .3);
    rigRotation("Spine", riggedPose!.Spine, 0.45, .3);

    rigRotation("RightUpperArm", riggedPose!.RightUpperArm, 1, .3);
    rigRotation("RightLowerArm", riggedPose!.RightLowerArm, 1, .3);
    rigRotation("LeftUpperArm", riggedPose!.LeftUpperArm, 1, .3);
    rigRotation("LeftLowerArm", riggedPose!.LeftLowerArm, 1, .3);

    rigRotation("LeftUpperLeg", riggedPose!.LeftUpperLeg, 1, .3);
    rigRotation("LeftLowerLeg", riggedPose!.LeftLowerLeg, 1, .3);
    rigRotation("RightUpperLeg", riggedPose!.RightUpperLeg, 1, .3);
    rigRotation("RightLowerLeg", riggedPose!.RightLowerLeg, 1, .3);
  }

  // Animate Hands
  if (leftHandLandmarks) {
    riggedLeftHand = Hand.solve(leftHandLandmarks, "Left");
    rigRotation("LeftHand", {
      // Combine pose rotation Z and hand rotation X Y
      z: riggedPose!.LeftHand.z,
      y: riggedLeftHand!.LeftWrist.y,
      x: riggedLeftHand!.LeftWrist.x
    });
    rigRotation("LeftRingProximal", riggedLeftHand!.LeftRingProximal);
    rigRotation("LeftRingIntermediate", riggedLeftHand!.LeftRingIntermediate);
    rigRotation("LeftRingDistal", riggedLeftHand!.LeftRingDistal);
    rigRotation("LeftIndexProximal", riggedLeftHand!.LeftIndexProximal);
    rigRotation("LeftIndexIntermediate", riggedLeftHand!.LeftIndexIntermediate);
    rigRotation("LeftIndexDistal", riggedLeftHand!.LeftIndexDistal);
    rigRotation("LeftMiddleProximal", riggedLeftHand!.LeftMiddleProximal);
    rigRotation("LeftMiddleIntermediate", riggedLeftHand!.LeftMiddleIntermediate);
    rigRotation("LeftMiddleDistal", riggedLeftHand!.LeftMiddleDistal);
    rigRotation("LeftThumbProximal", riggedLeftHand!.LeftThumbProximal);
    rigRotation("LeftThumbIntermediate", riggedLeftHand!.LeftThumbIntermediate);
    rigRotation("LeftThumbDistal", riggedLeftHand!.LeftThumbDistal);
    rigRotation("LeftLittleProximal", riggedLeftHand!.LeftLittleProximal);
    rigRotation("LeftLittleIntermediate", riggedLeftHand!.LeftLittleIntermediate);
    rigRotation("LeftLittleDistal", riggedLeftHand!.LeftLittleDistal);
  }
  if (rightHandLandmarks) {
    riggedRightHand = Hand.solve(rightHandLandmarks, "Right");
    rigRotation("RightHand", {
      // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
      z: riggedPose!.RightHand.z,
      y: riggedRightHand!.RightWrist.y,
      x: riggedRightHand!.RightWrist.x
    });
    rigRotation("RightRingProximal", riggedRightHand!.RightRingProximal);
    rigRotation("RightRingIntermediate", riggedRightHand!.RightRingIntermediate);
    rigRotation("RightRingDistal", riggedRightHand!.RightRingDistal);
    rigRotation("RightIndexProximal", riggedRightHand!.RightIndexProximal);
    rigRotation("RightIndexIntermediate",riggedRightHand!.RightIndexIntermediate);
    rigRotation("RightIndexDistal", riggedRightHand!.RightIndexDistal);
    rigRotation("RightMiddleProximal", riggedRightHand!.RightMiddleProximal);
    rigRotation("RightMiddleIntermediate", riggedRightHand!.RightMiddleIntermediate);
    rigRotation("RightMiddleDistal", riggedRightHand!.RightMiddleDistal);
    rigRotation("RightThumbProximal", riggedRightHand!.RightThumbProximal);
    rigRotation("RightThumbIntermediate", riggedRightHand!.RightThumbIntermediate);
    rigRotation("RightThumbDistal", riggedRightHand!.RightThumbDistal);
    rigRotation("RightLittleProximal", riggedRightHand!.RightLittleProximal);
    rigRotation("RightLittleIntermediate", riggedRightHand!.RightLittleIntermediate);
    rigRotation("RightLittleDistal", riggedRightHand!.RightLittleDistal);
  }
};