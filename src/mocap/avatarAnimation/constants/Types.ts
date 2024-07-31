import Vector from './Vector';
import Euler from './Euler';

// CONSTANT VARIABLES -------------------------------------------
export const RIGHT = 'Right';
export const LEFT = 'Left';

export const PI = Math.PI;
export const TWO_PI = Math.PI * 2;
// --------------------------------------------------------------

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

export type XYZ = Record<'x' | 'y' | 'z', number>;

export type LR<T = Vector> = Record<'l' | 'r', T>;
export type RotationOrder = 'XYZ' | 'YZX' | 'ZXY' | 'XZY' | 'YXZ' | 'ZYX';

export type EulerRotation = XYZ & { rotationOrder?: RotationOrder };

export type AxisMap = Record<'x' | 'y' | 'z', 'x' | 'y' | 'z'>;

export interface IHips {
  position: XYZ;
  rotation?: Vector;
  worldPosition?: XYZ;
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

export type HandKeys<S extends Side> = `${S}${
  | 'Wrist'
  | 'RingProximal'
  | 'RingIntermediate'
  | 'RingDistal'
  | 'IndexProximal'
  | 'IndexIntermediate'
  | 'IndexDistal'
  | 'MiddleProximal'
  | 'MiddleIntermediate'
  | 'MiddleDistal'
  | 'ThumbProximal'
  | 'ThumbIntermediate'
  | 'ThumbDistal'
  | 'LittleProximal'
  | 'LittleIntermediate'
  | 'LittleDistal'}`;
export type THand<S extends Side> = Record<HandKeys<S>, XYZ>;
export type THandUnsafe<S extends Side> = Record<HandKeys<S> | string, XYZ>;

/**
 * Mediapipe 3D Pose Vector Type
 */
export type MPVectorPose = Array<{
  x: number;
  y: number;
  z: number;
  visibility: number;
}>;

/**
 * Array of results from MediaPipe
 */
export type Results = Array<XYZ>;