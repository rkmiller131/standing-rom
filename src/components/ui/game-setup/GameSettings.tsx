import { useEffect } from 'react';
import { GameConfigurationSettings, SoundConfig } from './GameSetupScreen'

interface GameSettingsProps {
  gameSettings: GameConfigurationSettings;
  updateGameSettings: (key: string, value: SoundConfig) => void;
}

export default function GameSettings({ gameSettings, updateGameSettings }: GameSettingsProps) {
  const handleChange = (key: string, value: boolean) => {
    if (key === 'muteAllSound' && value === true) {
      updateGameSettings('Sound', {
        muteAllSound: true,
        announcer: false,
        music: false,
        sfx: false,
        ready: false
      })
    } else if (key === 'muteAllSound' && value === false) {
      updateGameSettings('Sound', {
        muteAllSound: false,
        announcer: true,
        music: true,
        sfx: true,
        ready: false
      })
    } else {
      updateGameSettings('Sound', {...gameSettings.sound, [key]: value})
    }
  }

  useEffect(() => {
    const { announcer, music, sfx, muteAllSound } = gameSettings.sound;
    // if the user manually unchecks all the sound, toggle muteAllSound
    if (announcer === false && music === false && sfx === false && muteAllSound === false) {
      updateGameSettings('Sound', {
        muteAllSound: true,
        announcer: false,
        music: false,
        sfx: false,
        ready: false
      })
    }
    // if muteAllSound is true but the user presses anything else, toggle false
    if (muteAllSound === true && (announcer === true || music === true || sfx === true)) {
      updateGameSettings('Sound', {
        muteAllSound: false,
        announcer: announcer,
        music: music,
        sfx: sfx,
        ready: false
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSettings.sound])

  return (
    <form>
      <div className="sound-setting">
        <label htmlFor="mute-all-sound">Mute All Sound</label>
        <input
          type="checkbox"
          id="mute-all-sound"
          checked={gameSettings.sound.muteAllSound}
          onChange={() => handleChange('muteAllSound', !gameSettings.sound.muteAllSound)}
        />
      </div>
      <div className="sound-setting">
        <label htmlFor="announcer-voice">Announcer Voice</label>
        <input
          type="checkbox"
          id="announcer-voice"
          checked={gameSettings.sound.announcer}
          onChange={() => handleChange('announcer', !gameSettings.sound.announcer)}
        />
      </div>
      <div className="sound-setting">
        <label htmlFor="music">Music</label>
        <input
          type="checkbox"
          id="music"
          checked={gameSettings.sound.music}
          onChange={() => handleChange('music', !gameSettings.sound.music)}
        />
      </div>
      <div className="sound-setting">
        <label htmlFor="sfx">Sound Effects</label>
        <input
          type="checkbox"
          id="sfx"
          checked={gameSettings.sound.sfx}
          onChange={() => handleChange('sfx', !gameSettings.sound.sfx)}
        />
      </div>
    </form>
  )
}