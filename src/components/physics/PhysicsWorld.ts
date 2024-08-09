import { Vec3, World, Body } from 'cannon-es';

export const world = new World({
  gravity: new Vec3(0, 0, 0),
})

interface ColliderManagerType {
  [key: number]: Body;
}

export const worldBubbleManager: ColliderManagerType = {};
export const worldHandColliderManager: ColliderManagerType = {};