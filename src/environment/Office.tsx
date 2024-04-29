/* eslint-disable react-hooks/exhaustive-deps */
import { gltfLoader as loader, dracoLoader, GLTF } from "../THREE_Interface";
import { Suspense, useEffect, useState } from "react";
import debounce from "../ecs/helpers/debounce";

interface OfficeProps {
  setEnvironmentModel: (gltf: GLTF) => void;
  environment: React.RefObject<GLTF>;
}

export default function Office({
  setEnvironmentModel,
  environment,
}: OfficeProps) {
  const [officeLoaded, setOfficeLoaded] = useState(false);
  const updateProgress = debounce((loadedPercentage) => {
    // could set a state here instead, for loading screen in the future
    console.log("Loading Environment: ", loadedPercentage + "%");
  }, 100);

  function updateShadows(gltf: GLTF) {
    // Iterate over each child of the scene
    gltf.scene.children.forEach((child) => {
      // Check if the child has its own children (i.e., it's a group or another container)

      // Iterate over the children of the child
      child.children.forEach((mesh) => {
        if (mesh) {
          // Set castShadow for specific mesh
          if (mesh.name == "Cube_9" || "Cube_10") {
            mesh.castShadow = true;
          }

          if (mesh.name == "Cube_2" || "Cube_5") {
            mesh.receiveShadow = true;
          }

          console.log(`Set castShadow for mesh: ${mesh.name}`);
        }
      });
    });
    return gltf;
  }

  useEffect(() => {
    dracoLoader.setDecoderPath("https://www.gstatic.com/draco/v1/decoders/");
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      "/office-transformed.glb",
      (gltf) => {
        setEnvironmentModel(gltf);
        setOfficeLoaded(true);
        console.log(gltf.scene.children[0].children[0].name); //Cube_1
        // console.log(gltf.scene.children[0].children[0].material.name); //Material.003
        //set mats up for receive and cast shadow
        /* 
          Cube_1 - Cube_13 map to each of these mats sequentially...

          ['Material.003']: THREE.MeshStandardMaterial
          ['Material.005']: THREE.MeshStandardMaterial
          PaletteMaterial002: THREE.MeshStandardMaterial //Cast
          laminate_floor_02: THREE.MeshStandardMaterial //Receive
          PaletteMaterial004: THREE.MeshStandardMaterial //Cast
          ['Material.007']: THREE.MeshStandardMaterial
          ['Material.010']: THREE.MeshStandardMaterial
          PaletteMaterial005: THREE.MeshStandardMaterial
          small_wooden_table_01: THREE.MeshStandardMaterial //Cast
          steel_frame_shelves_02: THREE.MeshStandardMaterial //Cast
          PottedPlant_04: THREE.MeshStandardMaterial //Cast
          PaletteMaterial001: THREE.MeshStandardMaterial
          PaletteMaterial003: THREE.MeshStandardMaterial
        */
        updateShadows(gltf);
      },
      (progress) => {
        const loadedPercentage = 100 * (progress.loaded / progress.total);
        updateProgress(loadedPercentage);
      },
      (error) => {
        console.error("Error Loading Environment: ", error);
      }
    );
  }, []);

  return (
    <Suspense fallback={null}>
      {officeLoaded && (
        <>
          <primitive object={environment.current!.scene} />
        </>
      )}
    </Suspense>
  );
}
