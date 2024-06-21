import { useEffect, useMemo, useRef, useState } from 'react';
import { useGameState } from '../store/GameState';
import { BubbleEntity as Entity } from '../store/types';
import BubbleEntity from './BubbleEntity';

export const Bubbles = () => {
  const gameState = useGameState();
  // query the world for everything that has a 'bubble' tag or component
  // const entities = useEntities(ECS.world.with('bubble').without('invisible'));
  // const entities = useEntities(ECS.world.with('bubble'));
  // const [visibleBubbles, setVisibleBubbles] = useState([] as Entity[]);
  const visibleBubbles = useRef<Entity[] | null[]>()
  // const entities = useRef(queries.allBubbles)

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
  // entities.current = entities.current.where((entity) => entity.bubble.visible === true);

  // function findVisibleBubbles() {
  //   const bubbles = queries.allBubbles;
  //   const test = bubbles.entities.filter((bubble) => bubble.bubble.visible === true);
  //   return new Bucket(test)
  // }

  const filteredEntities = useMemo(() => {
    if (!gameState.levels[0].bubbleEntities) {
      return [];
    }
    return gameState.levels[0].bubbleEntities.get({ noproxy: true });
  }, [gameState.levels])

  useEffect(() => {
    visibleBubbles.current = filteredEntities
    console.log('Filtered entities are', filteredEntities);
  }, [filteredEntities]);

  return (
    <>
      {visibleBubbles.current && visibleBubbles.current.map((entity) => (
        <BubbleEntity
          position={entity.spawnPos}
          active={entity.active}
          key={entity.uuid}
        />
      ))}
    </>
  );
}