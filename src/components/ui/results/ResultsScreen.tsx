import useHookstateGetters from '../../../interfaces/Hookstate_Interface';
import calcAverageVelocity from '../../../utils/math/calcAverageVelocity';
import { faTachometerAlt, faDraftingCompass, faChartLine } from '@fortawesome/free-solid-svg-icons';

import '../../../css/ResultsScreen.css';

import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import AchievementItem from './AchievementItem';
import StatItem from './StatItem';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


export const baseBGAnimation = 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/ScoreBGAnimation.mp4?v=1722725388497';

// FAKE DATABASE DATA MOCK - WOULD HAVE A TABLE/COLLECTION FOR ACHIEVEMENTS - A UTIL FUNCTION TODO IN UTILS > HTTP
// fake return value would be something like:
export type AchievementType = {
  title: string;
  description: string;
}
const shoulderROMAchievements: AchievementType[] = [
  {
    title: 'Precision Popper',
    description: 'Pop 95% or more bubbles'
  },
  {
    title: 'Speed Demon',
    description: 'Complete within the time limit'
  },
  {
    title: 'Bubble Burst Bonanza',
    description: 'Pop 10 bubbles in 5 seconds'
  },
]

export default function ResultsScreen() {
  const {
    getMaxRightArmAngle,
    getMaxLeftArmAngle,
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getPoppedVelocities,
    getCurrentStreak,
    gameOver
  } = useHookstateGetters();

  const maxRightArmAngle = getMaxRightArmAngle();
  const maxLeftArmAngle = getMaxLeftArmAngle();
  const popped = getPoppedBubbleCount();
  const totalBubbles = getTotalBubbleCount();

  const avgVelocity = calcAverageVelocity(getPoppedVelocities().slice());
  const percentCompletion = Math.round((popped / totalBubbles) * 100);

  function playerGotAchievement(title: string) {
    let gotAchievement = false;
    if (title === 'Precision Popper') {
      gotAchievement = percentCompletion >= 95;
    }
    if (title === 'Speed Demon') {
      // implement a timing achievement here later.
      gotAchievement = percentCompletion >= 95;
    }
    if (title === 'Bubble Burst Bonanza') {
      // refactor later for maybe max streak?
      gotAchievement = getCurrentStreak() >= 10;
    }
    return gotAchievement;
  }

  const lastFiveResults = [
    { date: '2024-08-08', score: 85 },
    { date: '2024-08-09', score: 78 },
    { date: '2024-08-10', score: 92 },
    { date: '2024-08-11', score: 88 },
    { date: '2024-08-12', score: 95 },
  ];

  const labels = lastFiveResults.map(result => result.date);
  const data = {
    labels,
    datasets: [
      {
        label: 'Scores',
        data: lastFiveResults.map(result => result.score),
        borderColor: 'rgba(68, 243, 182, 1)',
        backgroundColor: 'rgba(68, 243, 182, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };


  let medal;
  if (percentCompletion >= 90) {
    medal = 'goldMedal.png';
  } else if (percentCompletion >= 75) {
    medal = 'silverMedal.webp';
  } else {
    medal = 'bronzeMedal.png';
  }

  const handleSubmit = () => {
    const results = {
      datePlayed: new Date().toISOString().slice(0, 19),
      percentCompletion,
      bubblesPopped: popped,
      avgVelocity: Number(avgVelocity),
      maxLeftAngle: maxLeftArmAngle,
      maxRightAngle: maxRightArmAngle,
      completed: true,
      achievements: {
        precisionPopper: precisionPopperAchieved,
        speedDemon: 100,
        bubbleBurstBonanza: bubbleBurstBonanzaAchieved,
      }
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
    <div id="results-screen">
      <div className="blend-hue" />
      <div className="achievement-container results-ui-box">
        {shoulderROMAchievements.map((award) => {
          const unlocked = playerGotAchievement(award.title);
          return (
            <AchievementItem
              achievement={award}
              achievementUnlocked={unlocked}
              key={award.title}
            />
          )
        })}

      </div>
      <div className="results-summary">
        <div className="badge-data results-ui-box">
          <img src={medal} alt="Medal" className="medal-img" />
          <div className="stats-container">
            <StatItem icon={faTachometerAlt} description="Popping Speed" metric={`${avgVelocity}m/s`}/>
            <StatItem icon={faDraftingCompass} description="Max Right Arm Angle" metric={`${maxRightArmAngle}°`}/>
            <StatItem icon={faDraftingCompass} description="Max Left Arm Angle" metric={`${maxLeftArmAngle}°`}/>
            <StatItem icon={faChartLine} description="Final Score" metric={`${popped}/${totalBubbles}`}/>
          </div>
        </div>
      </div>

        {/* <div className="box-container">
          <div className='congrats-text-bg'>
            <h1 className="congrats-text">Congratulations!</h1>
          </div>
          <div className="box2">
            <div className='badge-container'>
              <div className='badge'>
                <img src={medal} alt="Medal" className="medal-img" />
              </div>
              <div className="stats-container">
                <div className="stat-item">
                  <div className="icon-badge">
                    <FontAwesomeIcon icon={faTachometerAlt} size="1x" />
                  </div>
                  <div className="stat-desc">Average velocity of popped bubbles</div>
                  <p>0.45 m/s</p>
                </div>

                <div className="stat-item">
                  <div className="icon-badge">
                    <FontAwesomeIcon icon={faDraftingCompass} size="1x" />
                  </div>
                  <div className="stat-desc">Maximum right arm angle</div>
                  <p>86°</p>
                </div>

                <div className="stat-item">
                  <div className="icon-badge">
                    <FontAwesomeIcon icon={faDraftingCompass} size="1x" />
                  </div>

                  <div className="stat-desc">Maximum left arm angle</div>
                  <p>82°</p>
                </div>

                <div className="stat-item">
                  <div className="icon-badge">
                    <FontAwesomeIcon icon={faChartLine} size="1x" />
                  </div>
                  <div className="stat-desc">Bubbles popped out of total bubbles</div>
                  <p>20/50</p>
                </div>
              </div>
            </div>
          </div>
          <div className="box-row">
            <div className='stats-text-bg'>
            </div>
            <div className="box4">
              <h1 className='box4-title'>Recent Performance Trends</h1>
              <Line data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
            </div>
          </div>
          <div className="logo-container"></div>
        </div> */}
    </div>
  );
}