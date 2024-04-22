import { Vector3 } from 'three'

export interface OpaqueType<T extends string> {
    readonly __opaqueType: T
}

export type EntityId = OpaqueType<'entity'> & number

export type SetType = {
    sideSpawned: 'right' | 'left' | 'frontR' | 'frontL' | 'crossR' | 'crossL'
    bubbleEntities: Array<EntityId | null | undefined>
    inPlay: boolean
  }

  export type LevelsType = Array<SetType>
  
  export type ScoreType = {
    totalBubbles: number
    popped: number
    maxLeftArmAngle: number
    maxRightArmAngle: number
    poppedVelocities: Vector3[]
  }
  
  export type GameType = {
    levels: LevelsType,
    score: ScoreType,
    gameOver: boolean
  }