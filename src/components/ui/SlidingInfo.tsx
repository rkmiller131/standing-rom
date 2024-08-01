import { useSceneState } from '../../hookstate-store/SceneState';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import TitleSubtitle from './TitleSubtitle';

import '../../css/SlidingInfo.css'

let mounted = false;

export default function SlidingInfo() {
  const sceneState = useSceneState();
  const sceneLoaded = sceneState.sceneLoaded.get({ noproxy: true });

  useEffect(() => {
    if (!mounted) {
      gsap.fromTo('#sliding-info-screen',
        {
          transform: 'translateX(-200%)',
          width: '0%',
          autoAlpha: 0
        },
        {
          duration: 1,
          transform: 'translateX(0)',
          width: '100%',
          minWidth: 'calc(4% + 450px)',
          autoAlpha: 1
        }
      )
      mounted = true;
    }

    if (sceneLoaded) {
      gsap.fromTo('#sliding-info-screen',
        {
          transform: 'translateX(0)',
          width: '100%',
          minWidth: 'calc(4% + 450px)',
          autoAlpha: 1
        },
        {
          transform: 'translateX(-200%)',
          width: '0%',
          autoAlpha: 0,
          duration: 3
        }
      )
    }
  }, [sceneLoaded])

  return (
    <div id="sliding-info-screen">
      <video className="sliding-info-video" autoPlay loop muted>
        <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/slidingInfoBG.webm?v=1722534406119" type="video/mp4" />
      </video>
      <div className="sliding-info-container">
        <div className="sliding-info-content">
          <img
            className="white-logo"
            alt="UVX Logo"
            src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/uvx-logoWhite.png?v=1722535954923"
          />
          <TitleSubtitle
            accentTitle='Bubble Pop'
            mainTitle='Shoulder ROM, Standing'
            className='sliding-title-override'
          />
          <p className="sliding-info-instructions">Here is a paragraph description of how to play the game. Pop all the bubbles with good form! And something scientific related to the exercises document for starting position, movement, etc.</p>
          <div className="img-placeholder">Pretend this is an image or GIF demo</div>
        </div>
      </div>
    </div>
  )
}