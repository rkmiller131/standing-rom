/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { VRM } from '../../../interfaces/THREE_Interface';
import RenderLoop from './RenderLoop';
import { useSceneState } from '../store/SceneState';
import GameSetup from '../entities/BubbleManager';
import { useThree } from '@react-three/fiber';
import getGameData from '../helpers/getGameData';
import CannonDebugger from 'cannon-es-debugger';
import { world } from '../../DEMO/PhysicsWorld';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

export default function GameLogic({ avatar }: GameLogicProps) {
  const sceneState = useSceneState();
  const { scene } = useThree();
  const game = useRef<GameSetup | null>(null);

  const debugRenderer = CannonDebugger(scene, world, { color: 'blue' });

  const updateDebug = () => {
    debugRenderer.update();
  }

  console.log('~~THE GAME LOGIC RERENDERED')

  const startTheGame = async () => {
    try {
      const response = await getGameData(); // rename later to httpGetGameData
      if (!response.ok) {
        throw new Error('Failed to fetch game data from the server');
      }

      const { reps, sets } = response; // later is await response.json() ?
      game.current = new GameSetup(reps, sets, scene);
      game.current.initialize();

    } catch (error) {
      console.error('Error during game initialization: ', error);
    }
  }

  // in app just have this check of scene loaded, render game logic, then empty dep here
  useEffect(() => {
    if (sceneState.sceneLoaded.get({ noproxy: true })) {
      startTheGame();
    }
  }, [sceneState.sceneLoaded])


  return !game.current?.gameEnded ? (
    <RenderLoop avatar={avatar} game={game} debugRenderer={updateDebug}/>
  ) : null;
}
