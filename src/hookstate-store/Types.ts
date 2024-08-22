import { Vector3 } from 'three';

export interface OpaqueType<T extends string> {
  readonly __opaqueType: T;
}

export type EntityId = OpaqueType<'entity'> & number;

export type EnvironmentSelectionType = 'Outdoors' | 'Indoor Office' | '';

export type Bubble = {
  age: number;
  spawnPosition: Vector3;
  active: boolean;
};

export type LevelsType = Array<Bubble>;

export type ScoreType = {
  totalBubbles: number;
  popped: number;
  maxLeftArmAngle: number;
  maxRightArmAngle: number;
  poppedRightVelocities: number[];
  poppedLeftVelocities: number[];
  currentStreak: number;
};

export type GameType = {
  level: LevelsType;
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
