import Song from "../../assets/song.mp3";
import { useEffect, useState } from "react";

export const Audio = () => {
  const [showModal, setShowModal] = useState(true);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [source, setSource] = useState<AudioBufferSourceNode | null>(null);

  useEffect(() => {
    // Initialize the AudioContext when the component mounts
    const context = new AudioContext();
    setAudioContext(context);

    // Load and decode the audio file
    fetch(Song)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => context.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        const src = context.createBufferSource();
        src.buffer = audioBuffer;
        src.loop = true;
        setSource(src);

        src.connect(context.destination);
      })
      .catch((error) => console.error("Error loading audio:", error));
  }, []);

  const handlePlay = () => {
    if (audioContext && source) {
      audioContext.resume().then(() => {
        source.start();
        console.log("Playback resumed successfully");
        setShowModal(false);
      });
    }
  };

  return (
    <div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Play Audio</h2>
            <p>Click the button below to unmute the audio.</p>
            <button onClick={handlePlay}>Play</button>
          </div>
        </div>
      )}
    </div>
  );
};
