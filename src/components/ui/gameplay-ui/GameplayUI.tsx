import TopBar from './top-bar/TopBar';
import { VRM } from '../../../interfaces/THREE_Interface';
import LiveSpectators from './LiveSpectators';
import ProgressBar from './ProgressBar';
import useHookstateGetters from '../../../interfaces/Hookstate_Interface';

import '../../../css/GameplayUI.css';

interface GameplayUIProps {
  avatar: React.RefObject<VRM>;
}

export default function GameplayUI({ avatar }: GameplayUIProps) {
  const { sceneLoaded } = useHookstateGetters();
  return (
    <div id="in-game-ui">
      <TopBar avatar={avatar}/>
      <LiveSpectators />
      {sceneLoaded() && <ProgressBar />}
    </div>
  )
}