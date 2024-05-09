import { Suspense, lazy, useRef } from 'react'
import { GLTF } from '../../THREE_Interface'
import Office from './Office'
import { useGameState } from '../../ecs/store/GameState'

const Sky = lazy(() => import("./Sky"));
const Sound = lazy(() => import("./sound/Sound"));
const Lighting = lazy(() => import("./Lighting"));

export default function OfficeScene() {
  const environment = useRef<GLTF | null>(null);
  const gameState = useGameState();

  const setEnvironmentModel = (gltf: GLTF) => {
    environment.current = gltf;
    gameState.environmentLoaded.set(true);
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