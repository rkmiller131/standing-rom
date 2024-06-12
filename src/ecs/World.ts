import { World } from 'miniplex';
import createReactAPI from 'miniplex-react';
import { SphereColliderComponent } from './components/sphereCollider';
import { SceneObjectComponent } from './components/sceneObject';
import { BubbleComponent } from './components/bubble';

/* Create a list of components, perhaps some required, some optional, to exist in our world */
// type RequiredComponents = ??
  // ??

type OptionalComponents = BubbleComponent &
  SphereColliderComponent &
  SceneObjectComponent

// export type Entity = RequiredComponents & Partial<OptionalComponents & BubbleTag>
export type Entity = Partial<OptionalComponents>;

/* Create a Miniplex world that holds our entities */
const world = new World<Entity>();

/* Create and export React bindings */
export const ECS = createReactAPI(world);


// HELPFUL EXAMPLE (BETTER THAN THE DOCS)
// https://github.com/rechenberger/neoverse-firestarter/blob/main/src/components/3d/Galaxy.tsx