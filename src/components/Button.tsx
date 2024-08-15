/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface ButtonProps {
  primaryStyle?: boolean;
  content: string;
  onClick: (props: any) => void;
  extraClass?: string;
  animate?: boolean;
}

export default function Button({ primaryStyle = true, content, onClick, extraClass, animate = false }: ButtonProps) {
  const buttonClass = primaryStyle ? 'button-primary' : 'button-secondary';
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!animate || !buttonRef.current) return;
    gsap.fromTo(
      buttonRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 2, ease: 'power3.out' }
    );

    const handleMouseEnter = (button: HTMLButtonElement) => {
      gsap.to(button, { scale: 1.2, duration: 0.3, ease: 'power3.out' });
    };

    const handleMouseLeave = (button: HTMLButtonElement) => {
      gsap.to(button, { scale: 1, duration: 0.3, ease: 'power3.out' });
    };

    const button = buttonRef.current;
    if (button) {
      buttonRef.current.addEventListener('mouseenter', () => handleMouseEnter(button));
      buttonRef.current.addEventListener('mouseleave', () => handleMouseLeave(button));
    }

    return () => {
      if (button) {
        buttonRef.current.removeEventListener('mouseenter', () => handleMouseEnter(button));
        // eslint-disable-next-line react-hooks/exhaustive-deps
        buttonRef.current.removeEventListener('mouseleave', () => handleMouseLeave(button));
      }
    };
  }, [animate]);

  return (
    <button className={`${buttonClass} ${extraClass}`} onClick={onClick} ref={buttonRef}>
      {content}
    </button>
  )
}