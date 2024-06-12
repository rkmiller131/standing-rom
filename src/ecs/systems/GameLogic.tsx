/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { VRM } from '../../../interfaces/THREE_Interface';
import { useGameState } from '../store/GameState';
import RenderLoop from './RenderLoop';
import { useSceneState } from '../store/SceneState';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

let gameRunning = false;

export default function GameLogic({ avatar }: GameLogicProps) {
  const gameState = useGameState();
  const sceneState = useSceneState();

  async function startTheGame() {
    await gameState.startGame();
  }

  useEffect(() => {
    if (sceneState.sceneLoaded.get({ noproxy: true })) {
      startTheGame();
      gameRunning = true;
    }
  }, [sceneState.sceneLoaded])

  // any side effects that need to happen, render here in a useEffect
  // if you need to listen to any ecs onEntityAdded or whatever changes, probably here too

  // pull from the hookstate store and if we have, say, levels length then return this renderloop (only start game when ready)
  return gameRunning ? <RenderLoop avatar={avatar} /> : null;
}
