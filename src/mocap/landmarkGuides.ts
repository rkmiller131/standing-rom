/* eslint-disable @typescript-eslint/no-explicit-any */
import { POSE_CONNECTIONS } from '@mediapipe/holistic'
import {drawConnectors, drawLandmarks} from '@mediapipe/drawing_utils'

export function drawLandmarkGuides(
  results: any,
  videoRef: React.RefObject<HTMLVideoElement>,
  landmarkCanvasRef: React.RefObject<HTMLCanvasElement>
) {
  if (!landmarkCanvasRef.current || !videoRef.current) return;

  landmarkCanvasRef.current.width = videoRef.current.videoWidth;
  landmarkCanvasRef.current.height = videoRef.current.videoHeight;
  const canvasCtx = landmarkCanvasRef.current.getContext('2d');

  if (!canvasCtx) return;

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, landmarkCanvasRef.current.width, landmarkCanvasRef.current.height);

  const rightFacialLandmarks = results.poseLandmarks.filter((_lm: any, index: number) => ([0, 3].includes(index)));
  const leftFacialLandmarks = results.poseLandmarks.filter((_lm: any, index: number) => ([6].includes(index)));
  const rightLandmarks = results.poseLandmarks.filter((_lm: any, index: number) => ([11, 13, 15, 17, 19, 21, 23, 25, 27, 29, 31].includes(index)));
  const leftLandmarks = results.poseLandmarks.filter((_lm: any, index: number) => ([12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32].includes(index)));

  // Use Mediapipe drawing functions
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#F3F0E7",
    lineWidth: 3
  });
  drawLandmarks(canvasCtx, leftFacialLandmarks, {
    color: "#00B1FF",
    lineWidth: 1
  });
  drawLandmarks(canvasCtx, rightFacialLandmarks, {
    color: "#0ED8A5",
    lineWidth: 1
  });
  drawLandmarks(canvasCtx, leftLandmarks, {
    color: "#00B1FF",
    lineWidth: 1
  });
  drawLandmarks(canvasCtx, rightLandmarks, {
    color: "#0ED8A5",
    lineWidth: 1
  });

  // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
  //   color: "#C0C0C070",
  //   lineWidth: 1
  // });
  // if(results.faceLandmarks && results.faceLandmarks.length === 478){
  //   //draw pupils
  //   drawLandmarks(canvasCtx, [results.faceLandmarks[468],results.faceLandmarks[468+5]], {
  //     color: "#ffe603",
  //     lineWidth: 2
  //   });
  // }
  // drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
  //   color: "#0ED8A5",
  //   lineWidth: 5
  // });
  // drawLandmarks(canvasCtx, results.leftHandLandmarks, {
  //   color: "#00cff7",
  //   lineWidth: 2
  // });
  // drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
  //   color: "#0ED8A5",
  //   lineWidth: 5
  // });
  // drawLandmarks(canvasCtx, results.rightHandLandmarks, {
  //   color: "#ff0364",
  //   lineWidth: 2
  // });

  canvasCtx.restore();
}