import { Object3D } from 'three';

export type SceneObjectComponent = {
  sceneObject: Object3D;
};

export const sceneObject = (): SceneObjectComponent => ({ sceneObject: new Object3D() });