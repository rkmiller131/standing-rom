import { ECS } from '../World';
import { useEntities } from 'miniplex-react';
import BubbleEntity from './BubbleEntity';

export const Bubbles = () => {
  // query the world for everything that has a 'bubble' tag or related components
  const entities = useEntities(ECS.world.with('bubble'));
  return (
    <>
      <ECS.Entities in={entities}>
        {(e) => (
            <BubbleEntity
              entity={e}
              position={e.bubble.spawnPosition}
              active={e.bubble.active}
            />
          )}
      </ECS.Entities>
    </>
  );
}