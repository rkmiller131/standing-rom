import { LayerMaterial, Depth, Fresnel } from 'lamina/vanilla';
import { Mesh, SphereGeometry } from 'three';

export default function createActiveBubble(): Mesh {
    const geometry = new SphereGeometry(0.05, 8, 8);
    const material = new LayerMaterial({
      color: '#ffffff',
      lighting: 'physical',
      transmission: 1,
      roughness: 0.1,
      thickness: 2,
      layers: [
        new Depth({
          near: 0.4854,
          far: 0.7661999999999932,
          origin: [-0.4920000000000004, 0.4250000000000003, 0],
          colorA: '#fec5da',
          colorB: '#00b8fe'
        }),
        new Fresnel({
          color: '#fefefe',
          bias: -0.3430000000000002,
          intensity: 3.8999999999999946,
          power: 3.3699999999999903,
          factor: 1.119999999999999,
          mode: 'screen'
        })
      ]
    });

    const mesh = new Mesh(geometry, material);
    return mesh;
}