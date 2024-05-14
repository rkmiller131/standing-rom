import { Vector3 } from 'three'

// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker
export const PoseIndices = {
  NOSE: 0,

  LEFT_EYE_INNER: 1,
  LEFT_EYE: 2,
  LEFT_EYE_OUTER: 3,
  LEFT_EAR: 7,
  LEFT_MOUTH: 9,
  LEFT_SHOULDER: 11,
  LEFT_ELBOW: 13,
  LEFT_WRIST: 15,
  LEFT_PINKY: 17,
  LEFT_INDEX: 19,
  LEFT_THUMB: 21,
  LEFT_HIP: 23,
  LEFT_KNEE: 25,
  LEFT_ANKLE: 27,
  LEFT_HEEL: 29,
  LEFT_FOOT_INDEX: 31,

  RIGHT_EYE_INNER: 4,
  RIGHT_EYE: 5,
  RIGHT_EYE_OUTER: 6,
  RIGHT_EAR: 8,
  RIGHT_MOUTH: 10,
  RIGHT_SHOULDER: 12,
  RIGHT_ELBOW: 14,
  RIGHT_WRIST: 16,
  RIGHT_PINKY: 18,
  RIGHT_INDEX: 20,
  RIGHT_THUMB: 22,
  RIGHT_HIP: 24,
  RIGHT_KNEE: 26,
  RIGHT_ANKLE: 28,
  RIGHT_HEEL: 30,
  RIGHT_FOOT_INDEX: 32
}

export const HandIndices = {
  WRIST: 0,
  THUMB_CMC: 1,
  THUMB_MCP: 2,
  THUMB_IP: 3,
  THUMB_TIP: 4,
  INDEX_FINGER_MCP: 5,
  INDEX_FINGER_PIP: 6,
  INDEX_FINGER_DIP: 7,
  INDEX_FINGER_TIP: 8,
  MIDDLE_FINGER_MCP: 9,
  MIDDLE_FINGER_PIP: 10,
  MIDDLE_FINGER_DIP: 11,
  MIDDLE_FINGER_TIP: 12,
  RING_FINGER_MCP: 13,
  RING_FINGER_PIP: 14,
  RING_FINGER_DIP: 15,
  RING_FINGER_TIP: 16,
  PINKY_MCP: 17,
  PINKY_PIP: 18,
  PINKY_DIP: 19,
  PINKY_TIP: 20
}

export const RIGHT = 'Right';
export const LEFT = 'Left';

export const PI = Math.PI;
export const TWO_PI = Math.PI * 2;

/** const Vector3(1,0,0) */
export const Vector3_Right = Object.freeze(new Vector3(1, 0, 0));

/** const Vector3(-1,0,0) */
export const Vector3_Left = Object.freeze(new Vector3(-1, 0, 0));

/** const Vector3(0,1,0) */
export const Vector3_Up = Object.freeze(new Vector3(0, 1, 0));