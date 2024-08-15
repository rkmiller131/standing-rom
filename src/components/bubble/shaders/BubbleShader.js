import * as THREE from 'three';

export const BubbleShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vReflect;

    void main() {
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);

      vec3 cameraToVertex = normalize(worldPosition.xyz - cameraPosition);

      vNormal = normalize(normalMatrix * normal);
      vReflect = reflect(cameraToVertex, vNormal);

      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
  uniform vec3 color;
uniform float opacity;
varying vec3 vNormal;
varying vec3 vReflect;

void main() {
  float intensity = pow(dot(vReflect, vNormal), .9); // Adjust intensity calculation
  vec3 baseColor = vec3(0.0, 0.0, 1); // Brighter blue color for the base
  vec3 finalColor = mix(baseColor, vec3(1.0, 1.0, 1.0), intensity * 1.5); // Smooth blend with white
  gl_FragColor = vec4(finalColor * color, opacity);
}
  `,
  uniforms: {
    color: { value: new THREE.Color(0x88cfff) },
    opacity: { value: 0.5 }
  }
};
