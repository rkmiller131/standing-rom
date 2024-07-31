import { World } from 'miniplex';
import createReactAPI from 'miniplex-react';
import { Vector3 } from 'three';
import { SceneObjectComponent } from './components/sceneObject';
import { BubbleCollider } from './components/bubbleCollider';

type WorldEntities = {
  bubble: {
    age: number;
    spawnPosition: Vector3;
    active: boolean;
  }
}

type OptionalComponents = SceneObjectComponent & BubbleCollider;

// export type Entity = RequiredComponents & Partial<OptionalComponents & BubbleTag>
export type Entity = Partial<WorldEntities & OptionalComponents>;

/* Create a Miniplex world that holds our entities */
const world = new World<Entity>();

/* Create and export React bindings */
export const ECS = createReactAPI(world);

/* necessary for retrieving specific entities later by id. ECS automatically gives ids,
just need reference to them. However, will need to refactor with uuids */
export const worldBubbleIds = [] as number[];

export function removeBubbleFromECSFIFO() {
  const currentECSBubbleId = worldBubbleIds[0];
  const bubbleEntity = ECS.world.entity(currentECSBubbleId);
  if (bubbleEntity) ECS.world.remove(bubbleEntity);
  worldBubbleIds.splice(0, 1);
}

// HELPFUL EXAMPLE (BETTER THAN THE DOCS)
// https://github.com/rechenberger/neoverse-firestarter/blob/main/src/components/3d/Galaxy.tsx