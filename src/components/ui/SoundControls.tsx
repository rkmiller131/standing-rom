import '../../css/SoundControls.css';
import { useSceneState } from '../../hookstate-store/SceneState';

export default function SoundControls() {
  //   const { setMusic, setSFX } = useHookstateGetters(); for some reason this doesnt works
  const sceneState = useSceneState();
  return (
    <div className="soundControls">
      <p>Music</p>
      <button
        id="musButton"
        className="musButton"
        onClick={() => {
          sceneState.soundSettings.music.set(true);

          document.getElementById('musButton')!.style.border =
            'var(--font-accent-color) 2px solid';

          document.getElementById('musButton2')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        On
      </button>
      <button
        id="musButton2"
        className="musButton2"
        onClick={() => {
          sceneState.soundSettings.music.set(false);

          document.getElementById('musButton2')!.style.border =
            'var(--font-accent-color) 2px solid';

          document.getElementById('musButton')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        Off
      </button>

      <p>Sound Effects</p>
      <button
        id="sfxButton"
        className="sfxButton"
        onClick={() => {
          sceneState.soundSettings.sfx.set(true);

          document.getElementById('sfxButton')!.style.border =
            'var(--font-accent-color) 2px solid';

          document.getElementById('sfxButton2')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        On
      </button>
      <button
        id="sfxButton2"
        className="sfxButton2"
        onClick={() => {
          sceneState.soundSettings.sfx.set(false);

          document.getElementById('sfxButton2')!.style.border =
            'var(--font-accent-color) 2px solid';

          document.getElementById('sfxButton')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        Off
      </button>
    </div>
  );
}
