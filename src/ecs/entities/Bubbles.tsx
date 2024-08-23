import { ECS, queries } from '../World';
import { useEntities } from 'miniplex-react';
import BubbleEntity from './BubbleEntity';

interface BubblesProps {
  playParticles: (position: [number, number, number]) => void;
}

export const Bubbles = ({ playParticles }: BubblesProps) => {
  // query the world for everything that has a 'bubble' tag or related components
  const entities = useEntities(queries.bubbles);
  return (
    <>
      <ECS.Entities in={entities}>
        {(e) => (
            <BubbleEntity
              entity={e}
              position={e.spawnPosition}
              playParticles={playParticles}
            />
          )}
      </ECS.Entities>
    </>
  );
}