import { VRM } from '../../../../interfaces/THREE_Interface';
import Score from './Score';
import UVXBrandWatermark from './UVXBrandWatermark';

interface TopBarProps {
  avatar: React.RefObject<VRM>;
}

export default function TopBar({ avatar }: TopBarProps) {
  return (
    <div className="gameplay-ui-top">
      <div style={{height: '200px'}}>TEST</div>
      <Score avatar={avatar}/>
      <UVXBrandWatermark />
    </div>
  )
}