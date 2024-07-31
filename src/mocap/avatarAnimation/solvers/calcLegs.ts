import { LEFT, Results, RIGHT } from '../constants/Types';
import Vector from '../constants/Vector';
import { rigLeg } from '../rigging/rigLeg';

/**
 * Calculates leg rotation angles
 * @param {Results} lm : array of 3D pose vectors from mediapipe
 */
export const calcLegs = (lm: Results) => {
  const rightUpperLegSphericalCoords = Vector.getSphericalCoords(
    lm[23],
    lm[25],
    { x: 'y', y: 'z', z: 'x' },
  );
  const leftUpperLegSphericalCoords = Vector.getSphericalCoords(
    lm[24],
    lm[26],
    { x: 'y', y: 'z', z: 'x' },
  );
  const rightLowerLegSphericalCoords = Vector.getRelativeSphericalCoords(
    lm[23],
    lm[25],
    lm[27],
    {
      x: 'y',
      y: 'z',
      z: 'x',
    },
  );
  const leftLowerLegSphericalCoords = Vector.getRelativeSphericalCoords(
    lm[24],
    lm[26],
    lm[28],
    {
      x: 'y',
      y: 'z',
      z: 'x',
    },
  );
  const hipRotation = Vector.findRotation(lm[23], lm[24]);

  const UpperLeg = {
    r: new Vector({
      x: rightUpperLegSphericalCoords.theta,
      y: rightLowerLegSphericalCoords.phi,
      z: rightUpperLegSphericalCoords.phi - hipRotation.z,
    }),
    l: new Vector({
      x: leftUpperLegSphericalCoords.theta,
      y: leftLowerLegSphericalCoords.phi,
      z: leftUpperLegSphericalCoords.phi - hipRotation.z,
    }),
  };

  const LowerLeg = {
    r: new Vector({
      x: -Math.abs(rightLowerLegSphericalCoords.theta),
      y: 0, // not relevant
      z: 0, // not relevant
    }),
    l: new Vector({
      x: -Math.abs(leftLowerLegSphericalCoords.theta),
      y: 0, // not relevant
      z: 0, // not relevant
    }),
  };

  // Modify Rotations slightly for more natural movement
  const rightLegRig = rigLeg(UpperLeg.r, LowerLeg.r, RIGHT);
  const leftLegRig = rigLeg(UpperLeg.l, LowerLeg.l, LEFT);

  return {
    // Scaled
    UpperLeg: {
      r: rightLegRig.UpperLeg,
      l: leftLegRig.UpperLeg,
    },
    LowerLeg: {
      r: rightLegRig.LowerLeg,
      l: leftLegRig.LowerLeg,
    },
    // Unscaled
    Unscaled: {
      UpperLeg,
      LowerLeg,
    },
  };
};