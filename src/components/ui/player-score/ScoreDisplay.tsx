/* eslint-disable react-hooks/exhaustive-deps */
import BubbleAnimation from './BubbleAnimation';
import PoppedScore from './PoppedScore';
import PossibleScore from './PossibleScore';

import '../../../css/ScoreDisplay.css';

export default function ScoreDisplay() {
  return (
    <div id="score-ui-bar">
      <BubbleAnimation />
      <PoppedScore />
      <PossibleScore />
    </div>
  );
}
