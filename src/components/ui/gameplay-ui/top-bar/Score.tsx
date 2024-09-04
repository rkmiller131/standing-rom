import { useEffect, useState } from 'react';
import useHookstateGetters from '../../../../interfaces/Hookstate_Interface';
import { VRM } from '../../../../interfaces/THREE_Interface';
import calcArmAngles from '../../../../utils/math/calcArmAngles';

interface ScoreProps {
  avatar: React.RefObject<VRM>;
}

export default function Score ({ avatar }: ScoreProps) {
  const {
    getPoppedBubbleCount,
    getCurrentStreak,
    getTotalBubbleCount
  } = useHookstateGetters();
  const popped = getPoppedBubbleCount();
  const total = getTotalBubbleCount();
  const currentStreak = getCurrentStreak();
  const [streaking, setStreaking] = useState(false);
  const [leftArm, setLeftArm] = useState(0);
  const [rightArm, setRightArm] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { leftArmAngle, rightArmAngle } = calcArmAngles(avatar);

      setLeftArm(leftArmAngle);
      setRightArm(rightArmAngle);
    }, 300);

    return () => clearInterval(intervalId);
  }, [avatar]);

  useEffect(() => {
    if (currentStreak >= 5) {
      setStreaking(true);
    } else {
      setStreaking(false);
    }
  }, [currentStreak])

  return (
    <div className="gameplay-ui-score-container">
      <div className={`player-score ${streaking ? 'streaking-score': 'frosted-glass'}`}>
        <span className="player-score-content">{`${popped} / ${total}`}</span>
      </div>
      <div className="angle-readout-container">
        <div className="angle-readout-item">
          <span>Left ROM</span>
          <span className="angle-measure">
            {leftArm}
          </span>
        </div>
        <div className="angle-readout-item">
          <span>Right ROM</span>
          <span className="angle-measure">
            {rightArm}
          </span>
        </div>
      </div>
    </div>
  )
}

// import { useEffect, useState } from 'react';
// import calcArmAngles from '../math/calcArmAngles';
// import { VRM } from '@pixiv/three-vrm';

// import '../../css/ViewScreen.css';

// interface ProProps {
//   avatar: React.RefObject<VRM>;
// }

// export default function Protractor({ avatar }: ProProps) {
//   const [la, setLa] = useState(0);
//   const [ra, setRa] = useState(0);

  // useEffect(() => {
  //   const intervalId = setInterval(() => {
  //     const { leftArmAngle, rightArmAngle } = calcArmAngles(avatar);

  //     setLa(leftArmAngle);
  //     setRa(rightArmAngle);
  //   }, 500);

  //   return () => clearInterval(intervalId);
  // }, [avatar]);

//   return (
//     <>
//       <div>
//         <p className="vbt">Right: {ra} °</p>
//         <p className="vbt">Left: {la} °</p>
//       </div>
//     </>
//   );
// }