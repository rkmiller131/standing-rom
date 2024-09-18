import useHookstateGetters from '../../../interfaces/Hookstate_Interface';
import {
  faTachometerAlt,
  faDraftingCompass,
  faChartLine,
} from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import AchievementItem from './AchievementItem';
import StatItem from './StatItem';
import GameControlButtons from './GameControlButtons';
import calcAverageVelocity from '../../../utils/math/calcAverageVelocity';
import { badgesIcons } from '../../../utils/cdn-links/images';
import { announcer } from '../../../utils/cdn-links/sounds';
import { useRef } from 'react';
import { uvxLogos } from '../../../utils/cdn-links/images';

import '../../../css/ResultsScreen.css';
import { sendResults, GameData } from '../../../utils/http/httpSendGameData';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
);

// FAKE DATABASE DATA MOCK - WOULD HAVE A TABLE/COLLECTION FOR ACHIEVEMENTS - A UTIL FUNCTION TODO IN UTILS > HTTP
// fake return value would be something like:
export type AchievementType = {
  title: string;
  description: string;
};
const shoulderROMAchievements: AchievementType[] = [
  {
    title: 'Precision Popper',
    description: 'Pop 95% or more bubbles',
  },
  {
    title: 'Speed Demon',
    description: 'Complete within the time limit',
  },
  {
    title: 'Bubble Burst Bonanza',
    description: 'Pop 10 bubbles in 5 seconds',
  },
];

// THIS WOULD ALSO BE RETRIEVED FROM DB AND SET UP IN ITS OWN GRAPH COMPONENT (Separate Line graph into own file, do an http get and create the graph)
const lastFiveResults = [
  { date: '2024-08-08', score: 85 },
  { date: '2024-08-09', score: 78 },
  { date: '2024-08-10', score: 92 },
  { date: '2024-08-11', score: 88 },
  { date: '2024-08-12', score: 95 },
];

const labels = lastFiveResults.map((result) => result.date);
const data = {
  labels,
  datasets: [
    {
      label: 'Scores',
      data: lastFiveResults.map((result) => result.score),
      borderColor: 'rgba(68, 243, 182, 1)',
      backgroundColor: 'rgba(68, 243, 182, 0.2)',
      fill: true,
      tension: 0.4,
    },
  ],
};

export default function ResultsScreen() {
  const {
    getMaxRightArmAngle,
    getMaxLeftArmAngle,
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getPoppedVelocities,
    getCurrentStreak,
    getAnnouncer,
  } = useHookstateGetters();
  const awardMedal = useRef('');

  const maxRightArmAngle = getMaxRightArmAngle();
  const maxLeftArmAngle = getMaxLeftArmAngle();
  const popped = getPoppedBubbleCount();
  const totalBubbles = getTotalBubbleCount();

  const { right, left } = getPoppedVelocities();
  const avgRightVelocity = calcAverageVelocity(right as number[]).avg;
  const avgLeftVelocity = calcAverageVelocity(left as number[]).avg;

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

  let audio;
  if (percentCompletion === 100) {
    audio = new Audio(announcer['perfectScore']);
    awardMedal.current = badgesIcons.goldMedal;
  } else if (percentCompletion >= 90) {
    awardMedal.current = badgesIcons.goldMedal;
    audio = new Audio(announcer['greatScore']);
  } else if (percentCompletion >= 75) {
    awardMedal.current = badgesIcons.silverMedal;
    audio = new Audio(announcer['goodScore']);
  } else {
    awardMedal.current = badgesIcons.bronzeMedal;
    audio = new Audio(announcer['goodScore']); // need a new bad score option ("it's ok..." got vetoed)
  }
  audio.volume = 0.75;

  if (getAnnouncer()) {
    audio.play();
  }

  const handleSubmit = async () => {
    const results: GameData = {
      datePlayed: new Date().toISOString().slice(0, 19),
      percentCompletion,
      bubblesPopped: popped,
      rightAvgVelocity: avgRightVelocity,
      leftAvgVelocity: avgLeftVelocity,
      maxLeftAngle: maxLeftArmAngle,
      maxRightAngle: maxRightArmAngle,
      completed: true,
      achievements: {
        precisionPopper: playerGotAchievement('Precision Popper'),
        speedDemon: playerGotAchievement('Speed Demon'),
        bubbleBurstBonanza: playerGotAchievement('Bubble Burst Bonanza'),
      },
    };

    try {
      const result = await sendResults(results);
      console.log('Game data sent successfully:', result);
    } catch (error) {
      console.error('Failed to send game data:', error);
    }

    console.log('Success! Navigating...');
    // window.location.href = 'https://www.ubiquityvx.com/';
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
    <div id="overlay-screen">
      <div className="back-box"></div>
      <div className="middle-section">
      <div className="box left-box">
          <div className="achievements">
            <h2 className="achievements-title">Achievements</h2>
            
            <div className="achievement completed">
              <img src="/icons/check-icon.svg" alt="Check Icon" className="achievement-icon" />
              <div className="achievement-info">
                <div className="achievement-title">Bubble Burst Bonanza</div>
                <div className="achievement-description">Pop 10 bubbles in 5 seconds</div>
              </div>
            </div>

            <div className="achievement">
              <img src="/icons/incomplete-icon.svg" alt="Incomplete Icon" className="achievement-icon" />
              <div className="achievement-info">
                <div className="achievement-title">Speed Demon</div>
                <div className="achievement-description">Pop all bubbles in the time limit</div>
              </div>
            </div>

            <div className="achievement">
              <img src="/icons/incomplete-icon.svg" alt="Incomplete Icon" className="achievement-icon" />
              <div className="achievement-info">
                <div className="achievement-title">Precision Popper</div>
                <div className="achievement-description">Pop 95% or more bubbles</div>
              </div>
            </div>
          </div>
        </div>
        <div className="box center-box">
          <div className="center-box-header">
            <img
              src={badgesIcons.goldMedal}
              alt="Gold Medal"
              className="header-medal"
            />
            <div className="header-title">Results</div>
            <div className="header-score">
              Score: <span>35/50</span>
            </div>
          </div>

          <img
            className="person-silhouette"
            src="/human.png"
            alt="Person Silhouette"
          />

          <div className="data-point left-shoulder">
            <div className="data-title">Max ROM Left</div>
            <div className="data-value frosted-glass">
              <span>143°</span>
            </div>
          </div>

          <div className="data-point right-shoulder">
            <div className="data-title">Max ROM Right</div>
            <div className="data-value frosted-glass">
              <span>97°</span>
            </div>
          </div>

          <div className="data-point left-wrist">
            <div className="data-title">Popping Speed Left</div>
            <div className="data-value frosted-glass">
              <span>0.93 m/s</span>
            </div>
          </div>

          <div className="data-point right-wrist">
            <div className="data-title">Popping Speed Right</div>
            <div className="data-value frosted-glass">
              <span>0.56 m/s</span>
            </div>
          </div>
        </div>
        <div className="box right-box"></div>
      </div>
      <div className="footer-box">
        <button className="footer-button left-button">Left Button</button>
        <img className="footer-logo" src={uvxLogos.uvxWhite} alt="Logo" />
        <button className="footer-button right-button">Right Button</button>
      </div>
    </div>
  );
}
