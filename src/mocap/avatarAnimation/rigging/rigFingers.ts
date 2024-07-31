import { clamp } from 'three/src/math/MathUtils.js';
import { PI, RIGHT, Side, THand, THandUnsafe } from '../constants/Types';

/**
 * Converts normalized rotation values into radians clamped by human limits
 * @param {Object} hand : object of labeled joint with normalized rotation values
 * @param {Side} side : left or right
 */
export const rigFingers = (hand: THandUnsafe<typeof side>, side: Side = RIGHT): THand<typeof side> => {
  // Invert modifier based on left vs right side
  const invert = side === RIGHT ? 1 : -1;
  const digits = ['Ring', 'Index', 'Little', 'Thumb', 'Middle'];
  const segments = ['Proximal', 'Intermediate', 'Distal'];

  hand[side + 'Wrist'].x = clamp(hand[side + 'Wrist'].x * 2 * invert, -0.3, 0.3); // twist
  hand[side + 'Wrist'].y = clamp(
      hand[side + 'Wrist'].y * 2.3,
      side === RIGHT ? -1.6 : -0.6, // max -1.2, -0.6
      side === RIGHT ? 0.6 : 1.6 // min 0.6,  1.6
  );
  //                                             *-2.6 * invert
  hand[side + 'Wrist'].z = hand[side + 'Wrist'].z * -2.3 * invert; //left right

  digits.forEach((e) => {
      segments.forEach((j) => {
          const trackedFinger = hand[side + e + j];

          if (e === 'Thumb') {
              //dampen thumb rotation depending on segment
              const dampener = {
                  x: j === 'Proximal' ? 2.2 : j === 'Intermediate' ? 0 : 0,
                  y: j === 'Proximal' ? 2.2 : j === 'Intermediate' ? 0.7 : 1,
                  z: j === 'Proximal' ? 0.5 : j === 'Intermediate' ? 0.5 : 0.5,
              };
              const startPos = {
                  x: j === 'Proximal' ? 1.2 : j === 'Distal' ? -0.2 : -0.2,
                  y: j === 'Proximal' ? 1.1 * invert : j === 'Distal' ? 0.1 * invert : 0.1 * invert,
                  z: j === 'Proximal' ? 0.2 * invert : j === 'Distal' ? 0.2 * invert : 0.2 * invert,
              };
              const newThumb = { x: 0, y: 0, z: 0 };
              if (j === 'Proximal') {
                  newThumb.z = clamp(
                      startPos.z + trackedFinger.z * -PI * dampener.z * invert,
                      side === RIGHT ? -0.6 : -0.3,
                      side === RIGHT ? 0.3 : 0.6
                  );
                  newThumb.x = clamp(startPos.x + trackedFinger.z * -PI * dampener.x, -0.6, 0.3);
                  newThumb.y = clamp(
                      startPos.y + trackedFinger.z * -PI * dampener.y * invert,
                      side === RIGHT ? -1 : -0.3,
                      side === RIGHT ? 0.3 : 1
                  );
              } else {
                  newThumb.z = clamp(startPos.z + trackedFinger.z * -PI * dampener.z * invert, -2, 2);
                  newThumb.x = clamp(startPos.x + trackedFinger.z * -PI * dampener.x, -2, 2);
                  newThumb.y = clamp(startPos.y + trackedFinger.z * -PI * dampener.y * invert, -2, 2);
              }
              trackedFinger.x = newThumb.x;
              trackedFinger.y = newThumb.y;
              trackedFinger.z = newThumb.z;
          } else {
              //will document human limits later
              trackedFinger.z = clamp(
                  trackedFinger.z * -PI * invert,
                  side === RIGHT ? -PI : 0,
                  side === RIGHT ? 0 : PI
              );
          }
      });
  });
  return hand as THand<typeof side>;
};