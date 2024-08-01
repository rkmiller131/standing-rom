// glsl
export const grassFragmentShader = `
  uniform sampler2D uCloud;

  varying vec3 vPosition;
  varying vec2 vUv;
  varying vec3 vNormal;

  vec3 green = vec3(0.408,0.522,0.078);
  vec3 hay = vec3(0.584,0.639,0.165);

  void main() {
    vec3 color = green;

    vec3 map = mix(hay, texture2D(uCloud, vUv).rgb, 0.5);

    color = mix(color, map, 0.5);

    float lighting = normalize(dot(vNormal, vec3(10)));
    gl_FragColor = vec4(color + lighting * 0.03, 1.0);
  }
`;