import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Clock } from 'three';
import { useGameState } from '../store/GameState';
import calculateArmAngles from '../../avatar/helpers/calculateArmAngles';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useSceneState } from '../store/SceneState';
import GameSetup from '../entities/BubbleManager';
import { world } from '../../DEMO/PhysicsWorld';
import eventEmitter from '../../DEMO/vanillaEventEmitter';

interface RenderLoopProps {
  avatar: React.RefObject<VRM>;
  game: React.RefObject<GameSetup>;
  debugRenderer: () => void;
}

export default function RenderLoop({ avatar, game, debugRenderer }  : RenderLoopProps) {
  const clock = useRef(new Clock());
  const gameState = useGameState();
  const sceneState = useSceneState();

  console.log('render loop has started')

  useFrame((_, delta) => {
    const elapsedTime = clock.current.getElapsedTime();

    // CALCULATE ROM - ARM ANGLES ---------------------------------------------------------------
    if (elapsedTime >= 0.5) {
      // currently starts checking when avatar is in T pose - add an extra && for when game start happens
      if (sceneState.sceneLoaded.get({ noproxy: true }) && avatar.current) {
        const { leftArmAngle, rightArmAngle } = calculateArmAngles(avatar);
        const maxLeftArmAngle = gameState.score.maxLeftArmAngle.get({ noproxy: true });
        const maxRightArmAngle = gameState.score.maxRightArmAngle.get({ noproxy: true });

        if (
          leftArmAngle > maxLeftArmAngle &&
          leftArmAngle <= 180 &&
          leftArmAngle >= 0
        ) {
          gameState.score.maxLeftArmAngle.set(leftArmAngle);
        }

        if (
          rightArmAngle > maxRightArmAngle &&
          rightArmAngle <= 180 &&
          rightArmAngle >= 0
        ) {
          gameState.score.maxRightArmAngle.set(rightArmAngle);
        }
      }

      // resetting the clock after all frames per second have been executed
      clock.current.start();
    }

    game.current?.update();
    eventEmitter.update();
    // debugRenderer();
    world.step(delta);
  });

  return null;
}
