import { Canvas } from '@react-three/fiber';
import PixelRatio from './PixelRatio';
import { OrbitControls } from '@react-three/drei';

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
  console.log('~~ Renderer rendered: creating the 3D canvas')
  return webGL2 ? (
    <Canvas
      shadows
      camera={{
        position: [0, 1, 2],
        fov: 50,
        near: 1,
        far: 120,
        rotation: [0, 0, 0],
      }}
      gl={{ powerPreference: 'high-performance' }}
    >
      <PixelRatio />
      <OrbitControls />
      {children}
    </Canvas>
  ) : (
    <Canvas
      shadows
      camera={{
        position: [0, 1, 2.5],
        fov: 40,
        near: 1,
        far: 120,
        rotation: [0, 0, 0],
      }}
      gl={{ powerPreference: 'low-power', antialias: false }}
    >
      <PixelRatio />
      {children}
    </Canvas>
  );
}
