import { useState, useCallback } from 'react';
import {
  EnvironmentSelectionType,
  AvatarSelectionType,
} from '../../../hookstate-store/Types';
import { uiInteractions } from '../../../utils/cdn-links/sounds';
import { environmentCards, avatarCards } from '../../../utils/cdn-links/images';
import EnvironmentCard from './EnvironmentCard';
import TitleSubtitle from '../TitleSubtitle';
import AvatarCard from '../avatar-selection/AvatarCard';

import '../../../css/SetupScreen.css';
import SceneControls from '../SceneControls';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';
import { useSceneState } from '../../../hookstate-store/SceneState';

const selectSFX = new Audio(uiInteractions['choiceSelect']);

export default function SetupScreen() {
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<EnvironmentSelectionType | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [hoveredAvatarImage, setHoveredAvatarImage] = useState<string | null>(
    null,
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);

  const sceneState = useSceneState();

  const { setReady, getReady, getSFX, getMusic, getAnnouncer, getAllSounds } =
    useHookstateGetters();

  const handleEnvironmentSelection = useCallback(
    (environment: EnvironmentSelectionType) => {
      // sceneState.selectedEnvironment.set(environment); dont trigger play just yet...
      setSelectedEnvironment(environment);
      setHoveredImage(null);
      if (getAllSounds() && getSFX()) {
        selectSFX.play();
      } else {
        selectSFX.pause();
      }
    },
    [sceneState],
  );

  const handleAvatarSelection = useCallback((avatar: string) => {
    setSelectedAvatar(avatar);
    setHoveredAvatarImage(null);
    if (getAllSounds() && getSFX()) {
      selectSFX.play();
    } else {
      selectSFX.pause();
    }
  }, []);

  const handleAvatarHover = useCallback((imgSrc: string | null) => {
    setHoveredAvatarImage(imgSrc);
  }, []);

  const handleEnvironmentHover = useCallback((imgSrc: string | null) => {
    setHoveredImage(imgSrc);
  }, []);

  const handleBackToEnvironmentSelection = () => {
    setSelectedEnvironment(null);
    if (getAllSounds() && getSFX()) {
      selectSFX.play();
    } else {
      selectSFX.pause();
    }
  };

  const handleBackToAvatarSelection = () => {
    setSelectedAvatar(null);
    if (getAllSounds() && getSFX()) {
      selectSFX.play();
    } else {
      selectSFX.pause();
    }
  };

  const getEnvironmentImage = () => {
    const selectedEnv = environmentCards.find(
      (env) => env.name === selectedEnvironment,
    );
    return selectedEnv ? selectedEnv.imgSrc : null;
  };

  const getAvatarImage = () => {
    const selectedAv = avatarCards.find((av) => av.name === selectedAvatar);
    return selectedAv ? selectedAv.imgSrc : null;
  };

  const runGame = () => {
    if (selectedEnvironment && selectedAvatar) {
      sceneState.selectedEnvironment.set(selectedEnvironment);
      sceneState.selectedAvatar.set(selectedAvatar as AvatarSelectionType);
    }
  };

  if (getReady()) return null;

  return (
    <div id="setup">
      <img
        src="https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/uvxLogoWhite.png?v=1724094162122"
        alt="UbiquityVX Logo"
        className="uvx-logo"
      />
      <img src="/bgCard.svg" className="setup-screen-bg-video" />
      <div className="container">
        <div className="box">
          {selectedAvatar ? (
            <>
              <div className="box2-content">
                <TitleSubtitle
                  className="select-environment-title"
                  accentTitle="Game Settings"
                  mainTitle="Options"
                />
                <div id="options-container">
                  <SceneControls />
                </div>
              </div>
              <button
                className="back-button"
                onClick={handleBackToAvatarSelection}
              >
                Back
              </button>
            </>
          ) : selectedEnvironment ? (
            <>
              <div className="avatar-content">
                <TitleSubtitle
                  className="select-environment-title"
                  accentTitle="Choose Your"
                  mainTitle="Avatar"
                />
                <div id="avatar-cards-container">
                  {avatarCards.map((avatar) => (
                    <AvatarCard
                      name={avatar.name}
                      imgSrc={avatar.imgSrc}
                      handleSelection={handleAvatarSelection}
                      key={avatar.id}
                      hoverImage={avatar.hoverImage}
                      handleHover={handleAvatarHover}
                    />
                  ))}
                </div>
              </div>
              <button
                className="back-button"
                onClick={handleBackToEnvironmentSelection}
              >
                Back
              </button>
            </>
          ) : (
            <div className="env-container">
              <div>
                <TitleSubtitle
                  className="select-environment-title"
                  accentTitle="Choose Your"
                  mainTitle="Environment"
                />
                <div id="environment-cards-container">
                  {environmentCards.map((env) => (
                    <EnvironmentCard
                      name={env.name}
                      imgSrc={env.imgSrc}
                      handleSelection={handleEnvironmentSelection}
                      key={env.id}
                      handleHover={handleEnvironmentHover}
                    />
                  ))}
                </div>
              </div>
              <div className="stage">
                <div className="stage-frame">
                  <div
                    className="stage-image"
                    style={{
                      backgroundImage: selectedEnvironment
                        ? `url(${getEnvironmentImage()})`
                        : 'none',
                    }}
                  >
                    {hoveredImage ? (
                      <img
                        src={hoveredImage}
                        alt="Hovered Environment"
                        className="hovered-image"
                      />
                    ) : selectedEnvironment ? (
                      <p>{selectedEnvironment}</p>
                    ) : (
                      <p>No environment selected</p>
                    )}
                  </div>
                  <img src="/stage.svg" className="stage-img" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="box3-content">
          <div className="bottomRow">
            <div
              className="box3-section cards"
              style={{
                backgroundImage: selectedEnvironment
                  ? `url(${getEnvironmentImage()})`
                  : 'none',
              }}
            >
              {hoveredImage ? (
                <img
                  src={hoveredImage}
                  alt="Hovered Environment"
                  className="hovered-image"
                />
              ) : selectedEnvironment ? (
                <p>{selectedEnvironment}</p>
              ) : (
                <p>No environment selected</p>
              )}
            </div>
            <div
              className="box3-section cards"
              style={{
                backgroundImage: selectedAvatar
                  ? `url(${getAvatarImage()})`
                  : 'none',
              }}
            >
              {hoveredAvatarImage ? (
                <img
                  src={hoveredAvatarImage}
                  alt="Hovered Avatar"
                  className="hovered-image"
                />
              ) : selectedAvatar ? (
                <p>{selectedAvatar}</p>
              ) : (
                <p>No avatar selected</p>
              )}
            </div>

            <div className="box3-section cards">
              <h3>Selected Options</h3>
              {sceneState ? (
                <div>
                  <div>Music: {getMusic() ? 'On' : 'Off'}</div>
                  <div>Sound Effects: {getSFX() ? 'On' : 'Off'}</div>
                  <div>Announcer: {getAnnouncer() ? 'On' : 'Off'}</div>
                </div>
              ) : (
                <p>No options selected</p>
              )}
            </div>
            <div>
              <button
                className="startButton"
                style={{
                  backgroundImage: selectedAvatar
                    ? 'linear-gradient(var(--uvx-accent-color), #af57b1)'
                    : '',
                  backgroundColor: selectedAvatar ? '' : '#ccc',
                }}
                disabled={selectedAvatar === null}
                onClick={() => {
                  setReady(true);
                  runGame();
                }}
              >
                Start Game
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
