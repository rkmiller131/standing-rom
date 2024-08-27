import '../../css/SceneControls.css';
import { useSceneState } from '../../hookstate-store/SceneState';

export default function SceneControls() {
  //   const { setMusic, setSFX } = useHookstateGetters(); for some reason this doesnt works
  const sceneState = useSceneState();
  return (
    <div className="soundControls">
      <p>Announcer</p>
      <button
        id="annButton"
        className="annButton"
        onClick={() => {
          sceneState.sceneSettings.announcer.set(true);

          document.getElementById('annButton')!.style.border =
            'var(--font-accent-color) 2px solid';

          document.getElementById('annButton2')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        On
      </button>
      <button
        id="annButton2"
        className="annButton2"
        onClick={() => {
          sceneState.sceneSettings.announcer.set(false);

          document.getElementById('annButton2')!.style.border =
            'var(--font-accent-color) 2px solid';

          document.getElementById('annButton')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        Off
      </button>
      <button className="">Off</button>
      <p>Music</p>
      <button
        id="musButton"
        className="musButton"
        onClick={() => {
          sceneState.sceneSettings.music.set(true);

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
          sceneState.sceneSettings.music.set(false);

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
          sceneState.sceneSettings.sfx.set(true);

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
          sceneState.sceneSettings.sfx.set(false);

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
