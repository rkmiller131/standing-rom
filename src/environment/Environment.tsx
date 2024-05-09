import { useGameState } from '../ecs/store/GameState'
import { Suspense } from 'react'
import OutdoorScene from './outdoors/Outdoors'
import OfficeScene from './office/Scene'

export default function Environment() {
  const gameState = useGameState();
  return (
    <Suspense fallback={null}>
      {gameState.selectedEnvironment.get({ noproxy: true }) === "Indoor Office" && (
        <OfficeScene />
      )}
      {gameState.selectedEnvironment.get({ noproxy: true }) === "Outdoors" && (
        <OutdoorScene />
      )}
    </Suspense>
  );
}