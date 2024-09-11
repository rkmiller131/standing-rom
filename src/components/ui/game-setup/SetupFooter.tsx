import { GameConfigurationSettings } from './GameSetupScreen';
import Button from '../../Button';

interface SetupFooterProps {
  gameSettings: GameConfigurationSettings;
  clickHandler: () => void;
}

export default function SetupFooter({ gameSettings, clickHandler }: SetupFooterProps) {
  const defaultSound =
    gameSettings.sound.muteAllSound === false &&
    gameSettings.sound.announcer === true &&
    gameSettings.sound.music === true &&
    gameSettings.sound.sfx === true;

  return (
    <div className="game-setup-footer">
      <div className="selection-slots-container">
        <div className="selection-slot">
          <span>Environment</span>
          <div className="selection-slot-image-wrapper frosted-glass">
            <img src={gameSettings.environment.splash} />
          </div>
        </div>
        <div className="selection-slot">
          <span>Avatar</span>
          <div className="selection-slot-image-wrapper frosted-glass">
          <img src={gameSettings.avatar.splash} />
          </div>
        </div>
        <div className="selection-slot">
          <span>Settings</span>
          <div className="selection-slot-image-wrapper frosted-glass">
            {!gameSettings.avatar.splash ? '' : defaultSound ? 'Default' : 'Custom'}
          </div>
        </div>
      </div>
      <Button
        content="Let's Play!"
        onClick={clickHandler}
        buttonStyle={gameSettings.avatar.splash ? 'primary' : 'disabled'}
      />
    </div>
  )
}