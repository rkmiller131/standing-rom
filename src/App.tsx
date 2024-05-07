import {
  useLayoutEffect,
  useRef,
  useState,
  lazy,
  Suspense,
  useEffect,
} from "react";
import Renderer from "./renderer/Renderer";
import Mocap from "./mocap/Mocap";
import Avatar from "./avatar/Avatar";
import Office from "./environment/Office";
import LoadingScreen from "./ui/LoadingScreen";
import GameLogic from "./ecs/systems/GameLogic";
import { useGameState } from "./ecs/store/GameState";
import { GLTF, VRM } from "./THREE_Interface";
import checkUserDevice from "./ecs/helpers/checkUserDevice";

import "./css/App.css";
import { Vector3 } from "three";

import Doctor from "./assets/Doctor.webp";

// import { Physics } from '@react-three/rapier'
// import RightHandCollider from './DEMO/rightHandCollider'

// import { ECS } from "./ecs/World";

const Sky = lazy(() => import("./environment/Sky"));
const Sound = lazy(() => import("./environment/sound/Sound"));
const GameInfo = lazy(() => import("./ui/GameInfo"));
const Lighting = lazy(() => import("./environment/Lighting"));
const DemoBubble = lazy(() => import("./DEMO/demoBubble"));

// LEARNING RESOURCES -------------------------------------------------------------------
// https://developers.google.com/mediapipe/solutions/vision/pose_landmarker/web_js#video
// https://github.com/google/mediapipe/blob/master/docs/solutions/holistic.md
// https://glitch.com/edit/#!/kalidokit?path=script.js%3A334%3A0
// https://codesandbox.io/s/react-three-fiber-vrm-9ryxq?file=/src/index.tsx:2398-2461
// https://github.com/pixiv/three-vrm/blob/dev/docs/migration-guide-1.0.md
// https://github.com/superdav42/kalidokit-react/blob/master/src/components/Model.jsx
// --------------------------------------------------------------------------------------

