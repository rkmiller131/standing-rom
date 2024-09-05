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

import '../../../css/ResultsScreen.css';

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
  } else if (getAnnouncer() === false) {
    audio.pause();
  } else {
    audio.play();
  }

  const handleSubmit = () => {
    const results = {
      datePlayed: new Date().toISOString().slice(0, 19),
      percentCompletion,
      bubblesPopped: popped,
      RightAvgVelocity: avgRightVelocity,
      LeftAvgVelocity: avgLeftVelocity,
      maxLeftAngle: maxLeftArmAngle,
      maxRightAngle: maxRightArmAngle,
      completed: true,
      achievements: {
        precisionPopper: playerGotAchievement('Precision Popper'),
        speedDemon: playerGotAchievement('Speed Demon'),
        bubbleBurstBonanza: playerGotAchievement('Bubble Burst Bonanza'),
      },
    };

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
          );
        })}
      </div>
      <div className="results-summary">
        <div className="badge-data results-ui-box">
          <img src={awardMedal.current} alt="Medal" className="medal-img" />
          <div className="stats-container">
            <StatItem
              icon={faTachometerAlt}
              description="Popping Speed Right"
              metric={`${avgRightVelocity}m/s`}
            />
            <StatItem
              icon={faTachometerAlt}
              description="Popping Speed Left"
              metric={`${avgLeftVelocity}m/s`}
            />
            <StatItem
              icon={faDraftingCompass}
              description="Max Right Arm Angle"
              metric={`${maxRightArmAngle}°`}
            />
            <StatItem
              icon={faDraftingCompass}
              description="Max Left Arm Angle"
              metric={`${maxLeftArmAngle}°`}
            />
            <StatItem
              icon={faChartLine}
              description="Final Score"
              metric={`${popped}/${totalBubbles}`}
            />
          </div>
        </div>
        <div className="results-graph-container results-ui-box">
          <Line
            data={data}
            options={{
              responsive: true,
              plugins: { legend: { display: false } },
            }}
          />
        </div>
        <div className="gameplay-buttons">
          <GameControlButtons
            onRestart={handleReplay}
            onNextGame={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
