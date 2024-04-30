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
    // Directly iterate over the meshes in the scene
    gltf.scene.traverse((object) => {
      if (object) {
        // Check if the mesh name matches any of the specified names for castShadow
        const isCastShadow =
          object.name === "Cube_3" ||
          object.name === "Cube_7" ||
          object.name === "Cube_8" ||
          object.name === "Cube_9" ||
          object.name === "Cube_10" ||
          object.name === "Cube_11" ||
          object.name === "Cube_12";
        // Check if the mesh name matches any of the specified names for receiveShadow
        const isReceiveShadow =
          object.name === "Cube_13" ||
          object.name === "Cube_3" ||
          object.name === "Cube_4" ||
          object.name === "Cube_5" ||
          object.name === "Cube_7" ||
          object.name === "Cube_8";

        // Apply castShadow and receiveShadow based on the conditions
        if (isCastShadow) {
          object.castShadow = true;
          console.log(`Set castShadow for object: ${object.name}`);
        }
        if (isReceiveShadow) {
          object.receiveShadow = true;
          console.log(`Set receiveShadow for object: ${object.name}`);
        }
      }
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

        // console.log(gltf.scene.children[0].children[0].material.name);
        //set mats up for receive and cast shadow
        /* 
          Cube_1 - Cube_13 map to each of these mats sequentially...

          ['Material.003']: THREE.MeshStandardMaterial  1
          ['Material.005']: THREE.MeshStandardMaterial  2 //Ceiling
          PaletteMaterial002: THREE.MeshStandardMaterial //Cast   3
          laminate_floor_02: THREE.MeshStandardMaterial //Receive   4
          PaletteMaterial004: THREE.MeshStandardMaterial //Cast    5 
          ['Material.007']: THREE.MeshStandardMaterial  6
          ['Material.010']: THREE.MeshStandardMaterial  7
          PaletteMaterial005: THREE.MeshStandardMaterial    8
          small_wooden_table_01: THREE.MeshStandardMaterial //Cast  9
          steel_frame_shelves_02: THREE.MeshStandardMaterial //Cast   10
          PottedPlant_04: THREE.MeshStandardMaterial //Cast   11
          PaletteMaterial001: THREE.MeshStandardMaterial  12
          PaletteMaterial003: THREE.MeshStandardMaterial  13
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
