import { AchievementType } from './ResultsScreen';

interface AchievementItemProps {
  achievement: AchievementType;
  achievementUnlocked: boolean;
}
export default function AchievementItem({ achievement, achievementUnlocked }: AchievementItemProps) {
  return (
    <div id="achievement-item">
      <input type="checkbox" checked={achievementUnlocked} readOnly />
      <div className="achievement-content">
        <label className="achievement-title">{`${achievement.title}:`}</label>
        <span className="achievement-description">{achievement.description}</span>
      </div>
    </div>
  )
}