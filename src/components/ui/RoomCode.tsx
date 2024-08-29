import Button from '../Button';

import '../../css/RoomCode.css';

export default function RoomCode({ submitCode }: { submitCode: (code: number) => void }) {
  const clickHandler = () => {
    submitCode(1234); // make this the value of the input instead of hardcoded
  }
  return (
    <div id="room-code-screen">
      <Button content="Enter" onClick={clickHandler} extraClass='wide-button'/>
    </div>
  );
}