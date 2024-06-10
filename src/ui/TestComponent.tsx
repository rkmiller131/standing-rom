/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from 'react';
import { useEngine } from 'refactor-ecs';
import { Entity } from 'refactor-ecs/src/ecs/Entity';

export default function TestComponent({ name }: { name: string }) {
  const { engine, createEntity } = useEngine();
  const entity = useRef<Entity | null>(null);

  // Create the entity once and store it as a ref to prevent creating new entities every render
  useEffect(() => {
    if (!entity.current) {
      const newEntity = createEntity();
      entity.current = newEntity;
      entity.current.setName(name);
    }
  }, []);

  console.log('engine is ', engine)

  return null;
}
