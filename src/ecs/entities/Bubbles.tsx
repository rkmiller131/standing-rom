import { ECS, queries } from '../World';
import { useEntities } from 'miniplex-react';
import BubbleEntity from './BubbleEntity';
import { useEffect, useRef, useState } from 'react';
import { useGameState } from '../store/GameState';
// import { useEffect, useState } from 'react';
// import { useGameState } from '../store/GameState';
// import { ForkedECSComponent } from '../components/ForkedECSComponent';
// import Bubble from '../../DEMO/Bubble2';

// interface BubbleEntityProps {
//   position?: [number, number, number]
// }

export const Bubbles = () => {
  const gameState = useGameState();
  // query the world for everything that has a 'bubble' tag or component
  // const entities = useEntities(ECS.world.with('bubble').without('invisible'));
  // const entities = useEntities(ECS.world.with('bubble'));
  const [visibleBubbles, setVisibleBubbles] = useState([]);
  const entities = useRef(useEntities(queries.allBubbles))

  // useEffect(() => {
  //   // if (gameState.levels.get({noproxy: true}).length) {
  //   //   // map over the entities query and set only visible bubbles to be rendered
  //   //   setVisibleBubbles(entities.entities.filter((entity) => (
  //   //     entity.bubble.visible === true
  //   //   )))
  //   // }

  //   if (gameState.levels.get({noproxy: true})) {
  //     entities.current = entities.current.where((entity) => entity.bubble.visible === true);
  //   }
  //   console.log('entities are ', entities)

  // }, [gameState.levels])
  entities.current = entities.current.where((entity) => entity.bubble.visible === true);

  // function findVisibleBubbles() {
  //   const bubbles = queries.allBubbles;
  //   const test = bubbles.entities.filter((bubble) => bubble.bubble.visible === true);
  //   return new Bucket(test)
  // }



  return (
    <>
      <ECS.Entities in={entities.current}>
        {(e) => {
          console.log('eBubble is ', e);
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