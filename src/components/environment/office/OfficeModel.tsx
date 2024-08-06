/* eslint-disable react-hooks/exhaustive-deps */
import { gltfLoader as loader, dracoLoader, GLTF } from '../../../interfaces/THREE_Interface';
import { Suspense, useEffect, useState } from 'react';
import debounce from '../../../utils/general/debounce';
import updateShadows from './lights/helpers/updateShadows';
import { officeModel } from '../../../utils/cdn-links/models';

interface OfficeModelProps {
  setEnvironmentModel: (gltf: GLTF) => void;
  environment: React.RefObject<GLTF>;
}

export default function OfficeModel({ setEnvironmentModel, environment }: OfficeModelProps) {
  const [officeLoaded, setOfficeLoaded] = useState(false);

  const updateProgress = debounce((loadedPercentage) => {
    console.log('Loading Environment: ', loadedPercentage + '%');
  }, 100);

  useEffect(() => {
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
    loader.setDRACOLoader(dracoLoader);

    loader.load(
      officeModel,
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
        console.error('Error Loading Environment: ', error);
      },
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
