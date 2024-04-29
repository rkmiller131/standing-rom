import { Canvas } from '@react-three/fiber'
import PixelRatio from './PixelRatio'
import { useState } from 'react'
import { WebGLRenderer } from '../THREE_Interface'

interface RendererProps {
    children: React.ReactNode
}

export default function Renderer({ children }: RendererProps) {
    const [gl, setGL] = useState(new WebGLRenderer({ antialias: true }));

    return (
        <Canvas
          shadows
          dpr={[1, 1.5]}
          camera={{
            position: [0, 1, 2],
            fov: 50,
            near: 1,
            far: 20,
            rotation: [0, 0, 0],
          }}
        //   gl={gl}
        >
            <PixelRatio setGL={setGL}/>
            {children}
        </Canvas>
    )
}