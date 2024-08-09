import { ECS } from '../World';
import { useEntities } from 'miniplex-react';
import BubbleEntity from './BubbleEntity';
import { useRef } from 'react';
import { PublicApi } from '@react-three/cannon';

export const Bubbles = () => {
  // query the world for everything that has a 'bubble' tag or related components
  const entities = useEntities(ECS.world.with('bubble'));
  const colliderRef = useRef<PublicApi | null>(null);

  // pass the collider ref to each bubble and if there is no current, set it, otherwise just use the change position?
  // every bubble entity (bubble component) starts by if active, set collider. Then set collider position to current bubble position.
  // if bubble popped, (on collide event), move position way outta the way
  return (
    <>
      <ECS.Entities in={entities}>
        {(e) => (
            <BubbleEntity
              entity={e}
              position={e.bubble.spawnPosition}
              active={e.bubble.active}
              colliderRef={colliderRef}
            />
          )}
      </ECS.Entities>
    </>
  );
}