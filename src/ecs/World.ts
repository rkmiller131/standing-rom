import { World } from 'miniplex'
import createReactAPI from 'miniplex-react'
import { LevelsType } from './store/types'

/* Create a Miniplex world that holds our entities */
const world = new World<LevelsType>();

/* Create and export React bindings */
export const ECS = createReactAPI(world);