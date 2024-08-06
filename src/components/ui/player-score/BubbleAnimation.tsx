/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';
import { useGameState } from '../../../hookstate-store/GameState';
import { bubbleAnimations } from '../../../utils/cdn-links/motionGraphics';

export default function BubbleAnimation() {
  const { getPoppedBubbleCount } = useHookstateGetters();
  const bubbleAnimRef = useRef<HTMLVideoElement | null>(null);
  const idleAnimRef = useRef<HTMLVideoElement | null>(null);
  const [idleVisibility, setIdleVisibility] = useState(true);
  const popped = getPoppedBubbleCount();
  const gameState = useGameState();

  useEffect(() => {
    const popAnimation = bubbleAnimRef.current;
    const idleAnimation = idleAnimRef.current;
    if (!popAnimation || !idleAnimation || popped === 0) return;

    setIdleVisibility(false);
    popAnimation.play();

    const handleAnimationEnd = () => {
      setIdleVisibility(true);
    }
    popAnimation.addEventListener('ended', handleAnimationEnd);

    return () => {
      if (popAnimation) popAnimation.removeEventListener('ended', handleAnimationEnd);
    };
  }, [gameState.score.popped])

  return (
    <div className="bubble-animations">
      <video ref={idleAnimRef} muted autoPlay loop className={`${idleVisibility ? 'animation' : 'animation hide'}`}>
        <source src={bubbleAnimations['idle']} type="video/webm"/>
      </video>
      <video ref={bubbleAnimRef} muted className="animation popping-bubble" onCanPlay={() => bubbleAnimRef.current!.playbackRate = 5.0}>
        <source src={bubbleAnimations['popping']} type="video/webm"/>
      </video>
    </div>
  )
}