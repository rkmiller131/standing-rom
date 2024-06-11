import { CollideBeginEvent, CollideEndEvent, CollideEvent, useSphere } from '@react-three/cannon';
import { forwardRef } from 'react';
import { Object3D } from 'three';

interface ColliderComponent {
  position: [number, number, number];
  type?: 'Kinematic' | 'Dynamic' | 'Static';
  onCollide?: (event: CollideEvent) => void;
  onCollideBegin?: (event: CollideBeginEvent) => void;
  onCollideEnd?: (event: CollideEndEvent) => void;
}

const SphereCollider = forwardRef<Object3D, Omit<ColliderComponent, 'ref'>>(({
  position,
  onCollide,
  onCollideBegin,
  onCollideEnd,
  type = 'Dynamic'
}, ref) => {
  useSphere(() => ({
    position,
    onCollide,
    onCollideBegin,
    onCollideEnd,
    type,
    args: [0.07],
  }), ref); // Directly pass the forwarded ref to useSphere - this will allow parent components access to this child ref

  return null;
});

export default SphereCollider;
export type { ColliderComponent };


