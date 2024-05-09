import { useState, FormEvent, useCallback } from 'react'
import { useGameState } from '../ecs/store/GameState'

import '../css/SetupScreen.css'

export default function SetupScreen() {
  const gameState = useGameState();
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<'Outdoors' | 'Indoor Office' | ''>('');

  const handleSubmit = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selected) {
        gameState.selectedEnvironment.set(selected);
        setSubmitted(true);
    }
  }, [gameState, selected]);

  if (submitted) return null;

  return (
    <div id="setup">
        <h2>Choose the Environment you would like to use:</h2>
        <form onSubmit={handleSubmit} id="scene-selection-form">
            <input
            type="radio"
            id="outdoor"
            name="environment"
            value="Outdoor"
            checked={selected === "Outdoors"}
            onChange={() => setSelected("Outdoors")}
            />
            <label htmlFor="outdoor">Outdoor</label>

            <input
            type="radio"
            id="indoor-office"
            name="environment"
            value="Indoor Office"
            checked={selected === "Indoor Office"}
            onChange={() => setSelected("Indoor Office")}
            />
            <label htmlFor="indoor-office">Indoor Office</label>
        </form>
        <button
            form="scene-selection-form"
            type="submit" 
            className="scene-selection-button"
        >
            Select
        </button>
    </div>
  );
}