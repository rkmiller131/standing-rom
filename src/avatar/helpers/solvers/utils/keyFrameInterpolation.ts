import { MathUtils } from 'three'
import { TFVectorPose } from '../Types'

/**
 * Performs keyframe interpolation between previous and new landmarks to smooth animation.
 * @param {TFVectorPose} newLandmarks - The new landmarks to interpolate towards.
 * @param {TFVectorPose} prevLandmarks - The previous landmarks to interpolate from.
 * @param {number} alphaMultiplier - A multiplier determining the influence of the new landmarks.
 * @returns {TFVectorPose} The filtered landmarks after interpolation.
 */
export default function keyframeInterpolation (
  newLandmarks: TFVectorPose,
  prevLandmarks: TFVectorPose,
  alphaMultiplier: number
): TFVectorPose {
  if (!prevLandmarks.length) return newLandmarks;
  // low-pass filter allows lower freq signals (slow movements)
  // to pass through while attenuating rapid, possibly noisy movements
  const lowPassLandmarks = [] as TFVectorPose;
  // further processed  from lowPass filter to store final updates for animation
  const filteredLandmarks = [] as TFVectorPose;

  for (let i = 0; i < newLandmarks.length; i++) {
    // visibility is a value between 0 and 1 that indicates the confidence
    // of the landmark's detection; higher value means higher confidence
    if (newLandmarks[i].visibility! < 0.1) {
      // if low confidence in visibility, just use the previous, less noisy lm
      lowPassLandmarks[i] = prevLandmarks[i];
      filteredLandmarks[i] = prevLandmarks[i];
      continue;
    }
    // a higher alpha means the new lm will have more influence on the result than prev
    const alpha = alphaMultiplier;
    lowPassLandmarks[i] = {
      visibility: MathUtils.lerp(prevLandmarks[i].visibility!, newLandmarks[i].visibility!, alpha),
      x: MathUtils.lerp(prevLandmarks[i].x, newLandmarks[i].x, newLandmarks[i].visibility!),
      y: MathUtils.lerp(prevLandmarks[i].y, newLandmarks[i].y, newLandmarks[i].visibility!),
      z: MathUtils.lerp(prevLandmarks[i].z, newLandmarks[i].z, newLandmarks[i].visibility!),
    }
    filteredLandmarks[i] = {
      visibility: MathUtils.lerp(prevLandmarks[i].visibility!, lowPassLandmarks[i].visibility!, alpha),
      x: MathUtils.lerp(prevLandmarks[i].x, lowPassLandmarks[i].x, alpha),
      y: MathUtils.lerp(prevLandmarks[i].y, lowPassLandmarks[i].y, alpha),
      z: MathUtils.lerp(prevLandmarks[i].z, lowPassLandmarks[i].z, alpha),
    }
  }
  return filteredLandmarks;
}