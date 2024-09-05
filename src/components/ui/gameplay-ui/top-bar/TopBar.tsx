import { VRM } from '../../../../interfaces/THREE_Interface';
import PractitionerFeed from './PractitionerFeed';
import UVXBrandWatermark from './UVXBrandWatermark';
import Score from './Score';

interface TopBarProps {
  avatar: React.RefObject<VRM>;
}

export default function TopBar({ avatar }: TopBarProps) {
  return (
    <div className="gameplay-ui-top">
      <PractitionerFeed />
      <Score avatar={avatar}/>
      <UVXBrandWatermark />
    </div>
  )
}