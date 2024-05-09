import * as THREE from "three";
import React, { useContext, createContext, useEffect, useState } from "react";
import {
  gltfLoader as loader,
  dracoLoader,
  GLTF,
} from "../../../THREE_Interface";
import { Merged } from "@react-three/drei";

const map =
  "https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bush-transformed.glb?v=1715123409884";

type GLTFResult = GLTF & {
  nodes: {
    Plane178: THREE.Mesh;
    Plane178_1: THREE.Mesh;
  };
  materials: {
    ["branch-1-01"]: THREE.MeshStandardMaterial;
    ["branch-1-02"]: THREE.MeshStandardMaterial;
  };
};

type ContextType = Record<
  string,
  React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>
>;

const context = createContext({} as ContextType);

export function BushInstance({
  children,
  ...props
}: JSX.IntrinsicElements["group"]) {
  const [gltf, setGltf] = useState<GLTFResult | null>(null);

  useEffect(() => {
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);
    const loadModel = async () => {
      try {
        const gltf = await loader.loadAsync(map, (event) => {
          console.log(
            `Loading Bush: ${(event.loaded / event.total) * 100}%`
          );
        });
        // Extract nodes directly from the loaded GLTF object
        const nodes = {
          Plane178: gltf.scene.getObjectByName("Plane178") as THREE.Mesh,
          Plane178_1: gltf.scene.getObjectByName("Plane178_1") as THREE.Mesh,
        };

        // return mats as an instanceof Three.Mesh
        const getMaterial = (
          object: THREE.Object3D
        ): THREE.Material | undefined => {
          if (object instanceof THREE.Mesh) {
            return object.material;
          }
          return undefined;
        };

        const materials = {
          ["branch-1-01"]: getMaterial(
            gltf.scene.getObjectByName("Plane178") as THREE.Object3D
          ) as THREE.MeshStandardMaterial,
          ["branch-1-02"]: getMaterial(
            gltf.scene.getObjectByName("Plane178_1") as THREE.Object3D
          ) as THREE.MeshStandardMaterial,
        };

        setGltf({ ...gltf, nodes, materials });
      } catch (error) {
        console.error("Error loading GLTF model:", error);
      }
    };

    loadModel();
  }, []);

  if (!gltf) return null;

  //TODO: needs to work with useMemo
  const instances = {
    Plane: gltf.nodes.Plane178,
    Plane1: gltf.nodes.Plane178_1,
  };

  return (
    <Merged meshes={instances} {...props}>
      {(instances: ContextType) => (
        <context.Provider value={instances} children={children} />
      )}
    </Merged>
  );
}

export function Bush({
  props,
  position,
  rotation,
  scale = 1,
}: {
  props?: JSX.IntrinsicElements["group"];
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
        <instances.Plane />
        <instances.Plane1 />
      </group>
    </group>
  );
}