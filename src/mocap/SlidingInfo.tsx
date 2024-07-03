import { gsap } from 'gsap';
import { useEffect } from 'react';

let mounted = false;

export default function SlidingInfo() {

  useEffect(() => {
    if (mounted) return;
    gsap.fromTo('#sliding-info-container',
      {
        transform: 'translateX(-200%)',
        width: '0%',
        autoAlpha: 0
      },
      {
        duration: 1,
        transform: 'translateX(0)',
        width: '40%',
        minWidth: 'calc(4% + 450px)',
        autoAlpha: 1
      }
    )
    mounted = true;
  }, [])

  return (
    <div id="sliding-info-container">
      <div className="sliding-info-content">
        <span className="uvx-text-logo">UVX Text Logo</span>
        <h2 className="sliding-info-game-title">Standing, Shoulder ROM</h2>
        <span className="accent-label">Your goal</span>
        <p className="sliding-info-instructions">Here is a paragraph description of how to play the game. Pop all the bubbles with good form! And something scientific related to the exercises document for starting position, movement, etc.</p>
        <div className="img-placeholder">Pretend I'm an image or gif demo</div>
      </div>
    </div>
  )
}