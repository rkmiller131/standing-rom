export const vertexShader = `
uniform float uRadius;
uniform float uTime;

vec3 explode(vec3 originalPosition, float time) {
  // Extract the speed from the y-component of the original position
  float speed = originalPosition.y;

  // Normalize the speed to a reasonable range
  float normalizedSpeed = mix(1.0, 2.0, speed);

  // Calculate the direction vector for the explosion
  vec3 direction = normalize(originalPosition);

  // Determine the peak time of the explosion
  float peakTime = 0.5;
  float gravity = 9.8;
  
  float explosionFactor = normalizedSpeed * time / peakTime;

  // Modify the direction to follow a parabolic arc
  vec3 modifiedDirection = direction * explosionFactor + vec3(0.0, -gravity * time * time, 0.0);

  vec3 explodedPosition = originalPosition + modifiedDirection;

  return explodedPosition;
}

void main() {
  vec3 originalPosition = position;

  vec4 modelPosition = modelMatrix * vec4(originalPosition, 1.0);
  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  gl_PointSize = 4.0;
}
`;
