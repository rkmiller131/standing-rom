import useHookstateGetters from '../../interfaces/Hookstate_Interface';
import calcAverageVelocity from '../../utils/math/calcAverageVelocity';

import '../../css/ResultsScreen.css';

export default function ResultsScreen() {
  const {
    getMaxRightArmAngle,
    getMaxLeftArmAngle,
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getPoppedVelocities
  } = useHookstateGetters();

  const maxRightArmAngle = getMaxRightArmAngle();
  const maxLeftArmAngle = getMaxLeftArmAngle();
  const popped = getPoppedBubbleCount();
  const totalBubbles = getTotalBubbleCount();

  const avgVelocity = calcAverageVelocity(getPoppedVelocities().slice());
  const percentCompletion = Math.round((popped / totalBubbles) * 100);

  const handleSubmit = () => {
    const results = {
      datePlayed: new Date().toISOString().slice(0, 19),
      percentCompletion,
      bubblesPopped: popped,
      avgVelocity: Number(avgVelocity),
      maxLeftAngle: maxLeftArmAngle,
      maxRightAngle: maxRightArmAngle,
      completed: true
    };

    console.log('results have been sent! ', results);
    window.location.href = 'https://www.ubiquityvx.com/';
  };

  const handleReplay = async () => {
    await caches.keys().then((names) => {
      return Promise.all(names.map((name) => {
        return caches.delete(name);
      }));
    });

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <>
      <div className="results-screen">
        <div className="blendHue" />
        <div className="results-data-container">
          <h1>Congratulations!</h1>

          <div className="results-data">
            <div className="results-data-item">
              <span>AVERAGE POPPING VELOCITY:</span>
              <span className="results-data-metric">{`${avgVelocity}m/s`}</span>
            </div>
            <div className="results-data-item">
              <span>MAX RIGHT ARM ANGLE:</span>
              <span className="results-data-metric">{`${maxRightArmAngle}°`}</span>
            </div>
            <div className="results-data-item">
              <span>MAX LEFT ARM ANGLE:</span>
              <span className="results-data-metric">{`${maxLeftArmAngle}°`}</span>
            </div>
            <div className="results-data-item">
              <div>FINAL</div>
              <div>SCORE:</div>
              <div className="results-data-metric">{`${popped}/${totalBubbles}`}</div>
            </div>
          </div>

          <div className="achievements-container">
            <div className="achievement">
              <div className="achievement-icon">🏅</div>
              <div className="achievement-value">Bronze Medal</div>
            </div>
            <div className="achievement">
              <div className="achievement-icon">🏅</div>
              <div className="achievement-value">Silver Medal</div>
            </div>
            <div className="achievement">
              <div className="achievement-icon">🏅</div>
              <div className="achievement-value">Gold Medal</div>
            </div>
          </div>

          <div className="xp-bar">
            <div className="xp-progress" style={{ width: '70%' }}></div>
            <div className="xp-label">AWARD +20 XP</div>
            <div className="xp-levels">
              <span>3<sup>LVL</sup></span>
              <span>4<sup>LVL</sup></span>
            </div>
          </div>

          <div className="results-button-container">
            <button onClick={handleReplay}>REPLAY</button>
            <button onClick={handleSubmit}>LEAVE</button>
          </div>
        </div>
      </div>
    </>
  );
}
