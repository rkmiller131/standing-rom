import { Suspense, lazy, useRef } from 'react';
import { GLTF } from '../../../interfaces/THREE_Interface';
import OfficeModel from './OfficeModel';
import { useSceneState } from '../../../hookstate-store/SceneState';

const Sky = lazy(() => import('./Sky'));
const Sound = lazy(() => import('./sound/Sound'));
const Lights = lazy(() => import('./lights/Lights'));

export default function OfficeScene() {
  const environment = useRef<GLTF | null>(null);
  const sceneState = useSceneState();

  const setEnvironmentModel = (gltf: GLTF) => {
    environment.current = gltf;
    sceneState.environmentLoaded.set(true);
  };

  return (
    <Suspense fallback={null}>
      <Lights />
      <Sound />
      <Sky />
      <OfficeModel
        setEnvironmentModel={setEnvironmentModel}
        environment={environment}
      />
    </Suspense>
  );
}
