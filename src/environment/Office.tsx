/* eslint-disable react-hooks/exhaustive-deps */
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { debounce } from 'lodash'
import { Suspense, useEffect, useState } from 'react'
import { GLTFLoader, GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface OfficeProps {
  setEnvironmentModel: (gltf: GLTF) => void;
  environment: React.RefObject<GLTF>;
}

export default function Office({ setEnvironmentModel, environment }: OfficeProps) {
  const [officeLoaded, setOfficeLoaded] = useState(false);
  const updateProgress = debounce((loadedPercentage) => {
    // could set a state here instead, for loading screen in the future
    console.log('Loading Environment: ', loadedPercentage + '%');
  }, 100)

  useEffect(() => {
    const loader = new GLTFLoader();

    // // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader( dracoLoader );

    loader.load(
      'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/office.glb?v=1714005557457',
      (gltf) => {
        setEnvironmentModel(gltf);
        setOfficeLoaded(true);
      },
      (progress) => {
        const loadedPercentage = 100 * (progress.loaded / progress.total);
        updateProgress(loadedPercentage);
      },
      (error) => {
        console.error("Error Loading Environment: ", error)
      }
    )
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