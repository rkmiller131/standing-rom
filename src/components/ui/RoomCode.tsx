import { useState, useEffect } from 'react';
import ReactCodeInput from 'react-code-input';
import Button from '../Button';
import { uvxLogos } from '../../utils/cdn-links/images';
import '../../css/RoomCode.css';

export default function RoomCode({submitCode}: {submitCode: (code: number) => void}) {
  const [code, setCode] = useState<string>('');

  const handleInputChange = (value: string) => {
    setCode(value);
  };

  const clickHandler = () => {
    if (code.length === 4) {
      submitCode(parseInt(code));
    } else {
      alert('Please enter a 4-digit code');
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && code.length === 4) {
        clickHandler();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [code]);

  return (
    <div id="room-code-screen">
      <div id="blue-overlay"></div>
      <div id="light-blue-input-box">
        <h2 className="input-box-title">Shoulder ROM, Standing</h2>
        <h3 className="subtitle">Enter Room Code</h3>
        <ReactCodeInput
          type="text"
          name="roomCode"
          fields={4}
          autoFocus={true}
          onChange={handleInputChange}
          value={code}
          className="custom-code-input"
          inputMode="numeric"
        />
      </div>

      <div className="room-code-footer">
        <Button buttonStyle='disabled' content="Enter" onClick={() => {}} extraClass='placeholder'/>
        <img src={uvxLogos.uvxWhite} alt="UVX Logo" className="uvx-logo" />
        <Button
          buttonStyle={code.length !== 4 ? 'disabled' : 'primary'}
          content="Enter"
          onClick={clickHandler}
          extraClass="wide-button"
        />
      </div>
    </div>
  );
}
