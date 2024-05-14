import { Suspense, lazy, useRef } from 'react';
import { GLTF, VRM } from '../../THREE_Interface';
import Office from './Office';
import { useSceneState } from '../../ecs/store/SceneState';
import { Physics } from '../../CANNON_Interface';
import DemoBubble from '../physics/demoBubble';
import RightHandCollider from '../physics/rightHandCollider';

const Sky = lazy(() => import('./Sky'));
const Sound = lazy(() => import('./sound/Sound'));
const Lighting = lazy(() => import('./Lighting'));

interface SceneProps {
  avatar: React.RefObject<VRM>;
}

export default function OfficeScene({ avatar }: SceneProps) {
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
      <Physics gravity={[0, 0, 0]}>
        <DemoBubble position={[0.5, 1.2, 0.3]} />
        <RightHandCollider avatar={avatar} />
      </Physics>
    </Suspense>
  );
}
