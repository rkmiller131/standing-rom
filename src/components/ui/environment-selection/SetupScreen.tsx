import { useState, useCallback, useRef } from 'react';
import { EnvironmentSelectionType } from '../../../hookstate-store/Types';
import { useSceneState } from '../../../hookstate-store/SceneState';
import { uiInteractions } from '../../../utils/cdn-links/sounds';
import { environmentCards, avatarCards } from '../../../utils/cdn-links/images';
import EnvironmentCard from './EnvironmentCard';
import TitleSubtitle from '../TitleSubtitle';
import AvatarCard from '../avatar-selection/AvatarCard';
import { setupBG } from '../../../utils/cdn-links/motionGraphics';

import '../../../css/SetupScreen.css';

const selectSFX = new Audio(uiInteractions['choiceSelect']);

export default function SetupScreen() {
  const sceneState = useSceneState();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [selectedEnvironment, setSelectedEnvironment] =
    useState<EnvironmentSelectionType | null>(null);
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [hoveredAvatarImage, setHoveredAvatarImage] = useState<string | null>(
    null,
  );
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState({
    music: true,
    soundEffects: true,
    announcer: true,
    overallSound: true,
  });

  const handleEnvironmentSelection = useCallback(
    (environment: EnvironmentSelectionType) => {
      sceneState.selectedEnvironment.set(environment);
      setSelectedEnvironment(environment);
      setHoveredImage(null);
      selectSFX.play();
    },
    [sceneState],
  );

  const handleAvatarSelection = useCallback((avatar: string) => {
    setSelectedAvatar(avatar);
    setHoveredAvatarImage(null);
    selectSFX.play();
  }, []);

  const handleAvatarHover = useCallback((imgSrc: string | null) => {
    setHoveredAvatarImage(imgSrc);
  }, []);

  const handleEnvironmentHover = useCallback((imgSrc: string | null) => {
    setHoveredImage(imgSrc);
  }, []);

  const handleBackToEnvironmentSelection = () => {
    setSelectedEnvironment(null);
    selectSFX.play();
  };

  const handleBackToAvatarSelection = () => {
    setSelectedAvatar(null);
    selectSFX.play();
  };

  const toggleOption = (option: keyof typeof selectedOptions) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [option]: !prevOptions[option],
    }));
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

  return (
    <div id="setup">
      <video
        ref={videoRef}
        className="setup-screen-bg-video"
        autoPlay
        loop
        muted
      >
        <source src={setupBG} type="video/mp4" />
      </video>
      <div className="container">
        <div className="box">
          {selectedAvatar ? (
            <div className="box2-content">
              <TitleSubtitle
                className="select-environment-title"
                accentTitle="Game Settings"
                mainTitle="Options"
              />
              <div id="options-container">
                <div className="option">
                  <label>
                    Music
                    <input
                      type="checkbox"
                      checked={selectedOptions.music}
                      onChange={() => toggleOption('music')}
                    />
                  </label>
                </div>
                <div className="option">
                  <label>
                    Sound Effects
                    <input
                      type="checkbox"
                      checked={selectedOptions.soundEffects}
                      onChange={() => toggleOption('soundEffects')}
                    />
                  </label>
                </div>
                <div className="option">
                  <label>
                    Announcer
                    <input
                      type="checkbox"
                      checked={selectedOptions.announcer}
                      onChange={() => toggleOption('announcer')}
                    />
                  </label>
                </div>
                <div className="option">
                  <label>
                    Overall Sound
                    <input
                      type="checkbox"
                      checked={selectedOptions.overallSound}
                      onChange={() => toggleOption('overallSound')}
                    />
                  </label>
                </div>
              </div>
              <button
                className="back-button"
                onClick={handleBackToAvatarSelection}
              >
                Back
              </button>
            </div>
          ) : selectedEnvironment ? (
            <div className="box2-content">
              <TitleSubtitle
                className="select-environment-title"
                accentTitle="Choose Your"
                mainTitle="Avatar"
              />
              <div id="avatar-cards-container">
                {avatarCards.map((avatar) => (
                  <AvatarCard
                    key={avatar.id}
                    name={avatar.name}
                    imgSrc={avatar.imgSrc}
                    hoverImage={avatar.hoverImage}
                    handleSelection={handleAvatarSelection}
                    handleHover={handleAvatarHover}
                  />
                ))}
              </div>
              <button
                className="back-button"
                onClick={handleBackToEnvironmentSelection}
              >
                Back
              </button>
            </div>
          ) : (
            <div className="box2-content">
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
          )}
        </div>
        <div className="box">
          {}
          {hoveredImage && (
            <img
              src={hoveredImage}
              alt="Hovered Environment"
              className="hovered-image"
            />
          )}
          {hoveredAvatarImage && (
            <img
              src={hoveredAvatarImage}
              alt="Hovered Avatar"
              className="hovered-image"
            />
          )}
        </div>
        <div className="box">
          <div className="box3-content">
            <div
              className="box3-section environment"
              style={{
                backgroundImage: selectedEnvironment
                  ? `url(${getEnvironmentImage()})`
                  : 'none',
              }}
            >
              <h3>Selected Environment</h3>
              {selectedEnvironment ? (
                <p>{selectedEnvironment}</p>
              ) : (
                <p>No environment selected</p>
              )}
            </div>
            <div
              className="box3-section avatar"
              style={{
                backgroundImage: selectedAvatar
                  ? `url(${getAvatarImage()})`
                  : 'none',
              }}
            >
              <h3>Selected Avatar</h3>
              {selectedAvatar ? (
                <p>{selectedAvatar}</p>
              ) : (
                <p>No avatar selected</p>
              )}
            </div>
            <div className="box3-section">
              <h3>Selected Options</h3>
              {selectedOptions ? (
                <ul>
                  <li>Music: {selectedOptions.music ? 'On' : 'Off'}</li>
                  <li>
                    Sound Effects: {selectedOptions.soundEffects ? 'On' : 'Off'}
                  </li>
                  <li>Announcer: {selectedOptions.announcer ? 'On' : 'Off'}</li>
                  <li>
                    Overall Sound: {selectedOptions.overallSound ? 'On' : 'Off'}
                  </li>
                </ul>
              ) : (
                <p>No options selected</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
