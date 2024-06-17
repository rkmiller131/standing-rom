import { CollideBeginEvent, CollideEndEvent, CollideEvent, PublicApi, useSphere } from '@react-three/cannon';
import { useEffect } from 'react';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap } from 'three';

export type SphereColliderComponent = {
  onAttachRefs: (ref: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>, api: PublicApi) => void;
  position: [number, number, number];
  type?: 'Kinematic' | 'Dynamic' | 'Static';
  onCollide?: (event: CollideEvent) => void;
  onCollideBegin?: ((event: CollideBeginEvent) => void) | null | undefined;
  onCollideEnd?: (event: CollideEndEvent) => void;
}

export default function SphereCollider({
  onAttachRefs,
  position,
  type = 'Dynamic',
  onCollide,
  onCollideBegin,
  onCollideEnd
  }: SphereColliderComponent
) {
  const [ref, api] = useSphere(() => ({
    position: [...position],
    onCollide,
    onCollideBegin: onCollideBegin ? onCollideBegin : () => {},
    onCollideEnd,
    args: [0.07],
    type,
  }));

  console.log('sphere collider rendered')

  useEffect(() => {
    if (onAttachRefs) {
      onAttachRefs(ref as React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>, api);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // Returns null because the ref intended for the visual mesh is passed through the onAttachRefs callback
}


