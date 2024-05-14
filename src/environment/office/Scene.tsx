import { Suspense, lazy, useRef } from 'react';
import { GLTF } from '../../THREE_Interface';
import Office from './Office';
import { useSceneState } from '../../ecs/store/SceneState';

const Sky = lazy(() => import('./Sky'));
const Sound = lazy(() => import('./sound/Sound'));
const Lighting = lazy(() => import('./Lighting'));

export default function OfficeScene() {
  const environment = useRef<GLTF | null>(null);
  const sceneState = useSceneState();

  const setEnvironmentModel = (gltf: GLTF) => {
    environment.current = gltf;
    sceneState.environmentLoaded.set(true);
  };

  return (
    <Suspense fallback={null}>
      <Lighting />
      <Sound />
      <Sky />
      <Office
        setEnvironmentModel={setEnvironmentModel}
        environment={environment}
      />
    </Suspense>
  );
}
