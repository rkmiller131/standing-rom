import { Canvas } from '@react-three/fiber';
import PixelRatio from './PixelRatio';
import { Perf } from 'r3f-perf';
// import { OrbitControls } from '@react-three/drei';

interface RendererProps {
  children: React.ReactNode;
}

let webGL2 = false;
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
const isChrome = navigator.userAgent.indexOf('Chrome') > -1;
const isMac = navigator.userAgent.indexOf('Macintosh') > -1;

if (gl) {
  if (
    gl.getParameter(gl.VERSION).slice(0, 9) === 'WebGL 2.0' &&
    !(isChrome && isMac)
  ) {
    webGL2 = true;
  }
} else {
  throw new Error('WebGL is not supported by your browser.');
}

export default function Renderer({ children }: RendererProps) {
  return webGL2 ? (
    <Canvas
      shadows
      camera={{
        position: [
          -0.3737060168782445,
          1.3687468948616854,
          -1.8720478493827206
        ],
        fov: 50,
        near: 0.5,
        far: 75,
        rotation: [
          -2.860051628191954,
          -0.4493997502356422,
          -3.016601731860828
        ],
      }}
      gl={{ powerPreference: 'high-performance' }}
    >
      <PixelRatio />
      <Perf />
      {/* <OrbitControls /> */}
      {children}
    </Canvas>
  ) : (
    <Canvas
      shadows
      camera={{
        position: [
          -0.3737060168782445,
          1.3687468948616854,
          -1.8720478493827206
        ],
        fov: 40,
        near: 0.5,
        far: 75,
        rotation: [
          -2.860051628191954,
          -0.4493997502356422,
          -3.016601731860828
        ],
      }}
      gl={{ powerPreference: 'low-power', antialias: false }}
    >
      <PixelRatio />
      {children}
    </Canvas>
  );
}

// starting camera position for calibration
// camera rotation is  _Euler{isEuler: true, _x: -2.860051628191954, _y: -0.4493997502356422, _z: -3.016601731860828, _order: 'XYZ',…}
// GameLogic.tsx:21 camera position is  _Vector3{x: -0.3737060168782445, y: 1.3687468948616854, z: -1.8720478493827206, _gsap: GSCache2}