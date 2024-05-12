/* eslint-disable @typescript-eslint/no-explicit-any */
import { Vector3 } from 'three'
import { Results, THand, THandUnsafe } from '../../avatar/helpers/solvers/Types'
import { mocapComponent } from '../mocapComponent'
import { Side, TFVectorPose } from './Types'
import { LEFT, PI, PoseIndices, RIGHT } from './constants'
import keyframeInterpolation from './helpers/keyframeInterpolation'
import { clamp } from './utils/helpers'
import Vector from './utils/vector'
import { solveLimb } from './helpers/solveLimb'
import { solveHead } from './helpers/solveHead'
import { VRM } from '@pixiv/three-vrm'
import { solveSpine } from './helpers/solveSpine'
import { rigRotation, rigRotation2 } from '../../avatar/helpers/animationHelpers'
import { solveHand } from './helpers/solveHand'

const worldFilterAlphaMultiplier = 0.5
const screenFilterAlphaMultiplier = 0.2

/** Class representing pose solver. */
export class PoseSolver {
    /** expose smooth lerping animation as a static method */
    static keyframeInterpolation = keyframeInterpolation;
    /**
     * Solves the pose using 3D world landmarks and 2D screen landmarks
     * @param {Array} lm3d : array of 3D pose vectors from mediapipe
     * @param {Array} lm2d : array of 2D pose vectors from mediapipe
     * @returns {{
     *   lowestWorldY: number,
     *   worldLandmarks: TFVectorPose,
     *   screenLandmarks: Omit<TFVectorPose, "z">
     * }} An object containing the lowest world Y-coordinate reference and key interpolated world and screen landmarks.
     */
    static solve(
        lm3d: TFVectorPose,
        lm2d: Omit<TFVectorPose, "z">,
        vrm: React.RefObject<VRM>,
        enableLegs: boolean
    ) {
        if (!lm3d && !lm2d) {
            console.error("Need both 3D World Pose and 2D Pose Landmarks");
            return;
        }

        // originally initialized to null, storing lm from the previous frame of capture data.
        // when solve is called for the first time, checks for null and sets to first lm feed.
        if (!mocapComponent.prevWorldLandmarks) {
          mocapComponent.prevWorldLandmarks = lm3d.map((landmark) => ({...landmark}));
        }
        if (!mocapComponent.prevScreenLandmarks) {
          mocapComponent.prevScreenLandmarks = lm2d.map((landmark) => ({...landmark}));
        }

        const worldLandmarks = keyframeInterpolation(
          lm3d,
          mocapComponent.prevWorldLandmarks,
          worldFilterAlphaMultiplier
        );

        const screenLandmarks = keyframeInterpolation(
          lm2d,
          mocapComponent.prevScreenLandmarks,
          screenFilterAlphaMultiplier
        )

        mocapComponent.prevWorldLandmarks = worldLandmarks;
        mocapComponent.prevScreenLandmarks = screenLandmarks;

        // keeps the landmark with the highest y value (so lowest point b/c inverted)
        // used to establish a reference point for vertical positioning (normalization)
        const lowestWorldY = worldLandmarks.reduce((a, b) => (a.y > b.y ? a : b)).y

        solveSpine(vrm, lowestWorldY, worldLandmarks, enableLegs);
        solveHead();
        solveLimb(
          lowestWorldY,
          worldLandmarks[PoseIndices.RIGHT_SHOULDER],
          worldLandmarks[PoseIndices.RIGHT_ELBOW],
          worldLandmarks[PoseIndices.RIGHT_WRIST],
          new Vector3(1, 0, 0),
          "chest",
          "rightUpperArm",
          "rightLowerArm",
          0.75
        );
        solveLimb(
          lowestWorldY,
          worldLandmarks[PoseIndices.LEFT_SHOULDER],
          worldLandmarks[PoseIndices.LEFT_ELBOW],
          worldLandmarks[PoseIndices.LEFT_WRIST],
          new Vector3(-1, 0, 0),
          "chest",
          "leftUpperArm",
          "leftLowerArm",
          0.75
        );

        // TODO if feet enabled, do a solve and rig rotation for feet/lower body

        // rigRotation(vrm, "chest", mocapComponent.schema.rig.chest);
        // rigRotation(vrm, "spine", mocapComponent.schema.rig.spine);

        rigRotation(vrm, "rightUpperArm", mocapComponent.schema.rig.rightUpperArm);
        rigRotation(vrm, "rightLowerArm", mocapComponent.schema.rig.rightLowerArm);

        rigRotation(vrm, "leftUpperArm", mocapComponent.schema.rig.leftUpperArm);
        rigRotation(vrm, "leftLowerArm", mocapComponent.schema.rig.leftLowerArm);
    }
}

