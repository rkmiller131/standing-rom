/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useEffect } from "react";
import { drawLandmarkGuides } from "./landmarkGuides";
import { Holistic } from "@mediapipe/holistic";
import { Camera } from "@mediapipe/camera_utils";
import { animateVRM } from "../avatar/helpers/avatarAnimator";
import { VRM } from "../THREE_Interface";

import "../css/Mocap.css";
import { useGameState } from "../ecs/store/GameState";

import Doctor from "../assets/Patient.png";

interface MocapProps {
  avatar: React.RefObject<VRM>;
  setHolisticLoaded: (loaded: boolean) => void;
}

export default function Mocap({ avatar, setHolisticLoaded }: MocapProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const landmarkCanvasRef = useRef<HTMLCanvasElement | null>(null);
  let holisticLoaded = false;
  const gameState = useGameState();
  const device = gameState.device.get({ noproxy: true });

  function onResults(results: any) {
    if (results.poseLandmarks && results.poseLandmarks.length > 0) {
      drawLandmarkGuides(results, videoRef, landmarkCanvasRef);

      if (avatar && avatar.current) {
        animateVRM(avatar, results, videoRef);
      }

      if (!holisticLoaded) {
        setTimeout(() => {
          setHolisticLoaded(true);
        }, 2000);
        holisticLoaded = true;
      }
    }
  }

  useEffect(() => {
    // grab the video stream from client webcam
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => console.error("getUserMedia error: ", error));
    }

    // use mediapipe/holistic to track pose and hand landmarks from video stream
    const holistic = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1675471629/${file}`,
    });

    holistic.setOptions({
      modelComplexity: device !== "Desktop" ? 0 : 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.7,
      selfieMode: true,
    });

    // Pass holistic a callback function to handle streamed images
    holistic.onResults(onResults);

    // start webcam video stream playback
    if (videoRef.current) {
      videoRef.current.addEventListener("loadedmetadata", () => {
        videoRef
          .current!.play()
          .catch((error) => console.error("Video playback error: ", error));
      });
      // use mediapipe camera utils to start the onResults function
      const camera = new Camera(videoRef.current, {
        onFrame: async () => {
          if (!videoRef.current) return;
          await holistic.send({ image: videoRef.current });
        },
        width: 450,
        height: 300,
      });
      camera.start();
    }

    return () => {
      // clean up mediapipe.
      holistic.close();
    };
  }, []);

  return (
    <div id="mocap-container" className={device} style={{ overflow: "hidden" }}>
      <div
        style={{
          background: "white",
          color: "black",
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          gap: "10px",
          padding: "0px 10px",
          paddingRight: "20px",
          borderRadius: "50px",
          position: "absolute",
          zIndex: 100,
          top: "18px",
          left: "18px",
          height: "45px",
        }}
      >
        <div
          style={{
            width: "30px",
            height: "30px",
            background: "#0ED8A5",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <img
            src={Doctor}
            alt="Doctor Skywalker"
            style={{
              position: "absolute",
              objectFit: "cover",
              width: "100%",
              height: "100%",
            }}
          />
        </div>
        <p style={{ fontWeight: 600 }}>You</p>
      </div>
      <div className="bgGradient" />
      <video
        id="webcam-stream"
        ref={videoRef}
        width="100%"
        height="100%"
        muted
        playsInline
      ></video>
      <canvas id="landmark-guides" ref={landmarkCanvasRef} />
    </div>
  );
}
