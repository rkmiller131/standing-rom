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
        sfx: false
      })
    } else if (key === 'muteAllSound' && value === false) {
      updateGameSettings('Sound', {
        muteAllSound: false,
        announcer: true,
        music: true,
        sfx: true
      })
    } else {
      updateGameSettings('Sound', {...gameSettings.sound, [key]: value})
    }
  }

  useEffect(() => {
    const settings = gameSettings.sound;
    if (settings.announcer === false && settings.music === false && settings.sfx === false && settings.muteAllSound === false) {
      updateGameSettings('Sound', {
        muteAllSound: true,
        announcer: false,
        music: false,
        sfx: false
      })
    }
    if (settings.muteAllSound === true && (settings.announcer === true || settings.music === true || settings.sfx === true)) {
      updateGameSettings('Sound', {
        muteAllSound: false,
        announcer: settings.announcer,
        music: settings.music,
        sfx: settings.sfx
      })
    }
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