import { LEFT, Results, RIGHT } from '../constants/Types';
import Vector from '../constants/Vector';
import { rigArm } from '../rigging/rigArm';
import { clamp } from 'three/src/math/MathUtils.js';

/**
 * Calculates arm rotation as euler angles
 * @param {Array} lm : array of 3D pose vectors from mediapipe
 */
export const calcArms = (lm: Results) => {
    // Pure Rotation Calculations
    const UpperArm = {
      r: Vector.findRotation(lm[11], lm[13]),
      l: Vector.findRotation(lm[12], lm[14]),
    };
    UpperArm.r.y = Vector.angleBetween3DCoords(lm[12], lm[11], lm[13]);
    UpperArm.l.y = Vector.angleBetween3DCoords(lm[11], lm[12], lm[14]);

    const LowerArm = {
      r: Vector.findRotation(lm[13], lm[15]),
      l: Vector.findRotation(lm[14], lm[16]),
    };
    LowerArm.r.y = Vector.angleBetween3DCoords(lm[11], lm[13], lm[15]);
    LowerArm.l.y = Vector.angleBetween3DCoords(lm[12], lm[14], lm[16]);
    LowerArm.r.z = clamp(LowerArm.r.z, -2.14, 0);
    LowerArm.l.z = clamp(LowerArm.l.z, -2.14, 0);

    const Wrist = {
      r: Vector.findRotation(
        Vector.fromArray(lm[16]),
        Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5),
      ),
      l: Vector.findRotation(
        Vector.fromArray(lm[15]),
        Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5),
      ),
    };

    Wrist.r.z = Vector.angleBetween3DCoords(
      lm[14],
      lm[16],
      Vector.lerp(Vector.fromArray(lm[18]), Vector.fromArray(lm[20]), 0.5),
    );
    Wrist.l.z = Vector.angleBetween3DCoords(
      lm[13],
      lm[15],
      Vector.lerp(Vector.fromArray(lm[17]), Vector.fromArray(lm[19]), 0.5),
    );
    Wrist.r.z = clamp(Wrist.r.z, -2.14, 0);
    Wrist.l.z = clamp(Wrist.l.z, -2.14, 0); // z is wrist movement side to side (abduction/adduction)

    const Hand = {
      r: LowerArm.r.multiply(Wrist.r),
      l: LowerArm.l.multiply(Wrist.l),
    };

    // Modify Rotations slightly for more natural movement
    const rightArmRig = rigArm(UpperArm.r, LowerArm.r, Hand.r, RIGHT);
    const leftArmRig = rigArm(UpperArm.l, LowerArm.l, Hand.l, LEFT);

    return {
      //Scaled
      UpperArm: {
        r: rightArmRig.UpperArm,
        l: leftArmRig.UpperArm,
      },
      LowerArm: {
        r: rightArmRig.LowerArm,
        l: leftArmRig.LowerArm,
      },
      Hand: {
        r: rightArmRig.Hand,
        l: leftArmRig.Hand,
      },
      //Unscaled
      Unscaled: {
        UpperArm: UpperArm,
        LowerArm: LowerArm,
        Hand: Hand,
      },
    };
  };