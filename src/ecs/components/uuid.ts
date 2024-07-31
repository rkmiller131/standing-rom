import { EntityId } from '../../hookstate-store/Types';

export type UUIDComponent = {
  uuid: EntityId;
};

const idIncrementer = {
  currentId: 0,
  registeredEntities: {} as { [key: number]: boolean } // maybe not needed, we'll see
}

export const uuidComponent = (): UUIDComponent => {
  idIncrementer.currentId++;
  const id = idIncrementer.currentId;
  return { uuid: id as EntityId};
}