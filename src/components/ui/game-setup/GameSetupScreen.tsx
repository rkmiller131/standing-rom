import { uvxLogos } from '../../../utils/cdn-links/images';
import { uiInteractions } from '../../../utils/cdn-links/sounds';
import { useEffect, useState } from 'react';
import PerspectiveWalls from './PerspectiveWalls';
import Platform from './Platform';
import SetupFooter from './SetupFooter';
import TitleSubtitle from '../TitleSubtitle';
import SelectionItem from './SelectionItem';
import GameSettings from './GameSettings';
import Button from '../../Button';

import '../../../css/GameSetupScreen.css';

export interface UnlockableItem {
  id: number;
  name: string;
  icon: string;
  preview: string;
  splash: string;
  unlocked: boolean;
  type: 'Environment' | 'Avatar';
}

export interface PlayerUnlockables {
  environments: UnlockableItem[];
  avatars: UnlockableItem[];
}

export interface SoundConfig {
  muteAllSound: boolean;
  announcer: boolean;
  music: boolean;
  sfx: boolean;
}

export interface GameConfigurationSettings {
  environment: UnlockableItem;
  avatar: UnlockableItem;
  sound: SoundConfig;
}

export default function GameSetupScreen() {
  const [selectionStage, setSelectionStage] = useState('Environment');
  const [selectionItems, setSelectionItems] = useState<UnlockableItem[]>([]);
  const [platformImage, setPlatformImage] = useState('');
  const [splashImage, setSplashImage] = useState('');
  const [gameSettings, setGameSettings] = useState<GameConfigurationSettings>({
    environment: {} as UnlockableItem,
    avatar: {} as UnlockableItem,
    sound: {
      muteAllSound: false,
      announcer: true,
      music: true,
      sfx: true
    }
  })

  // first, http get player unlockables above here. Then:
  // const playerUnlockables = httpGetPlayerUnlockables(...)
  useEffect(() => {
    if (selectionStage === 'Environment') {
      setSelectionItems(playerUnlockables.environments);
    } else if (selectionStage === 'Avatar') {
      setSelectionItems(playerUnlockables.avatars);
    } else if (selectionStage === 'Settings') {
      setSelectionItems([]);
    }

  }, [selectionStage])

  const changeStage = (state: 'Next' | 'Back') => {
    setSelectionStage((prev) => {
      if (prev === 'Environment' && state === 'Next') {
        return 'Avatar'
      }
      if (prev === 'Settings' && state === 'Back') {
        updateGameSettings('Avatar', {} as UnlockableItem);
        setSplashImage('');
        setPlatformImage('');
        return 'Avatar';
      }
      if (prev === 'Avatar' && state === 'Next') {
        return 'Settings';
      }
      if (prev === 'Avatar' && state === 'Back') {
        updateGameSettings('Environment', {} as UnlockableItem);
        setSplashImage('');
        setPlatformImage('');
        return 'Environment';
      }
      console.error('INVALID STAGE CHANGE COMBINATION - Defaulting to "Environment"');
      return 'Environment';
    });
  }

  const changePlatformImage = (platformURL: string, backSplashURL: string) => {
    setPlatformImage(platformURL);
    setSplashImage(backSplashURL);
  }

  const updateGameSettings = (key: string, value: UnlockableItem | SoundConfig) => {
    const name = key.toLowerCase();
    setGameSettings((details) => (
      {...details, [name]: value}
    ));
  }

  const handleReadyToPlay = () => {
    console.log('submitting configs!')
    console.log(gameSettings)
  }

  return (
    <div id="game-setup-screen">
      <a
        className="back-dashboard-link link-white"
        href="https://www.ubiquityvx.com/"
      >
        {'← Back to Dashboard'}
      </a>
      <img
        className="game-setup-uvx-logo"
        alt="UVX Logo"
        src={uvxLogos['uvxWhite']}
      />
      <PerspectiveWalls splashImage={selectionStage === 'Environment' ? splashImage : ''}/>
      <div className="game-setup-content-container">
        <div className="selection-container frosted-glass">
          <TitleSubtitle
            accentTitle='Choose your'
            mainTitle={selectionStage}
            className='callout-title small-callout-title'
          />
          <div className="selection-items-container">
            {selectionItems.length > 0 ? selectionItems.map((item) =>
              <SelectionItem
                item={item}
                changeStage={changeStage}
                changePlatformImage={changePlatformImage}
                updateGameSettings={updateGameSettings}
                key={item.id}
              />
            ) : (
              <GameSettings gameSettings={gameSettings} updateGameSettings={updateGameSettings}/>
            )}
          </div>
          {selectionStage !== 'Environment' ?
            <Button
              content="Back"
              onClick={() => {
                const backSFX = new Audio(uiInteractions['choiceBack']);
                backSFX.play();
                changeStage('Back')
              }}
              buttonStyle='secondary'
              extraClass='setup-back-button'
            /> : <div className="invisible-placeholder"/>
          }
        </div>
        <Platform platformImage={platformImage}/>
      </div>
      <SetupFooter gameSettings={gameSettings} clickHandler={handleReadyToPlay}/>
    </div>
  );
}

