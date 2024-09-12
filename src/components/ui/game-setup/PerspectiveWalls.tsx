import { baseBGAnimation } from '../../../utils/cdn-links/motionGraphics';

import '../../../css/PerspectiveWalls.css';

export default function PerspectiveWalls({ splashImage }: { splashImage: string }) {
  return (
    <div className="perspective-walls">
      <div className="perspective-wall-left"></div>
      <div className="perspective-wall-center">
        <video autoPlay loop muted>
          <source src={baseBGAnimation} type="video/mp4" />
        </video>
      </div>
      <div
        className="perspective-wall-right"
      >
        {splashImage &&
          <div
            style={{
              backgroundImage: `url(${splashImage})`,
              width: '100%',
              height: '100%',
              maskImage: 'linear-gradient(to left, rgba(0, 0, 0, 1) 25%, transparent 90%)',
              backgroundSize: 'cover',
              filter: 'brightness(1.4) blur(4px)'
            }}
          />
        }
      </div>
    </div>
  );
}