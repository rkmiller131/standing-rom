import '../../css/SceneControls.css';
import useHookstateGetters from '../../interfaces/Hookstate_Interface';

export default function SceneControls() {
  const {
    setMusic,
    getMusic,
    setSFX,
    getSFX,
    getAnnouncer,
    setAnnouncer,
    getAllSounds,
    setAllSounds,
  } = useHookstateGetters();
  return (
    <div className="soundControls">
      <p>All Sound</p>
      <button
        id="allButton"
        className="annButton"
        style={{
          border: `${getAllSounds() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        onClick={() => {
          setAllSounds(true);

          document.getElementById('allButton2')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        On
      </button>
      <button
        id="allButton2"
        className="annButton2"
        style={{
          border: `${!getAllSounds() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        onClick={() => {
          setAllSounds(false);

          document.getElementById('allButton')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        Off
      </button>
      <p>Announcer</p>
      <button
        id="annButton"
        className="annButton"
        style={{
          border: `${getAnnouncer() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        disabled={!getAllSounds()}
        onClick={() => {
          setAnnouncer(true);

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
          border: `${!getAnnouncer() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        disabled={!getAllSounds()}
        onClick={() => {
          setAnnouncer(false);

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
          border: `${getMusic() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        disabled={!getAllSounds()}
        onClick={() => {
          setMusic(true);

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
          border: `${!getMusic() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        disabled={!getAllSounds()}
        onClick={() => {
          setMusic(false);

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
          border: `${getSFX() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        disabled={!getAllSounds()}
        onClick={() => {
          setSFX(true);

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
          border: `${!getSFX() ? 'var(--uvx-accent-color) 2px solid' : 'var(--uvx-secondary) 2px solid'}`,
        }}
        disabled={!getAllSounds()}
        onClick={() => {
          setSFX(false);

          document.getElementById('sfxButton')!.style.border =
            'var(--uvx-secondary) 2px solid';
        }}
      >
        Off
      </button>
    </div>
  );
}
