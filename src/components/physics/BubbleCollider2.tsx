import { Body, Sphere } from 'cannon-es';
import { useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import { world, worldBubbleManager } from './PhysicsWorld';

export type BubbleColliderProps = {
  position: Vector3;
  handleBubbleCollision: ({ bodyB }: { bodyB: Body }) => void;
};

const COLLISION_GROUP = 1 << 2; // Bubbles assigned to group 4 (2^2)
const COLLISION_MASK = (1 << 0) | (1 << 1); // Allow interaction with hands (group 1 and 2)

export default function BubbleCollider2({ position, handleBubbleCollision }: BubbleColliderProps) {
  const bodyRef = useRef<Body | null>(null);

  useEffect(() => {
    if (!bodyRef.current) {
      bodyRef.current = new Body({
        mass: 1,
        shape: new Sphere(0.05),
        type: Body.DYNAMIC,
        collisionResponse: false,
        collisionFilterGroup: COLLISION_GROUP,
        collisionFilterMask: COLLISION_MASK
      })
    }

    bodyRef.current.position.set(position.x, position.y, position.z);
    worldBubbleManager[bodyRef.current.id] = bodyRef.current;
    world.addEventListener('beginContact', handleBubbleCollision);
    world.addBody(bodyRef.current);

  }, [handleBubbleCollision, position]);

  return null;
}