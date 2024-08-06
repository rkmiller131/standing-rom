import '../../css/UVXBrandWatermark.css';
import { uvxLogos } from '../../utils/cdn-links/images';

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