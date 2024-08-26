import '../../css/SoundControls.css';
import { useSceneState } from '../../hookstate-store/SceneState';

export default function SoundControls() {
  const sceneState = useSceneState();
  return (
    <div className="soundControls">
      <p>Music</p>
      <button
        className="scButton2"
        onClick={() => {
          sceneState.soundSettings.music.set(true);
        }}
      >
        On
      </button>
      <button
        className="scButton"
        onClick={() => {
          sceneState.soundSettings.music.set(false);
        }}
      >
        Off
      </button>

      <p>Sound Effects</p>
      <button
        onClick={() => {
          sceneState.soundSettings.sfx.set(true);
        }}
      >
        On
      </button>
      <button
        onClick={() => {
          sceneState.soundSettings.sfx.set(false);
        }}
      >
        Off
      </button>
    </div>
  );
}
