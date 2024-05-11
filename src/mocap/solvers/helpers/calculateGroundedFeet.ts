import { TFVectorPose } from '../Types'
import { PoseIndices } from '../constants'

const rightFootHistory = [] as number[]
const leftFootHistory = [] as number[]
const feetGrounded = [false, false]
const footAverageDifferenceThreshold = 0.05
const footLevelDifferenceThreshold = 0.035

/**
 * Calculates which feet are grounded based on landmarks.
 * Operates on the assumption that the user is on a plane,
 * such that the lowest foot with no vertical motion over the past 10 frames is always the grounded foot.
 * @param {TFVectorPose} newLandmarks - The new landmarks containing foot positions.
 * @returns {boolean[]} An array indicating whether each foot is grounded (true) or not (false) [right, left].
 */
export const calculateGroundedFeet = (newLandmarks: TFVectorPose) => {
  //assign right foot y to index 0, left foot y to index 1
  const footVerticalPositions = [
    newLandmarks[PoseIndices.RIGHT_ANKLE].y,
    newLandmarks[PoseIndices.LEFT_ANKLE].y
  ]

  if (!footVerticalPositions[0] || !footVerticalPositions[1]) return

  //average history
  const footAverages = [
    rightFootHistory.reduce((a, b) => a + b, 0) / rightFootHistory.length,
    leftFootHistory.reduce((a, b) => a + b, 0) / leftFootHistory.length
  ]

  //then update history
  rightFootHistory.push(footVerticalPositions[0])
  leftFootHistory.push(footVerticalPositions[1])
  if (rightFootHistory.length > 10) rightFootHistory.shift()
  if (leftFootHistory.length > 10) leftFootHistory.shift()

  //determine if grounded for each foot
  for (let i = 0; i < 2; i++) {
    //difference between current landmark y and average y from history
    const footMoving = Math.abs(footVerticalPositions[i] - footAverages[i]) > footAverageDifferenceThreshold
    //compare foot level for right and left foot
    const footLevel = Math.abs(footVerticalPositions[i] - footVerticalPositions[i == 0 ? 1 : 0]) < footLevelDifferenceThreshold
    const isLowestFoot = footVerticalPositions[i] > footVerticalPositions[i == 0 ? 1 : 0]
    if (feetGrounded[i]) {
      if (footMoving && !footLevel) {
        feetGrounded[i] = false
      }
    } else {
      if ((isLowestFoot || footLevel) && !footMoving) feetGrounded[i] = true
    }
  }
  return feetGrounded
}