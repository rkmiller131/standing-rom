import { useSceneState } from '../../hookstate-store/SceneState';
import { useEffect } from 'react';
import { gsap } from 'gsap';
import TitleSubtitle from './TitleSubtitle';
import { slidingInfoBG } from '../../utils/cdn-links/motionGraphics';
import { uvxLogos } from '../../utils/cdn-links/images';
import { announcer } from '../../utils/cdn-links/sounds';

import '../../css/SlidingInfo.css'

let mounted = false;

export default function SlidingInfo() {
  const sceneState = useSceneState();
  const sceneLoaded = sceneState.sceneLoaded.get({ noproxy: true });

  useEffect(() => {
    if (!mounted) {
      mounted = true;
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
      const audio = new Audio(announcer['getCalibrated']);
      audio.volume = 0.75;
      audio.play();
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
      <div className="si-video-hue" />
      <video className="sliding-info-video" autoPlay loop muted>
        <source src={slidingInfoBG} type="video/webm" />
      </video>
      <div className="sliding-info-container">
        <div className="sliding-info-content">
          <img
            className="white-logo"
            alt="UVX Logo"
            src={uvxLogos['uvxWhite']}
          />
          <TitleSubtitle
            accentTitle='Bubble Pop'
            mainTitle='Shoulder ROM, Standing'
            className='sliding-title-override'
          />
          <p className="sliding-info-instructions">Get ready to use your hands and pop some bubbles! Keeping your shoulders down and elbows straight, move your arms to reach to the side, front, and across your body. Let's get moving and see how well you can score!</p>
        </div>
      </div>
    </div>
  )
}