import { uiInteractions } from '../../../utils/cdn-links/sounds';
import gsap from 'gsap';
import { useRef, useEffect } from 'react';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';

interface AvatarCardProps {
  imgSrc: string;
  name: string;
  hoverImage: string;
  handleSelection: (avatar: string) => void;
  handleHover: (imgSrc: string | null) => void;
}

export default function AvatarCard({
  imgSrc,
  name,
  hoverImage,
  handleSelection,
  handleHover,
}: AvatarCardProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const { getSFX, getAllSounds } = useHookstateGetters();

  const handleMouseMove = (event: MouseEvent) => {
    const element = elementRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    gsap.to(element.querySelector('.parallax-bg'), {
      x: (x - rect.width / 2) / 20,
      y: (y - rect.height / 2) / 20,
      duration: 0.5,
      ease: 'power3.out',
    });
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    gsap.set(element.querySelector('.hover-text'), { autoAlpha: 0, x: -200 });

    const animateHoverIn = () => {
      gsap.to(element.querySelector('.hover-text'), {
        autoAlpha: 1,
        x: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
      element.style.border = '4px solid #f9cc35';
      const hoverSFX = new Audio(uiInteractions['choiceHover']);

      if (getAllSounds() && getSFX()) {
        hoverSFX.play();
      } else {
        hoverSFX.pause();
      }

      handleHover(hoverImage);
    };

    const animateHoverOut = () => {
      gsap.to(element.querySelector('.hover-text'), {
        autoAlpha: 0,
        x: -200,
        duration: 0.5,
        ease: 'power3.out',
      });
      gsap.to(element.querySelector('.parallax-bg'), {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'power3.out',
      });
      element.style.border = 'none';
      handleHover(null);
    };

    element.addEventListener('mouseenter', animateHoverIn);
    element.addEventListener('mouseleave', animateHoverOut);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', animateHoverIn);
      element.removeEventListener('mouseleave', animateHoverOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, [hoverImage, handleHover]);

  return (
    <div
      ref={elementRef}
      className="avatar-card"
      onClick={() => handleSelection(name)}
      style={{ backgroundImage: `url(${imgSrc})` }}
    >
      <div className="hover-text">{name}</div>
    </div>
  );
}
