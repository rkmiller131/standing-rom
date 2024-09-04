import { uvxLogos } from '../../../../utils/cdn-links/images';

import '../../../../css/UVXBrandWatermark.css';

export default function UVXBrandWatermark() {
  return (
    <div id="uvx-watermark-container">
      <img
        src={uvxLogos['uvxWhite']}
        alt="UbiquityVX Logo"
        className="uvx-logo"
      />
    </div>
  )
}