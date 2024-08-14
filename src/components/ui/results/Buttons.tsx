import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface GameControlButtonsProps {
  onRestart: () => void;
  onNextGame: () => void;
}

export default function GameControlButtons({ onRestart, onNextGame }: GameControlButtonsProps) {
  const restartButtonRef = useRef<HTMLButtonElement>(null);
  const nextGameButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    gsap.fromTo(
      restartButtonRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      nextGameButtonRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.2 }
    );

    const handleMouseEnter = (button: HTMLButtonElement) => {
      gsap.to(button, { scale: 1.2, duration: 0.3, ease: 'power3.out' });
    };

    const handleMouseLeave = (button: HTMLButtonElement) => {
      gsap.to(button, { scale: 1, duration: 0.3, ease: 'power3.out' });
    };

    const restartButton = restartButtonRef.current;
    const nextGameButton = nextGameButtonRef.current;

    if (restartButton && nextGameButton) {
      restartButton.addEventListener('mouseenter', () => handleMouseEnter(restartButton));
      restartButton.addEventListener('mouseleave', () => handleMouseLeave(restartButton));

      nextGameButton.addEventListener('mouseenter', () => handleMouseEnter(nextGameButton));
      nextGameButton.addEventListener('mouseleave', () => handleMouseLeave(nextGameButton));
    }

    return () => {
      if (restartButton && nextGameButton) {
        restartButton.removeEventListener('mouseenter', () => handleMouseEnter(restartButton));
        restartButton.removeEventListener('mouseleave', () => handleMouseLeave(restartButton));

        nextGameButton.removeEventListener('mouseenter', () => handleMouseEnter(nextGameButton));
        nextGameButton.removeEventListener('mouseleave', () => handleMouseLeave(nextGameButton));
      }
    };
  }, []);

  return (
    <div className="game-control-buttons">
      <button className="button restart-button" onClick={onRestart} ref={restartButtonRef}>
        Try Again
      </button>
      <button className="button next-game-button" onClick={onNextGame} ref={nextGameButtonRef}>
        Continue
      </button>
    </div>
  );
}
