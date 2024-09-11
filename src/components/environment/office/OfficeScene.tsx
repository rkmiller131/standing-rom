import { Suspense, lazy, useRef } from 'react';
import { GLTF } from '../../../interfaces/THREE_Interface';
import OfficeModel from './OfficeModel';
import { useSceneState } from '../../../hookstate-store/SceneState';
import Sound from './sound/Sound';

const Sky = lazy(() => import('./Sky'));
const Lights = lazy(() => import('./lights/Lights'));

export default function OfficeScene() {
  const environment = useRef<GLTF | null>(null);
  const sceneState = useSceneState();

  const setEnvironmentModel = (gltf: GLTF) => {
    environment.current = gltf;
    sceneState.environmentLoaded.set(true);
  };

  return (
    <>
      <Sound />
      <Suspense fallback={null}>
        <Lights />
        <Sky />
        <OfficeModel
          setEnvironmentModel={setEnvironmentModel}
          environment={environment}
        />
      </Suspense>
    </>
  );
}
