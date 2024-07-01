import { Scene, Vector3 } from 'three';
import { avatarProportions } from '../../avatar/helpers/setupAvatarProportions';
import findSideSpawned from '../../ecs/helpers/findSideSpawned';
import { LevelsType, SetType } from '../../ecs/store/types';
import { calculateArcCoordinates } from '../../ecs/helpers/calculateArcCoordinates';
import Bubble from './Bubble';
// import createActiveBubble from '../materials/createActiveBubble';

export default class GameSetup {
  public gameInfo = {
    reps: 0,
    sets: 0
  };

  public levels: LevelsType = [];
  public gameEnded = false;

  private _scene: Scene;

  // do the http get data thing, also call useThree to get the scene and pass to this constructor
  constructor(reps: number, sets: number, scene: Scene) {
    this.gameInfo.reps = reps;
    this.gameInfo.sets = sets;
    this._scene = scene;
  }

  initialize() {
    this.levels = this.generateLevels();
  }

  update() {
    if (this.gameEnded) return;

    // every frame check if we still have levels to iterate through
    if (this.levels.length > 0) {
      // if the current set is not already in play, make it in play
      if (this.levels[0].inPlay === false) {
        this.makeFirstLevelInPlay();

        // now for every bubble in this level's bubbleEntity array, render them to the scene
        const bubblesInScene = this.levels[0].bubbleEntities;
        for (let i = 0; i < bubblesInScene.length; i++) {
          const currentBubble = bubblesInScene[i];
          const bubble = new Bubble(this._scene, this, currentBubble.spawnPosition);
          this._scene.add(bubble.mesh);
          bubble.addCollider();
        }

      } else {
        // if the first set is already in play, then check if we have a first bubble
        const firstBubbleInSet = this.levels[0].bubbleEntities[0];
        // if we do have a first bubble, make it active, make it start ageing
        if (firstBubbleInSet) {
          // console.log('This set still has a first bubble')
        } else {
          // if we don't have a first bubble, then remove the set.
          this.removeLevel();
        }
      }
    } else {
      // if there are no more levels in the levels array, the game is over!
      this.gameEnded = true;
    }

  }

  generateLevels() {
    const levelsGenerated = [];
    const sets = this.gameInfo.sets;

    for (let i = 0; i < sets; i++) {
      const spawnSide = findSideSpawned(i);
      const set: SetType = {
        sideSpawned: spawnSide,
        bubbleEntities: this.generateBubbles(spawnSide),
        inPlay: false,
      };
      levelsGenerated.push(set);
    }
    return levelsGenerated;
  }

  generateBubbles(spawnSide: 'right' | 'left' | 'frontR' | 'frontL' | 'crossR' | 'crossL') {
    const bubbles = [];
    let origin = avatarProportions.spinePos;
    let startPosition, spawnPos;

    const startAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? 0 : Math.PI / 2;
    const endAngle = (spawnSide !== 'crossL' && spawnSide !== 'crossR') ? Math.PI - 1.31 : Math.PI;
    const midAngle = (endAngle - startAngle) / 2;
    const angleIncrement = (endAngle - startAngle) / (this.gameInfo.reps - 1);

    for (let i = 0; i < this.gameInfo.reps; i++) {
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

      if (this.gameInfo.reps === 1) {
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

  // only removes the first bubble from the currently active level. removeBubble called when bubble ages (not collided with)
  removeBubble() {
    // doesn't need to handle mesh or scene removal (done in vanilla bubble) Just needs to update the array refernce for update loop
    if (this.levels[0].inPlay && this.levels[0].bubbleEntities.length > 0) {
      this.levels[0].bubbleEntities.splice(0, 1);
    }
  }

  // when all the bubble entities in this set's array are empty, the level is removed
  removeLevel() {
    this.levels.splice(0, 1);
  }

  makeFirstLevelInPlay() {
    this.levels[0].inPlay = true;
  }

}