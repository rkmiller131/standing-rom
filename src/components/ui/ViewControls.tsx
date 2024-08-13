import { useState } from 'react';

import '../../css/ViewScreen.css';
import Protractor from '../../utils/avatar/Protractor';
import { VRM } from '@pixiv/three-vrm';

interface ViewProps {
  avatar: React.RefObject<VRM>;
}

export default function ViewControls({ avatar }: ViewProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="view-ui-container">
      <div className="view-ui-buffer">
        <button className="view-button" onClick={() => setShow(!show)}>
          {show ? 'Hide Measure' : 'Show Measure'}
        </button>
        {show && <Protractor avatar={avatar} />}
      </div>
    </div>
  );
}
