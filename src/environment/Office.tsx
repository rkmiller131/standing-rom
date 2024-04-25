import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

import * as THREE from 'three'
import { Suspense } from 'react';

type GLTFResult = GLTF & {
  nodes: {
    Cube_1: THREE.Mesh;
    Cube_2: THREE.Mesh;
    Cube_3: THREE.Mesh;
    Cube_4: THREE.Mesh;
    Cube_5: THREE.Mesh;
    Cube_6: THREE.Mesh;
    Cube_7: THREE.Mesh;
    Cube_8: THREE.Mesh;
    Cube_9: THREE.Mesh;
    Cube_10: THREE.Mesh;
    Cube_11: THREE.Mesh;
    Cube_12: THREE.Mesh;
    Cube_13: THREE.Mesh;
    Cube_14: THREE.Mesh;
    Cube_15: THREE.Mesh;
  };
  materials: {
    ["Material.003"]: THREE.MeshStandardMaterial;
    ["Material.005"]: THREE.MeshStandardMaterial;
    PaletteMaterial002: THREE.MeshStandardMaterial;
    laminate_floor_02: THREE.MeshStandardMaterial;
    PaletteMaterial004: THREE.MeshStandardMaterial;
    ["Material.007"]: THREE.MeshStandardMaterial;
    ["Material.010"]: THREE.MeshStandardMaterial;
    PaletteMaterial005: THREE.MeshStandardMaterial;
    wood: THREE.MeshStandardMaterial;
    ["wood.001"]: THREE.MeshStandardMaterial;
    PaletteMaterial006: THREE.MeshStandardMaterial;
    PaletteMaterial007: THREE.MeshStandardMaterial;
    small_wooden_table_01: THREE.MeshStandardMaterial;
    PaletteMaterial001: THREE.MeshStandardMaterial;
    PaletteMaterial003: THREE.MeshStandardMaterial;
  };
};

export default function Office(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF(
    "/office.glb"
  ) as GLTFResult;
  return (
    <Suspense fallback={null}>
      <group {...props} dispose={null}>
        <group
          rotation={[0, -0.294, 0]}
          position={[0, 0.05, 0]}
          scale={[0.13, 0.005, 0.06]}
        >
          <mesh
            geometry={nodes.Cube_1.geometry}
            material={materials["Material.003"]}
          />
          <mesh
            geometry={nodes.Cube_2.geometry}
            material={materials["Material.005"]}
          />
          <mesh
            geometry={nodes.Cube_3.geometry}
            material={materials.PaletteMaterial002}
          />
          <mesh
            geometry={nodes.Cube_4.geometry}
            material={materials.laminate_floor_02}
          />
          <mesh
            geometry={nodes.Cube_5.geometry}
            material={materials.PaletteMaterial004}
          />
          <mesh
            geometry={nodes.Cube_6.geometry}
            material={materials["Material.007"]}
          />
          <mesh
            geometry={nodes.Cube_7.geometry}
            material={materials["Material.010"]}
          />
          <mesh
            geometry={nodes.Cube_8.geometry}
            material={materials.PaletteMaterial005}
          />
          <mesh geometry={nodes.Cube_9.geometry} material={materials.wood} />
          <mesh
            geometry={nodes.Cube_10.geometry}
            material={materials["wood.001"]}
          />
          <mesh
            geometry={nodes.Cube_11.geometry}
            material={materials.PaletteMaterial006}
          />
          <mesh
            geometry={nodes.Cube_12.geometry}
            material={materials.PaletteMaterial007}
          />
          <mesh
            geometry={nodes.Cube_13.geometry}
            material={materials.small_wooden_table_01}
          />
          <mesh
            geometry={nodes.Cube_14.geometry}
            material={materials.PaletteMaterial001}
          />
          <mesh
            geometry={nodes.Cube_15.geometry}
            material={materials.PaletteMaterial003}
          />
        </group>
      </group>

    </Suspense>
  );
}

useGLTF.preload("/office.glb");
