import { Vector3 } from 'three';

export interface OpaqueType<T extends string> {
  readonly __opaqueType: T;
}

export type EntityId = OpaqueType<'entity'> & number;

export type BubbleEntity = {
  age: number;
  active: boolean;
  spawnPosition: Vector3;
}

export type SetType = {
  sideSpawned: 'right' | 'left' | 'frontR' | 'frontL' | 'crossR' | 'crossL';
  // bubbleEntities: Array<EntityId | null | undefined>;
  bubbleEntities: Array<BubbleEntity>;
  inPlay: boolean;
};

export type LevelsType = Array<SetType>;

export type ScoreType = {
  totalBubbles: number;
  popped: number;
  maxLeftArmAngle: number;
  maxRightArmAngle: number;
  poppedVelocities: number[];
};

export type GameType = {
  levels: LevelsType;
  score: ScoreType;
  gameOver: boolean;
};

export type SceneType = {
  sceneLoaded: boolean;
  environmentLoaded: boolean;
  device: 'Desktop' | 'Tablet' | 'Mobile';
  selectedEnvironment: 'Indoor Office' | 'Outdoors' | '';
};
