import useHookstateGetters from '../../../interfaces/Hookstate_Interface';
import AchievementItem from './AchievementItem';
import GameControlButtons from './GameControlButtons';
import calcAverageVelocity from '../../../utils/math/calcAverageVelocity';
import { badgesIcons } from '../../../utils/cdn-links/images';
import { announcer } from '../../../utils/cdn-links/sounds';
import { useEffect, useRef } from 'react';

import '../../../css/ResultsScreen.css';
import { sendResults, GameData } from '../../../utils/http/httpSendGameData';
import { PersonStanding, Zap } from 'lucide-react';

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
// only using two for rendering. third is current game.
const lastResults = [
  { date: '2024-08-09', score: 78 },
  { date: '2024-08-10', score: 92 },
];

export default function ResultsScreen() {
  const {
    getMaxRightArmAngle,
    getMaxLeftArmAngle,
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getPoppedVelocities,
    getCurrentStreak,
    getAnnouncer,
    getRoomCode,
    getGameID,
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
    audio = new Audio(announcer['goodScore']); // need a new bad score option ("it's ok..." got vetoed) g
  }
  audio.volume = 0.75;

  useEffect(() => {
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    const bar3 = document.getElementById('bar3');

    if (bar1 && bar2 && bar3) {
      bar1.style.height = `${lastResults[0].score}%`;
      bar1.textContent = `${lastResults[0].score}`;

      bar2.style.height = `${lastResults[1].score}%`;
      bar2.textContent = `${lastResults[1].score}`;

      bar3.style.height = `${percentCompletion}%`;
      bar3.textContent = `${percentCompletion}`;
    }

    if (getAnnouncer()) {
      audio.play();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSubmit = async () => {
    const roomCode = getRoomCode();
    const gameID = getGameID();

    const results: GameData = {
      code: roomCode,
      results: {
        bubblesPopped: popped,
        rightAvgVelocity: parseFloat(avgRightVelocity),
        leftAvgVelocity: parseFloat(avgLeftVelocity),
        maxLeftAngle: maxLeftArmAngle,
        maxRightAngle: maxRightArmAngle,
      },
      _id: gameID,
    };

    try {
      const result = await sendResults(results);
      console.log('Game data sent successfully:', result);
    } catch (error) {
      console.error('Failed to send game data:', error);
    }

    console.log('Success! Navigating...');
    // setTimeout(() => {}, 3000);
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
      <div className="blend-hue" />
      <div className="back-box">
        <div className="back-box-content">
          <div className="box left-box">
            <h2 className="achievements-title">Achievements</h2>
            {shoulderROMAchievements.map((award) => {
              const unlocked = playerGotAchievement(award.title);
              return (
                <>
                  <div className={`ac-container frosted-glass ${unlocked && 'completed'}`}>
                    <AchievementItem
                      achievement={award}
                      achievementUnlocked={unlocked}
                      key={award.title}
                    />
                  </div>
                  <br></br>
                </>
              );
            })}
          </div>
          <div className="box center-box">
            <div className="center-box-header">
              <img
                src={awardMedal.current}
                alt="Medal"
                className="header-medal"
              />

              <div className="header-title">Results</div>
              <div className="header-score">
                Score:
                <div>
                  {popped} / {totalBubbles}
                </div>
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
                <div
                  style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '-10px',
                    backgroundColor: 'black',
                    borderRadius: '32px',
                    width: '32px',
                    height: '32px',
                  }}
                >
                  <PersonStanding
                    size={24}
                    color="white"
                    style={{ marginLeft: '0.25rem', marginTop: '0.25rem' }}
                  />
                </div>
                <span>{maxLeftArmAngle}&deg;</span>
              </div>
            </div>

            <div className="data-point right-shoulder">
              <div className="data-title">Max ROM Right</div>
              <div className="data-value frosted-glass">
                <div
                  style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '-10px',
                    backgroundColor: 'black',
                    borderRadius: '32px',
                    width: '32px',
                    height: '32px',
                  }}
                >
                  <PersonStanding
                    size={24}
                    color="white"
                    style={{ marginLeft: '0.25rem', marginTop: '0.25rem' }}
                  />
                </div>
                <span>{maxRightArmAngle}&deg;</span>
              </div>
            </div>

            <div className="data-point left-wrist">
              <div className="data-title">Popping Speed Left</div>
              <div className="data-value frosted-glass">
                <div
                  style={{
                    position: 'absolute',
                    right: '-8px',
                    top: '-10px',
                    backgroundColor: 'black',
                    borderRadius: '32px',
                    width: '32px',
                    height: '32px',
                  }}
                >
                  <Zap
                    size={18}
                    fill="white"
                    color="white"
                    style={{ marginLeft: '0.4rem', marginBottom: '0.1rem' }}
                  />
                </div>
                <span>{avgLeftVelocity}m/s</span>
              </div>
            </div>

            <div className="data-point right-wrist">
              <div className="data-title">Popping Speed Right</div>
              <div className="data-value frosted-glass">
                <div
                  style={{
                    position: 'absolute',
                    left: '-8px',
                    top: '-10px',
                    backgroundColor: 'black',
                    borderRadius: '32px',
                    width: '32px',
                    height: '32px',
                  }}
                >
                  <Zap
                    size={18}
                    fill="white"
                    color="white"
                    style={{ marginLeft: '0.4rem', marginBottom: '0.1rem' }}
                  />
                </div>
                <span>{avgRightVelocity}m/s</span>
              </div>
            </div>
          </div>
          <div className="box right-box">
            <div className="chart-container">
              <div className="bar" id="bar1"></div>
              <div className="bar" id="bar2"></div>
              <div className="bar" id="bar3"></div>
            </div>
            <div className="chart-btmn">
              <div className="chart-ctnr">
                <div className="chart-ctnr-title">Third Time</div>
                <div className="chart-ctnr-title">Last Time</div>
                <div className="chart-ctnr-title">This Time</div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-box">
          <GameControlButtons
            onRestart={handleReplay}
            onNextGame={handleSubmit}
          />
        </div>
      </div>

    </div>
  );
}
