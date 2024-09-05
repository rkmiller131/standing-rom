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

export default function VideoAudioCard({ user }: { user: User }) {
  return user.video ? (
    <div id="video-card" className="frosted-glass" style={{ backgroundImage: `url(${user.fakeVideo})`, border: user.speaking ? '2px solid var(--uvx-accent-color)' : '' }}>
      <span className="video-display-name">
        {user.displayName}
      </span>
      {user.audio ?
        <MicOn color="white" width={20}/> :
        <MicOff color="white" width={20}/>
      }
    </div>
  ) : (
    <div id="audio-card" className="frosted-glass">
      <div className="audio-icon" style={user.speaking ? { border: '2px solid var(--uvx-accent-color)' } : {}}>
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