import { LEFT, RIGHT } from './constants'
import Euler from './utils/euler'
import Vector from './utils/vector'

export type TFVectorPose = Array<{
  x: number;
  y: number;
  z: number;
  score?: number;
  visibility?: number;
}>;

/**
 * Represents a single normalized landmark.
 */
export type NormalizedLandmark = {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export type TPose = {
  RightUpperArm: Euler;
  RightLowerArm: Euler;
  LeftUpperArm: Euler;
  LeftLowerArm: Euler;
  RightHand: Vector;
  LeftHand: Vector;
  RightUpperLeg: Euler | XYZ;
  RightLowerLeg: Euler | XYZ;
  LeftUpperLeg: Euler | XYZ;
  LeftLowerLeg: Euler | XYZ;
  Hips: IHips;
  Spine: Vector | XYZ;
};

export interface IPoseSolveOptions {
  /**
   * Toggle Calculation of legs
   * @type {boolean}
   * @default true
   */
  enableLegs: boolean;
}

/**
 * The left or the right side
 */
export type Side = typeof RIGHT | typeof LEFT;

export type XYZ = Record<"x" | "y" | "z", number>;

export type LR<T = Vector> = Record<"l" | "r", T>;
export type RotationOrder = "XYZ" | "YZX" | "ZXY" | "XZY" | "YXZ" | "ZYX";

export type EulerRotation = XYZ & { rotationOrder?: RotationOrder };

export type AxisMap = Record<"x" | "y" | "z", "x" | "y" | "z">;

export interface IHips {
    position: XYZ;
    rotation?: Vector;
    worldPosition?: XYZ;
}

type Quaternion = {
  x: number;
  y: number;
  z: number;
  w: number;
};

export const QuaternionSchema: Quaternion = {
  x: 0,
  y: 0,
  z: 0,
  w: 0
};

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export const Vector3Schema: Vector3 = {
  x: 0,
  y: 0,
  z: 0,
};