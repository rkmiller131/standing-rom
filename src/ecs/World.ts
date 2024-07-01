import { World } from 'miniplex';
import createReactAPI from 'miniplex-react';
import { Vector3 } from 'three';
import { SceneObjectComponent } from './components/sceneObject';
import { SphereColliderComponent } from './components/SphereCollider';

type WorldEntities = {
  bubble: {
    age: number;
    spawnPosition: Vector3;
    active: boolean;
  }
}

type OptionalComponents = SceneObjectComponent &
  SphereColliderComponent

// export type Entity = RequiredComponents & Partial<OptionalComponents & BubbleTag>
export type Entity = Partial<WorldEntities & OptionalComponents>;

/* Create a Miniplex world that holds our entities */
const world = new World<Entity>();

/* Create and export React bindings */
export const ECS = createReactAPI(world);


// HELPFUL EXAMPLE (BETTER THAN THE DOCS)
// https://github.com/rechenberger/neoverse-firestarter/blob/main/src/components/3d/Galaxy.tsx