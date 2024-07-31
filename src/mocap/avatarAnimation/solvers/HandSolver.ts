import { LEFT, Results, RIGHT, Side, THand } from '../constants/Types';
import Vector from '../constants/Vector';
import { rigFingers } from '../rigging/rigFingers';

/** Class representing hand solver. */
export class HandSolver {
  /**
   * Calculates finger and wrist as euler rotations
   * @param {Array} lm : array of 3D hand vectors from mediapipe
   * @param {Side} side: left or right
   */
  static solve(lm: Results, side: Side = RIGHT): THand<typeof side> | undefined {
      if (!lm) {
          console.error('Need Hand Landmarks');
          return;
      }
      const palm = [
          new Vector(lm[0]),
          new Vector(lm[side === RIGHT ? 17 : 5]),
          new Vector(lm[side === RIGHT ? 5 : 17]),
      ];
      const handRotation = Vector.rollPitchYaw(palm[0], palm[1], palm[2]);
      handRotation.y = handRotation.z;
      handRotation.y -= side === LEFT ? 0.2 : -0.2;

      let hand: Record<string, unknown> = {};
      hand[side + 'Wrist'] = { x: handRotation.x, y: handRotation.y, z: handRotation.z };
      hand[side + 'RingProximal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[13], lm[14]) };
      hand[side + 'RingIntermediate'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[13], lm[14], lm[15]) };
      hand[side + 'RingDistal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[14], lm[15], lm[16]) };
      hand[side + 'IndexProximal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[5], lm[6]) };
      hand[side + 'IndexIntermediate'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[5], lm[6], lm[7]) };
      hand[side + 'IndexDistal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[6], lm[7], lm[8]) };
      hand[side + 'MiddleProximal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[9], lm[10]) };
      hand[side + 'MiddleIntermediate'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[9], lm[10], lm[11]) };
      hand[side + 'MiddleDistal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[10], lm[11], lm[12]) };
      hand[side + 'ThumbProximal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[1], lm[2]) };
      hand[side + 'ThumbIntermediate'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[1], lm[2], lm[3]) };
      hand[side + 'ThumbDistal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[2], lm[3], lm[4]) };
      hand[side + 'LittleProximal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[0], lm[17], lm[18]) };
      hand[side + 'LittleIntermediate'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[17], lm[18], lm[19]) };
      hand[side + 'LittleDistal'] = { x: 0, y: 0, z: Vector.angleBetween3DCoords(lm[18], lm[19], lm[20]) };

      hand = rigFingers(hand as THand<typeof side>, side);

      return hand as THand<typeof side>;
  }
}
