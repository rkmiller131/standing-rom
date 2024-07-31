import { Vector3 } from 'three';

export interface OpaqueType<T extends string> {
  readonly __opaqueType: T;
}

export type EntityId = OpaqueType<'entity'> & number;

export type Bubble = {
  age: number;
  spawnPosition: Vector3;
  active: boolean;
}

export type SetType = {
  sideSpawned: 'right' | 'left' | 'frontR' | 'frontL' | 'crossR' | 'crossL';
  bubbleEntities: Bubble[];
  inPlay: boolean;
};

export type LevelsType = Array<SetType>;

export type ScoreType = {
  totalBubbles: number;
  popped: number;
  maxLeftArmAngle: number;
  maxRightArmAngle: number;
  poppedVelocities: number[];
  currentStreak: number;
};

export type GameType = {
  levels: LevelsType;
  score: ScoreType;
  gameOver: boolean;
};

export type SceneType = {
  sceneLoaded: boolean;
  environmentLoaded: boolean;
  gameRunning: boolean;
  device: 'Desktop' | 'Tablet' | 'Mobile';
  selectedEnvironment: 'Indoor Office' | 'Outdoors' | '';
};