import { IconName, IconPrefix } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface StatItemProps {
  icon: IconName | [IconPrefix, IconName];
  description: string;
  metric: string;
}
export default function StatItem({ icon, description, metric}: StatItemProps) {
  return (
    <div className="stat-item">
      <FontAwesomeIcon icon={icon} size="3x"/>
      <div className="stat">
        <div className="stat-desc">
          {description}
        </div>
        <p>{metric}</p>
      </div>
    </div>
  )
}