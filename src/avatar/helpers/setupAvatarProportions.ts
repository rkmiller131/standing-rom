import { VRM } from '@pixiv/three-vrm';
import { Box3, Vector3 } from 'three';

interface AvatarProportions {
  avatarHeight: number;
  eyeHeight: number;
  handHeight: number;
  hipsHeight: number;
  footHeight: number;
  armLength: number;
  torsoLength: number;
  upperLegLength: number;
  lowerLegLength: number;
  footGap: number;

  hipsPos: Vector3;
  headPos: Vector3;
  leftFootPos: Vector3;
  rightFootPos: Vector3;
  leftLowerLegPos: Vector3;
  leftUpperLegPos: Vector3;
  rightLowerLegPos: Vector3;
  rightUpperLegPos: Vector3;
  eyePos: Vector3;
}

export const avatarProportions: AvatarProportions = {} as AvatarProportions;

const hipsPos = new Vector3(),
  headPos = new Vector3(),
  leftFootPos = new Vector3(),
  rightFootPos = new Vector3(),
  leftLowerLegPos = new Vector3(),
  leftUpperLegPos = new Vector3(),
  footGap = new Vector3(),
  eyePos = new Vector3(),
  size = new Vector3(),
  box = new Box3();

/**
 * Calculates and sets various initial proportions and positions of a VRM avatar model at the time of spawn.
 *
 * @param {VRM} vrm - The VRM model instance to calculate proportions for.
 * @returns {AvatarProportions} An object containing the calculated proportions and positions of the avatar.
 */
export function setupAvatarProportions(vrm: VRM): AvatarProportions {
  // bounding box set to the avatar model (to get height)
  box.expandByObject(vrm.scene).getSize(size)

  // get the vector 3 positions of major body parts
  const rawRig = vrm.humanoid.humanBones;
  avatarProportions.hipsPos = rawRig.hips.node.getWorldPosition(hipsPos);
  avatarProportions.headPos = rawRig.head.node.getWorldPosition(headPos);
  avatarProportions.eyePos = rawRig.leftEye ? rawRig.leftEye.node.getWorldPosition(eyePos) : eyePos.copy(avatarProportions.headPos).setY(avatarProportions.headPos.y + 0.1); // fallback to rough estimation if no eye bone is present
  avatarProportions.leftFootPos = rawRig.leftFoot.node.getWorldPosition(leftFootPos);
  avatarProportions.rightFootPos = rawRig.rightFoot.node.getWorldPosition(rightFootPos);
  avatarProportions.leftLowerLegPos = rawRig.leftLowerLeg.node.getWorldPosition(leftLowerLegPos);
  avatarProportions.leftUpperLegPos = rawRig.leftUpperLeg.node.getWorldPosition(leftUpperLegPos);

  // calculate lengths and heights based on positions
  avatarProportions.avatarHeight = size.y;
  avatarProportions.eyeHeight = avatarProportions.eyePos.y;
  avatarProportions.handHeight = avatarProportions.eyeHeight - 0.5 * avatarProportions.avatarHeight;
  avatarProportions.hipsHeight = avatarProportions.hipsPos.y;
  avatarProportions.footHeight = avatarProportions.leftFootPos.y;
  avatarProportions.armLength = avatarProportions.avatarHeight / 2;
  avatarProportions.torsoLength = Math.abs(avatarProportions.headPos.y - avatarProportions.hipsPos.y);
  avatarProportions.upperLegLength = Math.abs(avatarProportions.hipsPos.y - avatarProportions.leftLowerLegPos.y);
  avatarProportions.lowerLegLength = Math.abs(avatarProportions.leftLowerLegPos.y - avatarProportions.leftFootPos.y);
  avatarProportions.footGap = footGap.subVectors(avatarProportions.leftFootPos, avatarProportions.rightFootPos).length();

  return avatarProportions;
}