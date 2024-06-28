import { useEffect, useMemo, useRef } from 'react';
import { useGameState } from '../store/GameState';
import { BubbleEntity as Entity } from '../store/types';
import BubbleEntity from './BubbleEntity';

export const Bubbles = () => {
  const gameState = useGameState();
  const visibleBubbles = useRef<Entity[] | null[]>()

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