// Mock data for now - should come from a util fn call (an httpGet.. patient profile)
// Should get back data on what the patient has unlocked for each category and out of
// how many possible environments and avatars there are in Ubuiquity platform (super admin)
const playerUnlockables: PlayerUnlockables = {
  environments: [
    {
      id: 123,
      name: 'Outdoors',
      icon: '/outdoorEnvCard.webp',
      preview: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/outdoorOrbBubble.png?v=1725992090602',
      splash: '/OutdoorSplash.webp',
      unlocked: true,
      type: 'Environment'
    },
    {
      id: 456,
      name: 'Indoor Office',
      icon: '/indoorEnvCard.webp',
      preview: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/officeOrbBubble.png?v=1725992102663',
      splash: '/OfficeSplash.webp',
      unlocked: true,
      type: 'Environment'
    },
    {
      id: 789,
      name: 'Underwater',
      icon: '',
      preview: '',
      splash: '',
      unlocked: false,
      type: 'Environment'
    },
    {
      id: 147,
      name: 'Desert',
      icon: '',
      preview: '',
      splash: '',
      unlocked: false,
      type: 'Environment'
    },
    {
      id: 258,
      name: 'Outer Space',
      icon: '',
      preview: '',
      splash: '',
      unlocked: false,
      type: 'Environment'
    },
    {
      id: 369,
      name: 'Tropical Cove',
      icon: '',
      preview: '',
      splash: '',
      unlocked: false,
      type: 'Environment'
    },
    {
      id: 753,
      name: 'Italian Town',
      icon: '',
      preview: '',
      splash: '',
      unlocked: false,
      type: 'Environment'
    }
  ],
  avatars: [
    {
      id: 951,
      name: 'maleModel1',
      icon: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/maleModel1Icon.svg?v=1725994523021',
      preview: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/maleModel1Preview.webp?v=1725929091641',
      splash: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/maleModel1Splash.png?v=1725928652881',
      unlocked: true,
      type: 'Avatar'
    },
    {
      id: 846,
      name: 'femaleModel1',
      icon: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/femaleModel1Icon.svg?v=1725994464433',
      preview: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/femaleModel1Preview.webp?v=1725929094029',
      splash: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/femaleModel1Splash.png?v=1725928642588',
      unlocked: true,
      type: 'Avatar'
    },
    {
      id: 351,
      name: 'maleModel2',
      icon: '',
      preview: '',
      splash: '',
      unlocked: false,
      type: 'Avatar'
    },
    {
      id: 953,
      name: 'femaleModel2',
      icon: '',
      preview: '',
      splash: '',
      unlocked: false,
      type: 'Avatar'
    }
  ]
}