/* eslint-disable react-refresh/only-export-components */
import {
  CollideBeginEvent,
  CollideEndEvent,
  CollideEvent,
  PublicApi,
  useSphere
} from '@react-three/cannon';
import { memo, useEffect, useMemo } from 'react';
import { Vector3 } from 'three';

export type BubbleColliderProps = {
  onAttachRefs: (api: PublicApi) => void;
  position: Vector3;
  type?: 'Kinematic' | 'Dynamic' | 'Static';
  onCollide?: (event: CollideEvent) => void;
  onCollideBegin?: ((event: CollideBeginEvent) => void) | null | undefined;
  onCollideEnd?: (event: CollideEndEvent) => void;
};

const BubbleCollider = ({
  onAttachRefs,
  position,
  type = 'Dynamic',
  onCollide,
  onCollideBegin,
  onCollideEnd
}: BubbleColliderProps) => {

  const collisionFilterGroup = 1 << 2 // Bubbles assigned to group 4 (2^2)
  const collisionFilterMask = (1 << 0) | (1 << 1) // Allow interaction with hands (group 1 and 2)

  const sphereConfig = useMemo(() => ({
    position: [position.x, position.y, position.z] as [x: number, y: number, z: number],
    onCollide,
    onCollideBegin: onCollideBegin || (() => {}),
    onCollideEnd,
    args: [0.05] as [radius: number],
    type,
    collisionFilterGroup,
    collisionFilterMask
  }), [position.x, position.y, position.z, onCollide, onCollideBegin, onCollideEnd, type, collisionFilterGroup, collisionFilterMask]);

  const [, api] = useSphere(() => sphereConfig);

  useEffect(() => {
    if (onAttachRefs) onAttachRefs(api);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default memo(BubbleCollider);