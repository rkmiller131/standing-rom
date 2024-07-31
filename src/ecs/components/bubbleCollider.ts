import {
  CollideBeginEvent,
  CollideEndEvent,
  CollideEvent,
  PublicApi
} from '@react-three/cannon';
import { Vector3 } from 'three';

export type BubbleCollider = {
  onAttachRefs: (api: PublicApi) => void;
  position: Vector3;
  type?: 'Kinematic' | 'Dynamic' | 'Static';
  onCollide?: (event: CollideEvent) => void;
  onCollideBegin?: ((event: CollideBeginEvent) => void) | null | undefined;
  onCollideEnd?: (event: CollideEndEvent) => void;
}