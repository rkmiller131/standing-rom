import { useEffect, useState } from 'react';
import calcArmAngles from '../math/calcArmAngles';
import { VRM } from '@pixiv/three-vrm';

import '../../css/ViewScreen.css';

interface ProProps {
  avatar: React.RefObject<VRM>;
}

export default function Protractor({ avatar }: ProProps) {
  const [la, setLa] = useState(0);
  const [ra, setRa] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { leftArmAngle, rightArmAngle } = calcArmAngles(avatar);

      setLa(leftArmAngle);
      setRa(rightArmAngle);
    }, 500);

    return () => clearInterval(intervalId);
  }, [avatar]);

  return (
    <>
      <div>
        <p className="vbt">Right: {ra} °</p>
        <p className="vbt">Left: {la} °</p>
      </div>
    </>
  );
}
