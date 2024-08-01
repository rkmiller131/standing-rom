import * as THREE from 'three';
import React, { useContext, createContext, useState, useEffect } from 'react';
import { Merged } from '@react-three/drei';
import {
  gltfLoader as loader,
  GLTF,
  dracoLoader,
} from '../../../../interfaces/THREE_Interface';

const map =
  'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/tree-transformed.glb?v=1715123611590';

type GLTFResult = GLTF & {
  nodes: {
    BezierCurve025: THREE.Mesh;
    BezierCurve025_1: THREE.Mesh;
    BezierCurve025_2: THREE.Mesh;
  };
  materials: {
    ['trunk-01']: THREE.MeshStandardMaterial;
    ['branch-2-01']: THREE.MeshStandardMaterial;
    ['branch-2-02']: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements['mesh']>
>;

const context = createContext({} as ContextType);
export function TreeInstance({
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
          console.log(`Loading Tree: ${(event.loaded / event.total) * 100}%`);
        });
        // Extract nodes directly from the loaded GLTF object
        const nodes = {
          BezierCurve025: gltf.scene.getObjectByName(
            'BezierCurve025',
          ) as THREE.Mesh,
          BezierCurve025_1: gltf.scene.getObjectByName(
            'BezierCurve025_1',
          ) as THREE.Mesh,
          BezierCurve025_2: gltf.scene.getObjectByName(
            'BezierCurve025_2',
          ) as THREE.Mesh,
        };

        // Extract materials from the nodes
        const getMaterial = (
          object: THREE.Object3D,
        ): THREE.Material | undefined => {
          if (object instanceof THREE.Mesh) {
            return object.material;
          }
          return undefined;
        };

        const materials = {
          ['trunk-01']: getMaterial(
            gltf.scene.getObjectByName('BezierCurve025') as THREE.Object3D,
          ) as THREE.MeshStandardMaterial,
          ['branch-2-01']: getMaterial(
            gltf.scene.getObjectByName('BezierCurve025_1') as THREE.Object3D,
          ) as THREE.MeshStandardMaterial,
          ['branch-2-02']: getMaterial(
            gltf.scene.getObjectByName('BezierCurve025_2') as THREE.Object3D,
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
    BezierCurve025: gltf.nodes.BezierCurve025,
    BezierCurve025_1: gltf.nodes.BezierCurve025_1,
    BezierCurve025_2: gltf.nodes.BezierCurve025_2,
  };

  return (
    <Merged meshes={instances} {...props}>
      {(instances: ContextType) => (
        <context.Provider value={instances} children={children} />
      )}
    </Merged>
  );
}

export function Tree({
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
        <instances.BezierCurve025 />
        <instances.BezierCurve025_1 />
        <instances.BezierCurve025_2 />
      </group>
    </group>
  );
}