/** Class representing hand solver. */
export class HandSolver {
    /**
     * Calculates finger and wrist as euler rotations
     * @param {Array} lm : array of 3D hand vectors from tfjs or mediapipe
     * @param {Side} side: left or right
     */
    static solve(vrm: any, lm3d: Results, lm: Results, side: Side = RIGHT): THand<typeof side> | undefined {
        if (!lm) {
            console.error("Need Hand Landmarks");
            return;
        }
        const lowestWorldY = lm3d.reduce((a, b) => (a.y > b.y ? a : b)).y;
        solveHand(
          vrm,
          lowestWorldY,
          lm[PoseIndices.RIGHT_WRIST],
          lm[PoseIndices.RIGHT_PINKY],
          lm[PoseIndices.RIGHT_INDEX],
          "leftLowerArm",
          "leftHand"
        );
        solveHand(
          vrm,
          lowestWorldY,
          lm[PoseIndices.LEFT_WRIST],
          lm[PoseIndices.LEFT_PINKY],
          lm[PoseIndices.LEFT_INDEX],
          "rightLowerArm",
          "rightHand"
        );

        let hand: Record<string, unknown> = {};
        const handRotation = {
          x: side === RIGHT ? mocapComponent.schema.rig.rightHand.x : mocapComponent.schema.rig.leftHand.x,
          y: side === RIGHT ? mocapComponent.schema.rig.rightHand.y : mocapComponent.schema.rig.leftHand.y,
          z: side === RIGHT ? mocapComponent.schema.rig.leftHand.z : mocapComponent.schema.rig.leftHand.z
        }
        hand[side + "Wrist"] = handRotation;
        hand[side + "RingProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[13], lm[14]) };
        hand[side + "RingIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[13], lm[14], lm[15]) };
        hand[side + "RingDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[14], lm[15], lm[16]) };
        hand[side + "IndexProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[5], lm[6]) };
        hand[side + "IndexIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[5], lm[6], lm[7]) };
        hand[side + "IndexDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[6], lm[7], lm[8]) };
        hand[side + "MiddleProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[9], lm[10]) };
        hand[side + "MiddleIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[9], lm[10], lm[11]) };
        hand[side + "MiddleDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[10], lm[11], lm[12]) };
        hand[side + "ThumbProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[1], lm[2]) };
        hand[side + "ThumbIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[1], lm[2], lm[3]) };
        hand[side + "ThumbDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[2], lm[3], lm[4]) };
        hand[side + "LittleProximal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[17], lm[18]) };
        hand[side + "LittleIntermediate"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[17], lm[18], lm[19]) };
        hand[side + "LittleDistal"] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[18], lm[19], lm[20]) };

        hand = rigFingers(hand as THand<typeof side>, side);

        if (side === LEFT) {
          rigRotation2(vrm, "leftHand", {
            // Combine pose rotation Z and hand rotation X Y
            z: mocapComponent.schema.rig.leftHand.z,
            y: hand.LeftWrist.y,
            x: hand.LeftWrist.x
          });
          rigRotation2(vrm, "leftRingProximal", hand.LeftRingProximal);
          rigRotation2(vrm, "leftRingIntermediate", hand.LeftRingIntermediate);
          rigRotation2(vrm, "leftRingDistal", hand.LeftRingDistal);
          rigRotation2(vrm, "leftIndexProximal", hand.LeftIndexProximal);
          rigRotation2(vrm, "leftIndexIntermediate", hand.LeftIndexIntermediate);
          rigRotation2(vrm, "leftIndexDistal", hand.LeftIndexDistal);
          rigRotation2(vrm, "leftMiddleProximal", hand.LeftMiddleProximal);
          rigRotation2(vrm, "leftMiddleIntermediate", hand.LeftMiddleIntermediate);
          rigRotation2(vrm, "leftMiddleDistal", hand.LeftMiddleDistal);
          rigRotation2(vrm, "leftThumbProximal", hand.LeftThumbProximal);
          rigRotation2(vrm, "leftThumbIntermediate", hand.LeftThumbIntermediate);
          rigRotation2(vrm, "leftThumbDistal", hand.LeftThumbDistal);
          rigRotation2(vrm, "leftLittleProximal", hand.LeftLittleProximal);
          rigRotation2(vrm, "leftLittleIntermediate", hand.LeftLittleIntermediate);
          rigRotation2(vrm, "leftLittleDistal", hand.LeftLittleDistal);
        }

        if (side === RIGHT) {
          rigRotation2(vrm, "rightHand", {
            // Combine pose rotation Z and hand rotation X Y
            z: mocapComponent.schema.rig.rightHand.z,
            y: hand.RightWrist.y,
            x: hand.RightWrist.x
          });
          rigRotation2(vrm, "rightRingProximal", hand.RightRingProximal);
          rigRotation2(vrm, "rightRingIntermediate", hand.RightRingIntermediate);
          rigRotation2(vrm, "rightRingDistal", hand.RightRingDistal);
          rigRotation2(vrm, "rightIndexProximal", hand.RightIndexProximal);
          rigRotation2(vrm, "rightIndexIntermediate", hand.RightIndexIntermediate);
          rigRotation2(vrm, "rightIndexDistal", hand.RightIndexDistal);
          rigRotation2(vrm, "rightMiddleProximal", hand.RightMiddleProximal);
          rigRotation2(vrm, "rightMiddleIntermediate", hand.RightMiddleIntermediate);
          rigRotation2(vrm, "rightMiddleDistal", hand.RightMiddleDistal);
          rigRotation2(vrm, "rightThumbProximal", hand.RightThumbProximal);
          rigRotation2(vrm, "rightThumbIntermediate", hand.RightThumbIntermediate);
          rigRotation2(vrm, "rightThumbDistal", hand.RightThumbDistal);
          rigRotation2(vrm, "rightLittleProximal", hand.RightLittleProximal);
          rigRotation2(vrm, "rightLittleIntermediate", hand.RightLittleIntermediate);
          rigRotation2(vrm, "rightLittleDistal", hand.RightLittleDistal);
        }

        return hand as THand<typeof side>;
    }
}

/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} hand : object of labeled joint with normalized rotation values
 * @param {Side} side : left or right
 */
const rigFingers = (hand: THandUnsafe<typeof side>, side: Side = RIGHT): THand<typeof side> => {
    // Invert modifier based on left vs right side
    const invert = side === RIGHT ? 1 : -1;
    const digits = ["Ring", "Index", "Little", "Thumb", "Middle"];
    const segments = ["Proximal", "Intermediate", "Distal"];

    hand[side + "Wrist"].x = clamp(hand[side + "Wrist"].x * 2 * invert, -0.3, 0.3); // twist
    hand[side + "Wrist"].y = clamp(
        hand[side + "Wrist"].y * 2.3,
        side === RIGHT ? -1.1 : -0.4, // -1.2, -0.6
        side === RIGHT ? 0.4 : 1.1 //0.6,  1.6
    );
    //                                               -2.3
    // hand[side + "Wrist"].z = hand[side + "Wrist"].z * -2.3 * invert; //left right

    digits.forEach((e) => {
        segments.forEach((j) => {
            const trackedFinger = hand[side + e + j];

            if (e === "Thumb") {
                //dampen thumb rotation depending on segment
                const dampener = {
                    x: j === "Proximal" ? 2.2 : j === "Intermediate" ? 0 : 0,
                    y: j === "Proximal" ? 2.2 : j === "Intermediate" ? 0.7 : 1,
                    z: j === "Proximal" ? 0.5 : j === "Intermediate" ? 0.5 : 0.5,
                };
                const startPos = {
                    x: j === "Proximal" ? 1.2 : j === "Distal" ? -0.2 : -0.2,
                    y: j === "Proximal" ? 1.1 * invert : j === "Distal" ? 0.1 * invert : 0.1 * invert,
                    z: j === "Proximal" ? 0.2 * invert : j === "Distal" ? 0.2 * invert : 0.2 * invert,
                };
                const newThumb = { x: 0, y: 0, z: 0 };
                if (j === "Proximal") {
                    newThumb.z = clamp(
                        startPos.z + trackedFinger.z * -PI * dampener.z * invert,
                        side === RIGHT ? -0.6 : -0.3,
                        side === RIGHT ? 0.3 : 0.6
                    );
                    newThumb.x = clamp(startPos.x + trackedFinger.z * -PI * dampener.x, -0.6, 0.3);
                    newThumb.y = clamp(
                        startPos.y + trackedFinger.z * -PI * dampener.y * invert,
                        side === RIGHT ? -1 : -0.3,
                        side === RIGHT ? 0.3 : 1
                    );
                } else {
                    newThumb.z = clamp(startPos.z + trackedFinger.z * -PI * dampener.z * invert, -2, 2);
                    newThumb.x = clamp(startPos.x + trackedFinger.z * -PI * dampener.x, -2, 2);
                    newThumb.y = clamp(startPos.y + trackedFinger.z * -PI * dampener.y * invert, -2, 2);
                }
                trackedFinger.x = newThumb.x;
                trackedFinger.y = newThumb.y;
                trackedFinger.z = newThumb.z;
            } else {
                //will document human limits later
                trackedFinger.z = clamp(
                    trackedFinger.z * -PI * invert,
                    side === RIGHT ? -PI : 0,
                    side === RIGHT ? 0 : PI
                );
            }
        });
    });
    return hand as THand<typeof side>;
};