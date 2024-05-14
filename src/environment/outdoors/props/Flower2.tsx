import * as THREE from 'three';
import React, { useContext, createContext, useState, useEffect } from 'react';
import { Merged } from '@react-three/drei';
import {
  gltfLoader as loader,
  GLTF,
  dracoLoader,
} from '../../../../interfaces/THREE_Interface';

const map =
  'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/flower2-transformed.glb?v=1715123468363';

type GLTFResult = GLTF & {
  nodes: {
    Triangle_1: THREE.Mesh;
    Triangle_2: THREE.Mesh;
  };
  materials: {
    Material: THREE.MeshStandardMaterial;
    ['Material.001']: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>
>;

const context = createContext({} as ContextType);
export function FlowerInstance({
  children,
  ...props
}: JSX.IntrinsicElements['group']) {
  const [gltf, setGltf] = useState<GLTFResult | null>(null);

  useEffect(() => {
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);
    const loadModel = async () => {
      try {
        const gltf = await loader.loadAsync(map, (event) => {
          console.log(`Loading Flower: ${(event.loaded / event.total) * 100}%`);
        });
        const nodes = {
          Triangle_1: gltf.scene.getObjectByName('Triangle_1') as THREE.Mesh,
          Triangle_2: gltf.scene.getObjectByName('Triangle_2') as THREE.Mesh,
        };

        const getMaterial = (
          object: THREE.Object3D,
        ): THREE.Material | undefined => {
          if (object instanceof THREE.Mesh) {
            return object.material;
          }
          return undefined;
        };

        const materials = {
          Material: getMaterial(
            gltf.scene.getObjectByName('Triangle_1') as THREE.Object3D,
          ) as THREE.MeshStandardMaterial,
          ['Material.001']: getMaterial(
            gltf.scene.getObjectByName('Triangle_2') as THREE.Object3D,
          ) as THREE.MeshStandardMaterial,
        };

        setGltf({ ...gltf, nodes, materials });
      } catch (error) {
        console.error('Error loading GLTF model:', error);
      }
    };

    loadModel();
  }, []);

  if (!gltf) return null;

  const instances = {
    Triangle: gltf.nodes.Triangle_1,
    Triangle1: gltf.nodes.Triangle_2,
  };

  return (
    <Merged meshes={instances} {...props}>
      {(instances: ContextType) => (
        <context.Provider value={instances} children={children} />
      )}
    </Merged>
  );
}

export function Flower({
  props,
  position,
  rotation,
  scale = 1,
}: {
  props?: JSX.IntrinsicElements['group'];
  position: [number, number, number];
  rotation: [number, number, number];
  scale?: number;
}) {
  const instances = useContext(context);
  return (
    <group
      position={position}
      rotation={rotation}
      scale={scale}
      {...props}
      dispose={null}
    >
      <group>
        <instances.Triangle />
        <instances.Triangle1 />
      </group>
    </group>
  );
}
