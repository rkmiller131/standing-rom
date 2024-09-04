import Score from './Score';
import UVXBrandWatermark from './UVXBrandWatermark';

export default function TopBar () {
  return (
    <div className="gameplay-ui-top">
      <div style={{height: '200px'}}>TEST</div>
      <Score />
      <UVXBrandWatermark />
    </div>
  )
}