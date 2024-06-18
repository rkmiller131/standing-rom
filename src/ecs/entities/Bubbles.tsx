import { ECS } from '../World';
import { useEntities } from 'miniplex-react';
import BubbleEntity from './BubbleEntity';
// import { ForkedECSComponent } from '../components/ForkedECSComponent';
// import Bubble from '../../DEMO/Bubble2';

// interface BubbleEntityProps {
//   position?: [number, number, number]
// }

export const Bubbles = () => {
  // query the world for everything that has a 'bubble' tag or component
  const entities = useEntities(ECS.world.with('bubble'));
  // console.log('entities are ', entities)

  return (
    <>
      <ECS.Entities in={entities}>
        {(e) => {
          // console.log('eBubble is ', e);
          return (
            <BubbleEntity
              entity={e}
              position={e.bubble.spawnPosition}
              active={e.bubble.active}
            />
          )
        }}
      </ECS.Entities>
    </>
  );
}