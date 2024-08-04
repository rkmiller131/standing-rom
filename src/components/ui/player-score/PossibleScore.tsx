import useHookstateGetters from '../../../interfaces/Hookstate_Interface';

export default function PossibleScore() {
  const { getTotalBubbleCount } = useHookstateGetters();
  const total = getTotalBubbleCount();

  return (
    <div className="score-ui-container">
      <video autoPlay muted loop className="score-bg-video">
        <source src="https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/ScoreBGAnimation.mp4?v=1722725388497" type="video/mp4"/>
      </video>
      <div className="score-content">
        <span className="score-divider">/</span>
        <span className="score-possible">{total} Bubbles Popped</span>
      </div>
    </div>
  )
}