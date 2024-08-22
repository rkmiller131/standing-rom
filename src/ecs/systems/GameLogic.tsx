/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { VRM } from '../../interfaces/THREE_Interface';
import { useGameState } from '../../hookstate-store/GameState';
import RenderLoop from './RenderLoop';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

let gameIsSetup = false;

export default function GameLogic({ avatar }: GameLogicProps) {
  const gameState = useGameState();

  async function startTheGame() {
    await gameState.startGame();
  }

  useEffect(() => {
    startTheGame();
    gameIsSetup = true;
  }, [])

  return gameIsSetup ? <RenderLoop avatar={avatar} /> : null;
}