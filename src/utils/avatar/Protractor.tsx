import { useEffect, useState } from 'react';
import calcArmAngles from '../math/calcArmAngles';
import { VRM } from '@pixiv/three-vrm';

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

      console.log(leftArmAngle, rightArmAngle);
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div>
        <p style={{ color: 'white' }}>Right: {ra} °</p>
        <p style={{ color: 'white' }}>Left: {la} °</p>
      </div>
    </>
  );
}
