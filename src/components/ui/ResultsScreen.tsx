import useHookstateGetters from '../../interfaces/Hookstate_Interface';

import '../../css/ResultsScreen.css';

export default function ResultsScreen() {
  const {
    getMaxRightArmAngle,
    getMaxLeftArmAngle,
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getPoppedVelocities,
  } = useHookstateGetters();

  const maxRightArmAngle = getMaxRightArmAngle();
  const maxLeftArmAngle = getMaxLeftArmAngle();
  const popped = getPoppedBubbleCount();
  const totalBubbles = getTotalBubbleCount();

  const velArray = getPoppedVelocities().slice(-2);

  const percentCompletion = Math.round((popped / totalBubbles) * 100);

  const handleSubmit = () => {
    const results = {
      datePlayed: new Date().toISOString().slice(0, 19),
      percentCompletion,
      bubblesPopped: popped,
      avgLeftVelocity: velArray[0],
      avgRightVelocity: velArray[1],
      maxLeftAngle: maxLeftArmAngle,
      maxRightAngle: maxRightArmAngle,
      completed: true,
    };

    // For now, just console logging results.
    // Submit to the backend, then redirect to the next game or the uvx dashboard
    console.log('results have been sent! ', results);
    window.location.href = 'https://www.ubiquityvx.com/';
  };

  const handleReplay = async () => {
    await caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          return caches.delete(name);
        }),
      );
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
          <h2>Congratulations!</h2>

          <div className="results-data">
            <div className="results-data-item">
              <span>RIGHT VELOCITY</span>
              <span className="results-data-metric">{`${velArray[0].toFixed(1)}m/s`}</span>
            </div>
            <div className="results-data-item">
              <span>LEFT VELOCITY</span>
              <span className="results-data-metric">{`${velArray[1].toFixed(1)}m/s`}</span>
            </div>
            <div className="results-data-item">
              <span>MAX RIGHT ARM ANGLE</span>
              <span className="results-data-metric">{`${maxRightArmAngle}°`}</span>
            </div>
            <div className="results-data-item">
              <span>MAX LEFT ARM ANGLE</span>
              <span className="results-data-metric">{`${maxLeftArmAngle}°`}</span>
            </div>
            <div className="results-data-item">
              <span>FINAL SCORE</span>
              <span className="results-data-metric">{`${popped}/${totalBubbles}`}</span>
            </div>
          </div>
          {/* make sure these buttons are only available to the patient to press */}
          <div className="results-button-container">
            <button onClick={handleReplay}>Try Again</button>
            <button onClick={handleSubmit}>Submit Results</button>
          </div>
        </div>
      </div>
    </>
  );
}
