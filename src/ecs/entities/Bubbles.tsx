import { ECS } from '../World';
import { useEntities } from 'miniplex-react';
import BubbleEntity from './BubbleEntity';

// interface BubbleEntityProps {
//   position?: [number, number, number]
// }

export const Bubbles = () => {
  // query the world for everything that has a 'bubble' tag or component
  const entities = useEntities(ECS.world.with('bubble'));
  console.log('entities are ', entities)

  return (
    <>
      <ECS.Entities in={entities}>
        {(eBubble) => {
          // console.log('eBubble is ', eBubble);
          return (
            <BubbleEntity 
              entity={eBubble} 
              position={eBubble.bubble.spawnPosition} 
              active={eBubble.bubble.active}
            />
          )
        }}
      </ECS.Entities>
    </>
  );
}