export default function App() {
  const avatar = useRef<VRM | null>(null);
  const environment = useRef<GLTF | null>(null);
  const [holisticLoaded, setHolisticLoaded] = useState(false);
  const gameState = useGameState();
  gameState.device.set(checkUserDevice());
  const [isPhone, setIsPhone] = useState(false);

  const checkIfPhone = () => {
    const userAgent = navigator.userAgent || navigator.vendor;
    return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      userAgent
    );
  };

  const setAvatarModel = (vrm: VRM) => {
    avatar.current = vrm;
  };

  const setEnvironmentModel = (gltf: GLTF) => {
    environment.current = gltf;
  };

  useLayoutEffect(() => {
    if (avatar.current && holisticLoaded) {
      gameState.sceneLoaded.set(true);
    }
  }, [holisticLoaded, gameState.sceneLoaded]);

  useEffect(() => {
    setIsPhone(checkIfPhone());
    const handleResize = () => {
      setIsPhone(checkIfPhone());
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <main id="app-container">
      {/* UI */}
      <div className="fixed-container">
        <div className="info-container2">
          <p
            style={{
              background: "white",
              borderRadius: "50px",
              padding: "5px 17px",
              color: "black",
              height: "100%",
              display: "flex",
              alignItems: "center",
              margin: "0",
              paddingBottom: "8px",
            }}
          >
            Arm Raise Game
          </p>
          <svg
            width="135"
            height="24"
            viewBox="0 0 135 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.65979 18.518C6.37812 18.518 5.2211 18.2643 4.19019 17.7569C3.15782 17.2495 2.33955 16.4796 1.73097 15.4472C1.12387 14.4163 0.820312 13.1097 0.820312 11.5289V0.246094H4.01569V11.5524C4.01569 12.9176 4.34417 13.9324 5.00114 14.5982C5.6581 15.2639 6.56876 15.5968 7.73458 15.5968C8.9004 15.5968 9.78907 15.2639 10.4548 14.5982C11.1206 13.9324 11.4535 12.9176 11.4535 11.5524V0.246094H14.6489V11.5289C14.6489 13.1097 14.3321 14.4163 13.7001 15.4472C13.068 16.4796 12.2234 17.248 11.1661 17.7569C10.1088 18.2643 8.94 18.518 7.65979 18.518Z"
              fill="white"
            />
            <path
              d="M25.1794 18.518C24.2482 18.518 23.4328 18.3434 22.7334 17.9944C22.0339 17.6454 21.4678 17.1542 21.0352 16.5221V18.5194H17.8398V0.246094H21.0352V7.6091C21.4341 7.05918 21.962 6.57819 22.6204 6.16172C23.2774 5.74525 24.1309 5.53701 25.1794 5.53701C26.3437 5.53701 27.3834 5.82004 28.3 6.38608C29.215 6.95213 29.9394 7.72641 30.4718 8.70746C31.0041 9.68851 31.271 10.8045 31.271 12.0524C31.271 13.3004 31.0041 14.4119 30.4718 15.3842C29.9394 16.3579 29.215 17.1234 28.3 17.6806C27.3849 18.2379 26.3437 18.5165 25.1794 18.5165V18.518ZM24.5063 15.7229C25.5211 15.7229 26.3613 15.3827 27.0271 14.6993C27.6929 14.0174 28.0257 13.1361 28.0257 12.0524C28.0257 10.9687 27.6929 10.0815 27.0271 9.38202C26.3613 8.68253 25.5211 8.33352 24.5063 8.33352C23.4915 8.33352 22.6292 8.6796 21.9723 9.37029C21.3153 10.061 20.9868 10.9467 20.9868 12.029C20.9868 13.1112 21.3153 13.9969 21.9723 14.6876C22.6292 15.3783 23.4739 15.7244 24.5063 15.7244V15.7229Z"
              fill="white"
            />
            <path
              d="M35.3371 3.91513C34.755 3.91513 34.2769 3.74062 33.9015 3.39161C33.5275 3.0426 33.3398 2.6012 33.3398 2.06888C33.3398 1.53656 33.5275 1.09956 33.9015 0.759348C34.2769 0.416201 34.755 0.246094 35.3371 0.246094C35.9193 0.246094 36.3974 0.416201 36.7728 0.757882C37.1467 1.09956 37.3344 1.53656 37.3344 2.06741C37.3344 2.59827 37.1467 3.04113 36.7728 3.39014C36.3988 3.73916 35.9193 3.91366 35.3371 3.91366V3.91513ZM33.7402 18.518V5.83763H36.9356V18.518H33.7402Z"
              fill="white"
            />
            <path
              d="M49.6225 23.7058V16.4425C49.2236 16.9925 48.6942 17.4749 48.0373 17.8899C47.3803 18.3064 46.5268 18.5146 45.4783 18.5146C44.314 18.5146 43.2728 18.2316 42.3577 17.6656C41.4427 17.0995 40.7182 16.3267 40.1859 15.3442C39.6536 14.3631 39.3867 13.2472 39.3867 11.9992C39.3867 10.7513 39.6521 9.64119 40.1859 8.66747C40.7182 7.69376 41.4427 6.92974 42.3577 6.37103C43.2728 5.81378 44.3125 5.53516 45.4783 5.53516C46.4095 5.53516 47.2248 5.70966 47.9243 6.05868C48.6224 6.40769 49.1884 6.89895 49.621 7.53098V5.83284H52.8164V23.7044H49.621L49.6225 23.7058ZM46.1529 15.7181C47.1838 15.7181 48.0285 15.3735 48.6869 14.6814C49.3439 13.9921 49.6723 13.1049 49.6723 12.0227C49.6723 10.9405 49.3439 10.0547 48.6869 9.36403C48.0299 8.67334 47.1853 8.32726 46.1529 8.32726C45.1205 8.32726 44.2978 8.66894 43.6321 9.35084C42.9663 10.0327 42.6334 10.9155 42.6334 11.9963C42.6334 13.0771 42.9663 13.9672 43.6321 14.6667C44.2978 15.3662 45.1381 15.7152 46.1529 15.7152V15.7181Z"
              fill="white"
            />
            <path
              d="M60.703 18.5202C59.1559 18.5202 57.9608 18.0377 57.1205 17.0728C56.2802 16.1079 55.8594 14.6928 55.8594 12.8289V5.83984H59.0298V12.5297C59.0298 13.5944 59.2454 14.4097 59.6795 14.9758C60.1121 15.5418 60.794 15.8248 61.7266 15.8248C62.6079 15.8248 63.3368 15.5096 63.9101 14.8761C64.4835 14.244 64.7709 13.3627 64.7709 12.2306V5.83984H67.9663V18.5202H64.7709V16.124C64.3882 16.8558 63.96 17.4379 63.2356 17.8705C62.5112 18.3031 61.6665 18.5202 60.7016 18.5202H60.703Z"
              fill="white"
            />
            <path
              d="M72.9543 3.91513C72.3721 3.91513 71.8941 3.74062 71.5187 3.39161C71.1447 3.0426 70.957 2.6012 70.957 2.06888C70.957 1.53656 71.1447 1.09956 71.5187 0.759348C71.8941 0.416201 72.3721 0.246094 72.9543 0.246094C73.5365 0.246094 74.0146 0.416201 74.39 0.757882C74.7639 1.09956 74.9516 1.53656 74.9516 2.06741C74.9516 2.59827 74.7639 3.04113 74.39 3.39014C74.016 3.73916 73.5365 3.91366 72.9543 3.91366V3.91513ZM71.3574 18.518V5.83763H74.5527V18.518H71.3574Z"
              fill="white"
            />
            <path
              d="M83.4157 18.5199C82.1179 18.5199 81.0782 18.2031 80.2951 17.5711C79.512 16.939 79.1219 15.8158 79.1219 14.2012V8.50994H77V5.83955H79.1219V2.51953H82.3173V5.83955H85.6623V8.50994H82.3173V14.2261C82.3173 14.8244 82.4464 15.2365 82.7045 15.4609C82.9626 15.6852 83.4069 15.7982 84.0404 15.7982H85.5875V18.5184H83.4157V18.5199Z"
              fill="white"
            />
            <path
              d="M92.4368 18.254L87.2617 5.83763H90.7313L94.2009 14.5498L100.141 0.246094H103.673L93.3504 23.7092H89.9556L92.4353 18.254H92.4368Z"
              fill="white"
            />
            <path
              d="M109.673 15.6029L113.425 5.94981L116.069 5.90367L116.844 5.89013L119.566 5.84263L122.86 10.2849L125.97 5.73084L129.492 5.66936L124.984 12.0884L127.466 15.373L133.91 -0.000153202L107.939 0.453174L105.578 6.08678L105.587 6.08663L109.673 15.6029Z"
              fill="white"
            />
            <path
              d="M126.057 18.2725L122.79 13.8283L119.653 18.3843L116.156 18.4453L120.639 12.0252L116.436 6.43282L111.558 18.5256L107.602 18.5946L103.771 9.93629L97.8939 23.9561L123.865 23.5027L126.059 18.2724L126.057 18.2725Z"
              fill="white"
            />
          </svg>
        </div>
        <div
          className="container"
          style={{ visibility: isPhone ? "hidden" : "visible" }}
        >
          <img src={Doctor} alt="Doctor Skywalker" className="doctor-image" />
          <div className="label">
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
            <p>Dr Skywalker</p>
          </div>
        </div>
      </div>
      <div
        className="info-container3"
        style={{ visibility: isPhone ? "hidden" : "visible" }}
      >
        <p
          style={{
            borderRadius: "50px",
            padding: "5px 17px",
            height: "100%",
            display: "flex",
            alignItems: "center",
            margin: "0",
            paddingBottom: "8px",
          }}
        >
          Patients View{" "}
        </p>
        <svg
          width="23"
          height="22"
          viewBox="0 0 23 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clip-path="url(#clip0_1678_323)">
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M11.4987 1.83203C16.5614 1.83203 20.6654 5.93595 20.6654 10.9987C20.6654 16.0614 16.5614 20.1654 11.4987 20.1654C6.43595 20.1654 2.33203 16.0614 2.33203 10.9987C2.33203 5.93595 6.43595 1.83203 11.4987 1.83203ZM13.3174 13.0612C12.8315 13.4902 12.1963 13.7487 11.4987 13.7487C10.8288 13.7499 10.1816 13.5053 9.68003 13.0612C9.49769 12.9003 9.25889 12.8183 9.01616 12.8335C8.77342 12.8486 8.54664 12.9595 8.3857 13.1419C8.22476 13.3242 8.14284 13.563 8.15797 13.8057C8.17309 14.0485 8.28403 14.2753 8.46637 14.4362C9.30324 15.1757 10.3819 15.5833 11.4987 15.582C12.6156 15.5836 13.6943 15.1759 14.531 14.4362C14.7134 14.2753 14.8243 14.0485 14.8394 13.8057C14.8546 13.563 14.7726 13.3242 14.6117 13.1419C14.4508 12.9595 14.224 12.8486 13.9812 12.8335C13.7385 12.8183 13.4997 12.9003 13.3174 13.0612ZM8.29036 7.33203C7.29395 7.33203 6.49553 7.95536 6.09586 8.7547C5.9908 8.96383 5.9697 9.20522 6.03689 9.4294C6.10409 9.65359 6.25448 9.84358 6.45726 9.96044C6.66003 10.0773 6.89982 10.1122 7.12748 10.0579C7.35515 10.0037 7.55343 9.86437 7.6817 9.66861L7.73486 9.57603C7.88336 9.27903 8.1107 9.16536 8.29036 9.16536C8.4462 9.16536 8.64053 9.25245 8.78628 9.47337L8.84586 9.57603C8.9559 9.79144 9.14662 9.95462 9.37646 10.03C9.60629 10.1054 9.85661 10.0869 10.0729 9.97854C10.2891 9.87017 10.4538 9.68072 10.5309 9.45148C10.6081 9.22224 10.5916 8.97178 10.4849 8.7547C10.0843 7.95536 9.28678 7.33203 8.29036 7.33203ZM14.707 7.33203C13.7106 7.33203 12.9131 7.95536 12.5125 8.7547C12.4075 8.96383 12.3864 9.20522 12.4536 9.4294C12.5208 9.65359 12.6712 9.84358 12.8739 9.96044C13.0767 10.0773 13.3165 10.1122 13.5442 10.0579C13.7718 10.0037 13.9701 9.86437 14.0984 9.66861L14.1515 9.57603C14.3 9.27903 14.5274 9.16536 14.707 9.16536C14.8629 9.16536 15.0572 9.25245 15.2029 9.47337L15.2625 9.57603C15.3159 9.6846 15.3902 9.78154 15.4812 9.86125C15.5722 9.94096 15.6781 10.0019 15.7927 10.0405C15.9074 10.0791 16.0286 10.0946 16.1492 10.0861C16.2699 10.0777 16.3877 10.0454 16.4959 9.99124C16.604 9.93704 16.7004 9.86197 16.7794 9.77035C16.8584 9.67874 16.9185 9.57239 16.9562 9.45744C16.9939 9.34249 17.0085 9.22121 16.9991 9.1006C16.9897 8.97999 16.9566 8.86243 16.9015 8.7547C16.5019 7.95536 15.7034 7.33203 14.707 7.33203Z"
              fill="#0ED8A5"
            />
          </g>
          <defs>
            <clipPath id="clip0_1678_323">
              <rect
                width="22"
                height="22"
                fill="white"
                transform="translate(0.5)"
              />
            </clipPath>
          </defs>
        </svg>
      </div>
      <Mocap avatar={avatar} setHolisticLoaded={setHolisticLoaded} />

      <div className="canvas-container">
        {/* currently no fade-out - todo later */}
        {!gameState.sceneLoaded.get({ noproxy: true }) && <LoadingScreen />}

        <Renderer>
          <Suspense fallback={null}>
            <Lighting />
            <Sound />
            <Sky />
            <GameInfo />
            <DemoBubble position={new Vector3(0.5, 1.2, 0)} avatar={avatar} />
          </Suspense>

          <Office
            setEnvironmentModel={setEnvironmentModel}
            environment={environment}
          />
          <Avatar setAvatarModel={setAvatarModel} avatar={avatar} />
          <GameLogic avatar={avatar} />

          {/* <Physics debug>
              <RightHandCollider avatar={avatar}/>
            </Physics> */}
        </Renderer>
      </div>
    </main>
  );
}
