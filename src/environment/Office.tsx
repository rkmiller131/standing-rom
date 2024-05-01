/* eslint-disable react-hooks/exhaustive-deps */
import { gltfLoader as loader, dracoLoader, GLTF } from "../THREE_Interface";
import { Suspense, useEffect, useState } from "react";
import debounce from "../ecs/helpers/debounce";
import updateShadows from "./lights/helpers/updateShadows";

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
        <primitive
          object={environment.current!.scene}
        />
      </>
      )}
    </Suspense>
  );
}