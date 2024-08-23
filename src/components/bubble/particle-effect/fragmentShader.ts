export const fragmentShader = `
uniform float uTime;
uniform float uOpacity;

void main() {
  // Linear decay: starts at full opacity and decays to 0 over time
  float decaySpeed = 3.14;
  float timeFactor = clamp(uTime / decaySpeed, 0.0, 1.0);
  float timeModulatedOpacity = mix(uOpacity, 0.0, timeFactor);

  gl_FragColor = vec4(0, 1, 0, timeModulatedOpacity);
}
`;