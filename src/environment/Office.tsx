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
    gltf.scene.traverse((object) => {
      if (object) {
        const isCastShadow =
          object.name === "Cube_3" ||
          object.name === "Cube_7" ||
          object.name === "Cube_8" ||
          object.name === "Cube_9" ||
          object.name === "Cube_10" ||
          object.name === "Cube_11" ||
          object.name === "Cube_12";
        const isReceiveShadow =
          object.name === "Cube_13" ||
          object.name === "Cube_3" ||
          object.name === "Cube_4" ||
          object.name === "Cube_5" ||
          object.name === "Cube_7" ||
          object.name === "Cube_8";

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
      "https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/office2.glb?v=1714510499834",
      (gltf) => {
        setEnvironmentModel(gltf);
        updateShadows(gltf);
        setOfficeLoaded(true);
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
