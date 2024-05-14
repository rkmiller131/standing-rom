import { Object3D, Scene } from 'three';

export const createTargetObject = (
  scene: Scene,
  lock: [number, number, number],
) => {
  const targetObject = new Object3D();
  targetObject.position.set(...lock);
  scene.add(targetObject);
  return targetObject;
};
