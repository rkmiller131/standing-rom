import Button from '../../Button';

import '../../../css/Button.css';
import { uvxLogos } from '../../../utils/cdn-links/images';

interface GameControlButtonsProps {
  onRestart: () => void;
  onNextGame: () => void;
}

export default function GameControlButtons({
  onRestart,
  onNextGame,
}: GameControlButtonsProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
      }}
    >
      <Button
        content="Try Again"
        onClick={onRestart}
        buttonStyle="secondary"
        animate={true}
      />
      <img
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '0.6rem',
          maxHeight: '3rem',
        }}
        src={uvxLogos.uvxWhite}
      />
      <Button content="Continue" onClick={onNextGame} animate={true} />
    </div>
  );
}
