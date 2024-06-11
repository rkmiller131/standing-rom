import { World } from 'miniplex';
import createReactAPI from 'miniplex-react';
import { AgeComponent } from './components/age';
import { TransformComponent } from './components/transform';
import { ColliderComponent } from './components/sphereCollider';
import { SceneObjectComponent } from './components/mesh';

/* Create a list of components, perhaps some required, some optional, to exist in our world */
// type RequiredComponents = ??
  // ??

type OptionalComponents = AgeComponent &
  TransformComponent &
  ColliderComponent &
  SceneObjectComponent

type BubbleTag = {
  isBubble: boolean
}

// export type Entity = RequiredComponents & Partial<OptionalComponents & BubbleTag>
export type Entity = Partial<OptionalComponents & BubbleTag>;

/* Create a Miniplex world that holds our entities */
export const world = new World<Entity>();

/* Create and export React bindings */
export const ECS = createReactAPI(world);


// HELPFUL EXAMPLE (BETTER THAN THE DOCS)
// https://github.com/rechenberger/neoverse-firestarter/blob/main/src/components/3d/Galaxy.tsx