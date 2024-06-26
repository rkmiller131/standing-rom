import { useCallback, useEffect } from 'react';
import getGameData from '../ecs/helpers/getGameData';
import findSideSpawned from '../ecs/helpers/findSideSpawned';
import { avatarProportions } from '../avatar/helpers/setupAvatarProportions';
import { Vector3 } from 'three';
import { calculateArcCoordinates } from '../ecs/helpers/calculateArcCoordinates';
// import { useSceneState } from '../ecs/store/SceneState';
import { useGameState } from '../ecs/store/GameState';
import { LevelsType, SetType } from '../ecs/store/types';
import { ECS } from '../ecs/World';

let firstSetInitialized = false;

const gameInfo = {
  sets: 0,
  reps: 0
}

function generateBubbles(reps: number, spawnSide: 'right' | 'left' | 'frontR' | 'frontL' | 'crossR' | 'crossL') {
  const bubbles = [];
  let origin = avatarProportions.spinePos;
  let startPosition, spawnPos;

  const startAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? 0 : Math.PI / 2;
  const endAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? Math.PI - 1.31 : Math.PI;
  const midAngle = (endAngle - startAngle) / 2;
  const angleIncrement = (endAngle - startAngle) / (reps - 1);

  for (let i = 0; i < reps; i++) {
    let angle = startAngle + i * angleIncrement;

    if (spawnSide === 'left') {
      // left hand position
      startPosition = new Vector3(-0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'right') {
      // right hand position
      startPosition = new Vector3(0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'frontL') {
      // left hand front position
      startPosition = new Vector3(-0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'frontR') {
      // right hand front position
      startPosition = new Vector3(0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'crossL') {
      // left shoulder position
      startPosition = new Vector3(-0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos);
      // update with the actual origin of the left shoulder plus some extra -z(?)
      origin = new Vector3(-0.2, 0.8, -0.05).add(avatarProportions.avatarPos);

    } else if (spawnSide === 'crossR') {
      // right shoulder position
      startPosition = new Vector3(0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos);

      origin = new Vector3(0.2, 0.8, -0.05).add(avatarProportions.avatarPos);
    }

    if (reps === 1) {
      angle = midAngle; // edge case fix: selecting 1 set and 1 rep needs an angle calc accommodation
    }

    if (spawnSide === 'left' || spawnSide === 'crossL') {
      angle = -angle // necessary to mirror coordinates
    }

    spawnPos = calculateArcCoordinates(origin, spawnSide, startPosition!, angle);

    const bubbleEntity = {
      age: 0,
      spawnPosition: spawnPos,
      active: false
    }

    bubbles.push(bubbleEntity);
  }
  return bubbles;
}

function generateLevels(sets: number, reps: number): LevelsType {
  const levelsGenerated = [];
  for (let i = 0; i < sets; i++) {
    const spawnSide = findSideSpawned(i);
    const set: SetType = {
      sideSpawned: spawnSide,
      bubbleEntities: generateBubbles(reps, spawnSide),
      inPlay: false,
    };
    levelsGenerated.push(set);
  }
  return levelsGenerated;
}

function useGameData() {
  // const [gameSetupPending, setGameSetupPending] = useState(true);
  // const [bubbles, setBubbles] = useState<BubblesSet>([]);
  // const [levels, setLevels] = useState<LevelsType>([]);
  // const sceneState = useSceneState();
  const gameState = useGameState();

  const makeFirstLevelInPlay = () => {
    // setLevels(prevLevels => {
    //   const updatedLevels = [...prevLevels];
    //   updatedLevels[0] = {...updatedLevels[0], inPlay: true };
    //   return updatedLevels;
    // });
    gameState.levels[0].inPlay.set(true);
  }

  // const generateBubbleSet = useCallback((reps: number) => {
  //   const bubbles = [];
  //   const spawnSide = gameState.levels[0].sideSpawned.get({ noproxy: true });
  //   let origin = avatarProportions.spinePos;
  //   let startPosition, spawnPos;

  //   const startAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? 0 : Math.PI / 2;
  //   const endAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? Math.PI - 1.31 : Math.PI;
  //   const midAngle = (endAngle - startAngle) / 2;
  //   const angleIncrement = (endAngle - startAngle) / (reps - 1);

  //   for (let i = 0; i < reps; i++) {
  //     let angle = startAngle + i * angleIncrement;

  //     if (spawnSide === 'left') {
  //       // left hand position
  //       startPosition = new Vector3(-0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos);

  //     } else if (spawnSide === 'right') {
  //       // right hand position
  //       startPosition = new Vector3(0.6 * avatarProportions.armLength, avatarProportions.handHeight, 0).add(avatarProportions.avatarPos);

  //     } else if (spawnSide === 'frontL') {
  //       // left hand front position
  //       startPosition = new Vector3(-0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

  //     } else if (spawnSide === 'frontR') {
  //       // right hand front position
  //       startPosition = new Vector3(0.3 * avatarProportions.armLength, avatarProportions.handHeight, -0.2 * avatarProportions.armLength).add(avatarProportions.avatarPos);

  //     } else if (spawnSide === 'crossL') {
  //       // left shoulder position
  //       startPosition = new Vector3(-0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos);
  //       // update with the actual origin of the left shoulder plus some extra -z(?)
  //       origin = new Vector3(-0.2, 0.8, -0.05).add(avatarProportions.avatarPos);

  //     } else if (spawnSide === 'crossR') {
  //       // right shoulder position
  //       startPosition = new Vector3(0.5 * avatarProportions.armLength, 0.75 * avatarProportions.shoulderHeight, 0).add(avatarProportions.avatarPos);

  //       origin = new Vector3(0.2, 0.8, -0.05).add(avatarProportions.avatarPos);
  //     }

  //     if (reps === 1) {
  //       angle = midAngle; // edge case fix: selecting 1 set and 1 rep needs an angle calc accommodation
  //     }

  //     if (spawnSide === 'left' || spawnSide === 'crossL') {
  //       angle = -angle // necessary to mirror coordinates
  //     }

  //     spawnPos = calculateArcCoordinates(origin, spawnSide, startPosition!, angle);

  //     const bubbleEntity = {
  //       age: 0,
  //       spawnPosition: spawnPos,
  //       active: false
  //     }

  //     bubbles.push(bubbleEntity);
  //   }
  //   return bubbles;
  // }, [gameState.levels]);

  const removeBubble = (): void => {
    // const bubblesInPlay = bubbles.slice(1);
    // setBubbles(bubblesInPlay);
    const firstLevelBubbles = gameState.levels[0].bubbleEntities.get({noproxy: true});
    const bubblesInPlay = firstLevelBubbles.slice(1);
    gameState.levels[0].bubbleEntities.set(bubblesInPlay);
  }

  const removeSet = (): void => {
    // const setsInPlay = levels.slice(1);
    // setLevels(setsInPlay);
    const currentSets = gameState.levels.get({ noproxy: true });
    const setsInPlay = currentSets.slice(1);
    gameState.levels.set(setsInPlay);
  }

  const initializeGame = useCallback(async () => {
    try {
      // for an http request, headers in response will be response.ok if successful
      const response = await getGameData(); // rename later to httpGetGameData if this hook works
      if (response.ok) {
        const { reps, sets } = response;
        gameInfo.reps = reps;
        gameInfo.sets = sets;
        // call into global game state here
        const levels = generateLevels(sets, reps);
        gameState.levels.set(levels);
        gameState.gameSetupPending.set(false);
      } else {
        // handle failure of fetching game info
        console.error('failed to fetch game data')
      }
    } catch (error) {
      console.error('Error during game data initialization ', error);
    }

  }, [gameState.gameSetupPending, gameState.levels]);

  // SIDE EFFECT LISTENERS -------------------------------------------------------------------------------------------
  // useEffect(() => {
  //   // if the game setup is still pending but the scene has loaded, start the game.
  //   if (gameState.gameSetupPending.get({noproxy: true}) && sceneState.sceneLoaded.get({ noproxy: true })) {
  //     initializeGame();
  //   }
  // }, [gameState.gameSetupPending, initializeGame, sceneState.sceneLoaded]);

  // If a level (set) becomes in play, then add those bubble entities to the world to be rendered
  useEffect(() => {
    if (gameState.levels.get({noproxy: true}).length <= 0) return;
    if (!firstSetInitialized && gameState.levels[0].inPlay.get({ noproxy: true })) {
      // iterate over the bubble entities and add each one to the ECS
      const bubbles = gameState.levels[0].bubbleEntities.get({ noproxy: true })
      for (let i = 0; i < bubbles.length; i++) {
        ECS.world.add({
          bubble: bubbles[i]
        })
      }
      firstSetInitialized = true;
    }

    // check if the first level's bubble entities array is changing.
    if (gameState.levels[0].bubbleEntities.get({noproxy: true}).length <= 0) {
      // if the array ever hits zero, we need to remove that level (it is complete!)
      removeSet();
      firstSetInitialized = false;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.levels[0].inPlay, gameState.levels[0].bubbleEntities])


  return {
    initializeGame,
    removeBubble,
    makeFirstLevelInPlay,
    gameInfo
  }
}

export default useGameData;