// import { CollideBeginEvent, CollideEndEvent, CollideEvent, PublicApi, useSphere } from '@react-three/cannon';
// import { useEffect } from 'react';
// import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap, Vector3 } from 'three';

// export type SphereColliderComponent = {
//   onAttachRefs: (ref: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>, api: PublicApi) => void;
//   position: Vector3;
//   type?: 'Kinematic' | 'Dynamic' | 'Static';
//   onCollide?: (event: CollideEvent) => void;
//   onCollideBegin?: ((event: CollideBeginEvent) => void) | null | undefined;
//   onCollideEnd?: (event: CollideEndEvent) => void;
// }

// export default function SphereCollider({
//   onAttachRefs,
//   position,
//   type = 'Dynamic',
//   onCollide,
//   onCollideBegin,
//   onCollideEnd
//   }: SphereColliderComponent
// ) {
//   const [ref, api] = useSphere(() => ({
//     position: [position.x, position.y, position.z],
//     onCollide,
//     onCollideBegin: onCollideBegin ? onCollideBegin : () => {},
//     onCollideEnd,
//     args: [0.05],
//     type,
//   }));

//   console.log('sphere collider rendered')

//   useEffect(() => {
//     if (onAttachRefs) {
//       onAttachRefs(ref as React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>, api);
//     }
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   return null; // Returns null because the ref intended for the visual mesh is passed through the onAttachRefs callback
// }


import { CollideBeginEvent, CollideEndEvent, CollideEvent, PublicApi, useSphere } from '@react-three/cannon';
import { memo, useEffect, useMemo } from 'react';
import { BufferGeometry, Material, Mesh, NormalBufferAttributes, Object3DEventMap, Vector3 } from 'three';

export type SphereColliderComponent = {
  onAttachRefs: (ref: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>, api: PublicApi) => void;
  position: Vector3;
  type?: 'Kinematic' | 'Dynamic' | 'Static';
  onCollide?: (event: CollideEvent) => void;
  onCollideBegin?: ((event: CollideBeginEvent) => void) | null | undefined;
  onCollideEnd?: (event: CollideEndEvent) => void;
}

export type SphereColliderComponentProps = {
  onAttachRefs: (ref: React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>, api: PublicApi) => void;
  position: Vector3;
  type?: 'Kinematic' | 'Dynamic' | 'Static';
  onCollide?: (event: CollideEvent) => void;
  onCollideBegin?: ((event: CollideBeginEvent) => void) | null | undefined;
  onCollideEnd?: (event: CollideEndEvent) => void;
};

const SphereCollider = ({
  onAttachRefs,
  position,
  type = 'Dynamic',
  onCollide,
  onCollideBegin,
  onCollideEnd
}: SphereColliderComponentProps) => {
  console.log('~~sphere collider rendered');

  const sphereConfig = useMemo(() => ({
    position: [position.x, position.y, position.z] as [x: number, y: number, z: number],
    onCollide,
    onCollideBegin: onCollideBegin || (() => {}),
    onCollideEnd,
    args: [0.05] as [radius: number],
    type,
  }), [position, type, onCollide, onCollideBegin, onCollideEnd]);

  const [ref, api] = useSphere(() => sphereConfig);

  useEffect(() => {
    if (onAttachRefs) {
      onAttachRefs(ref as React.RefObject<Mesh<BufferGeometry<NormalBufferAttributes>, Material | Material[], Object3DEventMap>>, api);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default memo(SphereCollider);

