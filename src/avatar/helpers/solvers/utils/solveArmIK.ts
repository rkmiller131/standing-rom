import { VRM_to_MP_Indices } from "../constants"

export function solveArmIK(vrm, mediapipeLandmarks, side) {
  const ikChain = [
    vrm.current.humanoid.humanBones[side + 'UpperArm'].node,
    vrm.current.humanoid.humanBones[side + 'LowerArm'].node,
    vrm.currnet.humanoid.humanBones[side + 'Hand'].node
  ]

  const positions = ikChain.map((bone, index) => {
    const landmarkIndex = VRM_to_MP_Indices[side + ]
  })
}