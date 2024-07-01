import { VRM } from '@pixiv/three-vrm';
import { useSceneState } from '../ecs/store/SceneState';
import { useGameState } from '../ecs/store/GameState';
import { Clock, Vector3 } from 'three';
import { useFrame } from '@react-three/fiber';
import HandCollider from './classes/HandCollider';
import { useRef } from 'react';

interface HandProps {
  avatar: React.RefObject<VRM>;
  handedness: 'right' | 'left';
}

const previousPosition = new Vector3();
const currentPosition = new Vector3();

export default function Hand({ avatar, handedness }: HandProps) {
  const sceneState = useSceneState();
  const gameState = useGameState();
  const sceneLoaded = sceneState.sceneLoaded.get({ noproxy: true });

  const handCollider = new HandCollider(handedness);
  const poppedBubbles = handCollider.poppedTargets;
  const clock = useRef(new Clock());

  useFrame(() => {
    if (sceneLoaded && avatar.current){
      const handNodeWorld = handedness === 'right' ?
      avatar.current.humanoid.humanBones.rightMiddleProximal?.node.matrixWorld :
      avatar.current.humanoid.humanBones.leftMiddleProximal?.node.matrixWorld;

      if (!handNodeWorld) return;

      currentPosition.setFromMatrixPosition(handNodeWorld)

      if (currentPosition && handCollider.body) {
        handCollider.body.position.set(currentPosition.x, currentPosition.y, currentPosition.z);
      }

      // TODO: VELOCITY DOESNT SEEM CORRECT
      // Revist the calculation and compare to some hand calculations to ensure accuracy. Should be m/s
      // previous versions of this used the delta from useFrame, which is time in between frames, not an arbitrary seconds
      // we would want seconds from one pop to the next, and the distance the arm has traveled since last pop
      if (poppedBubbles.size > 0) {
        const delta = clock.current.getElapsedTime(); // in seconds
        console.log('delta is ', delta)
        const distance = currentPosition.clone().sub(previousPosition);

        console.log('distance length is ', distance.length())
        console.log('distance divided by seconds ', distance.length() / delta)

        const velocityVector = distance.clone().divideScalar(delta);
        // velocityVector.normalize();
        previousPosition.copy(currentPosition);

        poppedBubbles.forEach(() => {
          const velocity = (Math.abs(velocityVector.x) + Math.abs(velocityVector.y) + Math.abs(velocityVector.z)) / 3;
          gameState.popBubble(velocity);
        })
        poppedBubbles.clear();
        clock.current.start();
      }
    }
  });

  return null;
}