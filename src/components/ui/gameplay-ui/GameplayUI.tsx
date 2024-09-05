import TopBar from './top-bar/TopBar';
import { VRM } from '../../../interfaces/THREE_Interface';
import LiveSpectators from './LiveSpectators';
import ProgressBar from './ProgressBar';

import '../../../css/GameplayUI.css';

interface GameplayUIProps {
  avatar: React.RefObject<VRM>;
}

export default function GameplayUI({ avatar }: GameplayUIProps) {
  return (
    <div id="in-game-ui">
      <TopBar avatar={avatar}/>
      <LiveSpectators />
      <ProgressBar />
    </div>
  )
}