import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useGameState } from '../hookstate-store/GameState';
import { gsap } from 'gsap';
import { announcer } from '../utils/cdn-links/sounds';
import useHookstateGetters from '../interfaces/Hookstate_Interface';

export default function CameraAnimations() {
  const { camera } = useThree();
  const gameState = useGameState();
  const { gameRunning } = useHookstateGetters();
  const sideSpawned = gameState.levels[0].sideSpawned;

  useEffect(() => {
    if (!sideSpawned) return;
    const side = sideSpawned.get({ noproxy: true });
    if (side === 'right' || side === 'left') {
      gsap.to(camera.position, {
        x: 0,
        y: 1,
        z: 2,
        duration: 1.5
      });
      gsap.to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5
      })
      // AUDIO ON CAMERA SWITCHES
      if (side === 'right' && gameRunning()) {
        const audio = new Audio(announcer['r_lateralRaise']);
        audio.volume = 0.75;
        audio.play();
      }
      if (side === 'left' && gameRunning()) {
        const audio = new Audio(announcer['l_lateralRaise']);
        audio.volume = 0.75;
        audio.play();
      }
    }

    if (side === 'frontR' || side === 'frontL') {
      const invert = side === 'frontR' ? 1 : -1;
      gsap.to(camera.position, {
        x: 1.4464595785701817 * invert,
        y: 1.6678777775434397,
        z: 0.57539653997066,
        duration: 2
      });
      gsap.to(camera.rotation, {
        x: -0.8574990047238096,
        y: 0.8992410888630242 * invert,
        z: 0.7354296422692501 * invert,
        duration: 2
      });
      // AUDIO ON CAMERA SWITCHES
      if (side === 'frontR' && gameRunning()) {
        const audio = new Audio(announcer['r_frontalRaise']);
        audio.volume = 0.75;
        audio.play();
      }
      if (side === 'frontL' && gameRunning()) {
        const audio = new Audio(announcer['l_frontalRaise']);
        audio.volume = 0.75;
        audio.play();
      }
    }

    if (side === 'crossR' || side === 'crossL') {
      const invert = side === 'crossR' ? 1 : -1;
      gsap.to(camera.position, {
        x: 0.6806856113154883 * invert,
        y: 2.271391391050578,
        z: 0.5156858327599767,
        duration: 2
      });
      gsap.to(camera.rotation, {
        x: -0.9833133808337716,
        y: 0.3391550045698274 * invert,
        z: 0.46332582886228135 * invert,
        duration: 2
      });
      // AUDIO ON CAMERA SWITCHES
      if (side === 'crossR' && gameRunning()) {
        const audio = new Audio(announcer['r_crossBody']);
        audio.volume = 0.75;
        audio.play();
      }
      if (side === 'crossL' && gameRunning()) {
        const audio = new Audio(announcer['l_crossBody']);
        audio.volume = 0.75;
        audio.play();
      }
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sideSpawned]);

  return null;
}