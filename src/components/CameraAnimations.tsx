import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useGameState } from '../hookstate-store/GameState';
import { gsap } from 'gsap';
import { announcer } from '../utils/cdn-links/sounds';
import useHookstateGetters from '../interfaces/Hookstate_Interface';

export default function CameraAnimations() {
  const { camera } = useThree();
  const gameState = useGameState();
  const { gameRunning, getAnnouncer } = useHookstateGetters();
  const sideSpawned = gameState.levels[0].sideSpawned;

  useEffect(() => {
    if (!sideSpawned) return;
    const side = sideSpawned.get({ noproxy: true });
    if ((side === 'right' || side === 'left') && !gameRunning()) {
      // intermediate position from initial renderer camera pos
      gsap.to(camera.position, {
        x: -6,
        y: 1,
        z: 0,
        duration: 0.85,
      });
      gsap.to(camera.rotation, {
        x: -2.1410783996934777,
        y: -1.75,
        z: -2.17339982566482,
        duration: 0.85,
      });
      // final camera position (behind the avatar)
      gsap.to(camera.position, {
        x: 0,
        y: 1,
        z: 2,
        duration: 0.85,
      });
      gsap.to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.85,
      });
    } else if (side === 'right' || side === 'left') {
      gsap.to(camera.position, {
        x: 0,
        y: 1,
        z: 2,
        duration: 1.5,
      });
      gsap.to(camera.rotation, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1.5,
      });
      // AUDIO ON CAMERA SWITCHES
      if (side === 'right' && gameRunning()) {
        if (getAnnouncer()) {
          const audio = new Audio(announcer['r_lateralRaise']);
          audio.volume = 0.75;
          audio.play();
        }
      }
      if (side === 'left' && gameRunning()) {
        if (getAnnouncer()) {
          const audio = new Audio(announcer['l_lateralRaise']);
          audio.volume = 0.75;
          audio.play();
        }
      }
    } else if (side === 'frontR' || side === 'frontL') {
      const invert = side === 'frontR' ? 1 : -1;
      gsap.to(camera.position, {
        x: 1.4464595785701817 * invert,
        y: 1.6678777775434397,
        z: 0.57539653997066,
        duration: 2,
      });
      gsap.to(camera.rotation, {
        x: -0.8574990047238096,
        y: 0.8992410888630242 * invert,
        z: 0.7354296422692501 * invert,
        duration: 2,
      });
      // AUDIO ON CAMERA SWITCHES
      if (side === 'frontR' && gameRunning()) {
        if (getAnnouncer()) {
          const audio = new Audio(announcer['r_frontalRaise']);
          audio.volume = 0.75;
          audio.play();
        }
      }
      if (side === 'frontL' && gameRunning()) {
        if (getAnnouncer()) {
          const audio = new Audio(announcer['l_frontalRaise']);
          audio.volume = 0.75;
          audio.play();
        }
      }
    } else if (side === 'crossR' || side === 'crossL') {
      const invert = side === 'crossR' ? 1 : -1;
      gsap.to(camera.position, {
        x: 0.6806856113154883 * invert,
        y: 2.271391391050578,
        z: 0.5156858327599767,
        duration: 2,
      });
      gsap.to(camera.rotation, {
        x: -0.9833133808337716,
        y: 0.3391550045698274 * invert,
        z: 0.46332582886228135 * invert,
        duration: 2,
      });
      // AUDIO ON CAMERA SWITCHES
      if (side === 'crossR' && gameRunning()) {
        if (getAnnouncer()) {
          const audio = new Audio(announcer['r_crossBody']);
          audio.volume = 0.75;
          audio.play();
        }
      }
      if (side === 'crossL' && gameRunning()) {
        if (getAnnouncer()) {
          const audio = new Audio(announcer['l_crossBody']);
          audio.volume = 0.75;
          audio.play();
        }
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sideSpawned]);

  return null;
}

/*
camera position is  _Vector3{x: -1.5561691865072314, y: 1.344923908078713, z: -0.2517945966741758}
GameLogic.tsx:21 camera rotation is  _Euler{isEuler: true, _x: -2.1410783996934777, _y: -1.200624976162512, _z: -2.17339982566482, _order: 'XYZ'}
*/
