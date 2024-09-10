/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from 'react';
import { lockedIcons } from '../../../utils/cdn-links/images';
import { UnlockableItem } from './GameSetupScreen';
import { uiInteractions } from '../../../utils/cdn-links/sounds';
import gsap from 'gsap';

interface SelectionItemProps {
  item: UnlockableItem;
  changeStage: (state: 'Next' | 'Back') => void;
  changePlatformImage: (platformURL: string, backSplashURL: string) => void;
  updateGameSettings: (key: string, value: UnlockableItem) => void;
}

export default function SelectionItem({ item, changeStage, changePlatformImage, updateGameSettings }: SelectionItemProps) {
  const elementRef = useRef<HTMLButtonElement>(null);
  const itemUnlocked = item.unlocked;
  const icon = itemUnlocked ? item.icon : item.type === 'Environment' ? lockedIcons.environment : lockedIcons.avatar;

  const handleSelection = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // turn this into an if/else for game config settings. If item type is config do something different. ELSE, if itemUnlcoked...
    if (itemUnlocked) {
      updateGameSettings(item.type, item);
      changeStage('Next');
      const selectSFX = new Audio(uiInteractions['choiceSelect']);
      selectSFX.play();
    } else {
      const element = elementRef.current;
      if (!element) return;

      const lockedText = element.querySelector('.locked-text');
      if (!lockedText) return; // necessary to keep every selection item uniquely animated

      gsap.set(element.querySelector('.locked-text'), { autoAlpha: 0, x: -50 });

      const tl = gsap.timeline({
        defaults: { ease: 'power3.out', duration: 0.3 }
      });

      tl.from(lockedText, { autoAlpha: 0, x: -50 })
        .to(lockedText, { autoAlpha: 1, x: 1 })
        .to(lockedText, { autoAlpha: 0, x: -50 }, '+=0.5');

      console.log('Item is locked');
    }
  };

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleHoverIn = () => {
      if (itemUnlocked) {
        changePlatformImage(item.preview, item.splash);
        const hoverSFX = new Audio(uiInteractions['choiceHover']);
        hoverSFX.play();
      }
    };

    element.addEventListener('mouseenter', handleHoverIn);

    return () => {
      gsap.killTweensOf('*');
      element.removeEventListener('mouseenter', handleHoverIn);
    };
  }, []);

  return (
    <button
      className={`${!itemUnlocked ? 'selection-item-locked' : item.type === 'Environment' ? 'selection-item-environment' : 'selection-item-avatar'}`}
      onClick={(e) => handleSelection(e)}
      ref={elementRef}
    >
      <img src={icon} alt="selection item icon"/>
      <div className="locked-text">{itemUnlocked ? '' : 'Locked'}</div>
    </button>
  );
}