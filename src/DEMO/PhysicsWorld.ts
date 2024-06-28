import { Vec3, World } from 'cannon-es';
import Bubble from './vanillaBubble';

export const world = new World({
  gravity: new Vec3(0, 0, 0),
})

interface WorldBubbleManager {
  [key: number]: Bubble;
}

export const worldBubbleManager: WorldBubbleManager = {};

export const onCollideBegin = new Event('onCollideBegin');