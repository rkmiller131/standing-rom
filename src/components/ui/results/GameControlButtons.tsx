import Button from '../../Button';

interface GameControlButtonsProps {
  onRestart: () => void;
  onNextGame: () => void;
}

export default function GameControlButtons({ onRestart, onNextGame }: GameControlButtonsProps) {
  return (
    <>
      <Button content="Try Again" onClick={onRestart} primaryStyle={false} animate={true}/>
      <Button content="Continue" onClick={onNextGame} animate={true}/>
    </>
  );
}
