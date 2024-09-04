import TopBar from './top-bar/TopBar';

import '../../../css/GameplayUI.css';

export default function GameplayUI () {
  return (
    <div id="in-game-ui">
      <TopBar />
      <div>Progress Bar</div>
    </div>
  )
}