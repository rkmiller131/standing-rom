import { useState } from 'react';

import '../../css/ViewScreen.css';
import Protractor from '../../utils/avatar/Protractor';

export default function ViewControls() {
  const [show, setShow] = useState(false);

  return (
    <div className="view-ui-container">
      <div>
        <button className="view-button" onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
        </button>
        {show && <Protractor />}
      </div>
    </div>
  );
}
