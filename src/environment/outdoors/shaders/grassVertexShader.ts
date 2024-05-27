// glsl
export const grassVertexShader = `
    uniform float uTime;

    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vNormal;

    float wave(float waveSize, float tipDistance, float centerDistance) {
      // Tip is the fifth vertex drawn per blade
      bool isTip = (gl_VertexID + 1) % 5 == 0;

      float waveDistance = isTip ? tipDistance : centerDistance;
      return sin((uTime / 300.0) + waveSize) * waveDistance;
    }

    void main() {
      vPosition = position;
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);

      vPosition.x += wave(uv.x * 1.01, 0.1, 0.05); 

      gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
    }
`;
