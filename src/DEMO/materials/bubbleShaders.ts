export function makeBubbleVertexShader(active: boolean) {
  const vertex = `
    uniform float uTime;
    uniform sampler2D uPattern;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
        vPosition = position;
        vNormal = normal;
        vUv = uv;

        float height = smoothstep(0.1, 0.9, texture2D(uPattern, position.yz * 0.02 + vec2(uTime)).x);
        vec3 displacedPosition = position + normal * height * 0.1;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(${active ? 'displacedPosition': 'position'}, 1.0);
    }
  `;
  return vertex;
}

export function makeBubbleFragShader(active: boolean) {
  const fragment = `
    uniform sampler2D uPattern;
    uniform samplerCube envMap;

    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
        vec3 viewDirection = normalize(cameraPosition - vPosition);
        float fresnel = 1.0 - dot(viewDirection, vNormal);

        float smoothFactor = mix(0.0, 0.75, vUv.y);

        vec3 baseColor = vec3(smoothFactor, 1.0, smoothFactor);

        vec3 activeColor = vec3(fresnel) * vec3(smoothFactor, 1.0, smoothFactor);
        vec3 reflectionVector = reflect(-viewDirection, vNormal);
        vec3 envColor = textureCube(envMap, reflectionVector).rgb;
        // vec3 activeColor = mix(vec3(0.2, 1.0, 0.2), envColor, 0.3);

        vec3 inactiveColor = vec3(fresnel) * vec3(smoothFactor, smoothFactor, 1.0);

        gl_FragColor = vec4(${active ? 'activeColor, 1.0' : 'inactiveColor, 0.5'});
    }
  `;
  return fragment;
}