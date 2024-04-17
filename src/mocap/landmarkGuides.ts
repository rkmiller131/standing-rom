import { FACEMESH_TESSELATION, HAND_CONNECTIONS, POSE_CONNECTIONS } from '@mediapipe/holistic'
import {drawConnectors, drawLandmarks} from '@mediapipe/drawing_utils'

export function drawLandmarkGuides(results, videoRef, landmarkCanvasRef) {
  landmarkCanvasRef.current.width = videoRef.current.videoWidth;
  landmarkCanvasRef.current.height = videoRef.current.videoHeight;
  const canvasCtx = landmarkCanvasRef.current.getContext('2d');

  canvasCtx.save();
  canvasCtx.clearRect(0, 0, landmarkCanvasRef.current.width, landmarkCanvasRef.current.height);
  
  // Use Mediapipe drawing functions
  drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
    color: "#00cff7",
    lineWidth: 4
  });
  drawLandmarks(canvasCtx, results.poseLandmarks, {
    color: "#ff0364",
    lineWidth: 2
  });
  drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
    color: "#C0C0C070",
    lineWidth: 1
  });
  if(results.faceLandmarks && results.faceLandmarks.length === 478){
    //draw pupils
    drawLandmarks(canvasCtx, [results.faceLandmarks[468],results.faceLandmarks[468+5]], {
      color: "#ffe603",
      lineWidth: 2
    });
  }
  drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
    color: "#eb1064",
    lineWidth: 5
  });
  drawLandmarks(canvasCtx, results.leftHandLandmarks, {
    color: "#00cff7",
    lineWidth: 2
  });
  drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
    color: "#22c3e3",
    lineWidth: 5
  });
  drawLandmarks(canvasCtx, results.rightHandLandmarks, {
    color: "#ff0364",
    lineWidth: 2
  });
  
  canvasCtx.restore();
}
