import MicOff from './icons/MicOff';
import MicOn from './icons/MicOn';

import '../../../css/VideoAudioCard.css';

type Role = 'Practitioner' | 'Spectator' | 'Patient';

export interface User {
  id: number;
  displayName: string;
  role: Role;
  video: boolean;
  audio: boolean;
  fakeVideo: string;
  speaking?: boolean;
}

export default function VideoAudioCard({ user, small }: { user: User, small?: boolean }) {
  return user.video ? (
    <div id="video-card" className={`${small && 'small-video'} frosted-glass`} style={{ backgroundImage: `url(${user.fakeVideo})`, border: user.speaking ? '2px solid var(--uvx-accent-color)' : '' }}>
      <span className="video-display-name">
        {user.displayName}
      </span>
      {user.audio ?
        <MicOn color="white" width={20}/> :
        <MicOff color="white" width={20}/>
      }
    </div>
  ) : (
    <div
      id="audio-card"
      className={`${small && 'small-audio'} frosted-glass`}
      style={user.speaking ? { border: '2px solid var(--uvx-accent-color)' } : {}}
    >
      <div className="audio-icon">
        {user.audio ?
          <MicOn color="white" width={30}/> :
          <MicOff color="white" width={30}/>
        }
      </div>
      <span className="audio-display-name">
        {user.displayName}
      </span>
    </div>
  )
}