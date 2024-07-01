import { Vec3, World } from 'cannon-es';
import Bubble from './classes/Bubble';
import HandCollider from './classes/HandCollider';

export const world = new World({
  gravity: new Vec3(0, 0, 0),
})

interface WorldBubbleManager {
  [key: number]: Bubble;
}

interface WorldHandColliderManager {
  [key: number]: HandCollider
}

export const worldBubbleManager: WorldBubbleManager = {};
export const worldHandColliderManager: WorldHandColliderManager = {}

export const onCollideBegin = new Event('onCollideBegin');