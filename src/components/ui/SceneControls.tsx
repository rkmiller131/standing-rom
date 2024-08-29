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
        style={{
          border: `${sceneState.sceneSettings.announcer.get() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        onClick={() => {
          sceneState.sceneSettings.announcer.set(true);

          document.getElementById('annButton2')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        On
      </button>
      <button
        id="annButton2"
        className="annButton2"
        style={{
          border: `${!sceneState.sceneSettings.announcer.get() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        onClick={() => {
          sceneState.sceneSettings.announcer.set(false);

          document.getElementById('annButton')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        Off
      </button>
      <p>Music</p>
      <button
        id="musButton"
        className="musButton"
        style={{
          border: `${sceneState.sceneSettings.music.get() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        onClick={() => {
          sceneState.sceneSettings.music.set(true);

          document.getElementById('musButton2')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        On
      </button>
      <button
        id="musButton2"
        className="musButton2"
        style={{
          border: `${!sceneState.sceneSettings.music.get() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        onClick={() => {
          sceneState.sceneSettings.music.set(false);

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
        style={{
          border: `${sceneState.sceneSettings.sfx.get() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        onClick={() => {
          sceneState.sceneSettings.sfx.set(true);

          document.getElementById('sfxButton2')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        On
      </button>
      <button
        id="sfxButton2"
        className="sfxButton2"
        style={{
          border: `${!sceneState.sceneSettings.sfx.get() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        onClick={() => {
          sceneState.sceneSettings.sfx.set(false);

          document.getElementById('sfxButton')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        Off
      </button>
    </div>
  );
}
