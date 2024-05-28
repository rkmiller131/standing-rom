import { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';
import { useSceneState } from '../ecs/store/SceneState';
import { useGameState } from '../ecs/store/GameState';
import calcAverageVelocity from '../ecs/helpers/calcAverageVelocity';

export default function GameInfo() {
  const sceneState = useSceneState();
  const gameState = useGameState();
  const [gameInfo, setGameInfo] = useState({
    maxRightArmAngle: 0,
    maxLeftArmAngle: 0,
    popped: 0,
    avgVelocity: '0',
  });

  useEffect(() => {
    if (sceneState.sceneLoaded.get({ noproxy: true })) {
      setGameInfo({
        maxRightArmAngle: gameState.score.maxRightArmAngle.get({ noproxy: true }),
        maxLeftArmAngle: gameState.score.maxLeftArmAngle.get({ noproxy: true }),
        popped: gameState.score.popped.get({ noproxy: true }),
        avgVelocity: calcAverageVelocity(gameState.score.poppedVelocities.get({ noproxy: true }).slice())
      });
    }
  }, [gameState.score, sceneState.sceneLoaded]);

  return (
    <Html position={[-2, 2.2, -2]}>
      <div
        style={{
          backgroundColor: '#ffffff80',
          border: '2px solid',
          borderColor: '#0ED8A5',
          width: '350px',
          height: '250px',
          padding: '10px',
          borderRadius: '5px',
          color: 'black',
        }}
      >
        <h2>Raw Game Information</h2>
        <p>Max Right Arm Angle: {gameInfo.maxRightArmAngle}°</p>
        <p>Max Left Arm Angle: {gameInfo.maxLeftArmAngle}°</p>
        <p>Average Popping Velocity: {gameInfo.avgVelocity} m/s</p>
        <p>Bubbles Popped: {gameInfo.popped}</p>
      </div>
    </Html>
  );
}
