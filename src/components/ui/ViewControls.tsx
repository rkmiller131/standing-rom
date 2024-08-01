import { useEffect, useState } from 'react';

import '../../css/ViewScreen.css';

interface ViewControlsProps {
  setToggled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function ViewControls({ setToggled }: ViewControlsProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) {
      setToggled(true);
    } else {
      setToggled(false);
    }
  }, [show]);

  return (
    <div className="view-ui-container">
      <div>
        <button className="view-button" onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
    </div>
  );
}
