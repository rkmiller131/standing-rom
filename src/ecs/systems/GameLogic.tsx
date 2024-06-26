// /* eslint-disable react-hooks/exhaustive-deps */
// import { useEffect } from 'react';
// import { VRM } from '../../../interfaces/THREE_Interface';
// import { useGameState } from '../store/GameState';
// import RenderLoop from './RenderLoop';
// import { useSceneState } from '../store/SceneState';
// // import SideEffects from './SideEffects';
// import { EntityId } from '../store/types';
// // import { EntityId } from '../store/types';

// interface GameLogicProps {
//   avatar: React.RefObject<VRM>;
// }

// let gameRunning = false;

// export default function GameLogic({ avatar }: GameLogicProps) {
//   const gameState = useGameState();
//   const sceneState = useSceneState();
//   let firstBubbleInSet: null | undefined | EntityId;

//   console.log('~~THE GAME LOGIC RERENDERED')

//   if (gameRunning) {
//     firstBubbleInSet = gameState.levels[0].bubbleEntities[0].get({ noproxy: true });
//   }

//   async function startTheGame() {
//     await gameState.startGame();
//   }

//   useEffect(() => {
//     if (sceneState.sceneLoaded.get({ noproxy: true })) {
//       startTheGame();
//       gameRunning = true;
//     }
//   }, [sceneState.sceneLoaded])

//   useEffect(() => {
//     if (!gameRunning) return;

//     console.log('first bubble in the set is ', firstBubbleInSet)
//     // if there are no more bubbles in the current set
//     if (firstBubbleInSet !== 0 && !firstBubbleInSet) {
//       // remove the set from the levels array
//       const setsInPlay = gameState.levels.get({ noproxy: true }).slice(1);
//       gameState.levels.set(setsInPlay);
//       console.log('No more bubbles in the set; game state is ', gameState)
//     } else {
//       // otherwise if there is a new first bubble, make it active!
//       // do a query in the world for the bubble by the id of the firstBubble, then access its active property
//     }
//   }, [firstBubbleInSet])

//   // any side effects that need to happen, render here in a useEffect
//   // if you need to listen to any ecs onEntityAdded or whatever changes, probably here too

//   // pull from the hookstate store and if we have, say, levels length then return this renderloop (only start game when ready)
//   // Maybe in the future if game is all set up, then render the countdown to start while render loop is happening, and then only
//   // when countdown starts does the render loop render all the bubbles (edit bubbles.tsx to wait for countdown over)
//   return gameRunning ? <RenderLoop avatar={avatar} /> : null;
//   // return gameRunning ? (
//   //   <>
//   //     <RenderLoop avatar={avatar} />
//   //     {firstBubbleInSet && <SideEffects firstBubbleInSet={firstBubbleInSet}/>}
//   //   </>
//   // ) : null
// }

// -----------------------------------------------------------------------------------------------

// import { VRM } from '../../../interfaces/THREE_Interface';
// import useGameData from '../../hooks/useGameData';
// import { useEffect } from 'react';
// import ArmAngleLoop from './ArmAngleLoop';
// import BubbleSpawnLoop from './BubbleSpawnLoop';

// interface GameLogicProps {
//   avatar: React.RefObject<VRM>;
// }

// let gameRunning = false;
// export default function GameLogic({ avatar }: GameLogicProps) {
//   const { gameSetupPending, bubbles, levels } = useGameData();

//   console.log('~~THE GAME LOGIC RERENDERED', gameSetupPending)

//   useEffect(() => {
//     if (!gameSetupPending) {
//       gameRunning = true;
//     }
//   }, [gameSetupPending]);

//   return gameRunning ? (
//     <>
//       <ArmAngleLoop avatar={avatar}/>
//       <BubbleSpawnLoop bubbles={bubbles} levels={levels}/>
//     </>
//   ) : null;
// }

// ------------------------------------------------------------------------------------------------------

import { VRM } from '../../../interfaces/THREE_Interface';
import ArmAngleLoop from './ArmAngleLoop';
import BubbleSpawnLoop from './BubbleSpawnLoop';
import { useGameState } from '../store/GameState';
import { useEffect } from 'react';
import { useSceneState } from '../store/SceneState';
import useGameData from '../../hooks/useGameData';

interface GameLogicProps {
  avatar: React.RefObject<VRM>;
}

export default function GameLogic({ avatar }: GameLogicProps) {
  const gameState = useGameState();
  const sceneState = useSceneState();
  const { initializeGame } = useGameData();
  const isGameRunning = gameState.gameSetupPending.get({noproxy: true}) === false;

  useEffect(() => {
    // if the game setup is still pending but the scene has loaded, start the game.
    if (!isGameRunning && sceneState.sceneLoaded.get({ noproxy: true })) {
      initializeGame();
    }
  }, [initializeGame, isGameRunning, sceneState.sceneLoaded]);

  console.log('~~THE GAME LOGIC RERENDERED. Game is running?', isGameRunning)

  return isGameRunning ? (
    <>
      <ArmAngleLoop avatar={avatar}/>
      <BubbleSpawnLoop />
    </>
  ) : null;
}
