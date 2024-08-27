import { EnvironmentSelectionType } from '../../../hookstate-store/Types';
import { uiInteractions } from '../../../utils/cdn-links/sounds';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useSceneState } from '../../../hookstate-store/SceneState';

interface EnvironmentCardProps {
  imgSrc: string;
  name: string;
  handleSelection: (environment: EnvironmentSelectionType) => void;
}

export default function EnvironmentCard({
  imgSrc,
  name,
  handleSelection,
}: EnvironmentCardProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const sceneState = useSceneState();

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
      if (sceneState.soundSettings.sfx.get({ noproxy: true })) {
        hoverSFX.play();
      } else if (
        sceneState.soundSettings.sfx.get({ noproxy: true }) === false
      ) {
        hoverSFX.pause();
      } else {
        hoverSFX.play();
      }
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
    };

    element.addEventListener('mouseenter', animateHoverIn);
    element.addEventListener('mouseleave', animateHoverOut);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', animateHoverIn);
      element.removeEventListener('mouseleave', animateHoverOut);
      element.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className="environment-card"
      onClick={() => handleSelection(name as EnvironmentSelectionType)}
      style={{ backgroundImage: `url(${imgSrc})` }}
    >
      <div
        className="parallax-bg"
        style={{ backgroundImage: `url(${imgSrc})` }}
      ></div>
      <div className="hover-text">{name}</div>
    </div>
  );
}
