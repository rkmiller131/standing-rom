import MicOff from './icons/MicOff';
import MicOn from './icons/MicOn';
import { User } from './LiveSocials';

export default function VideoAudioCard({ user }: { user: User }) {
  return user.video ? (
    <div id="video-card" style={{ backgroundImage: `url(${user.fakeVideo})`, border: user.speaking ? '2px solid white' : '' }}>
      <span className="video-display-name">
        {user.displayName}
      </span>
      {user.audio ?
        <MicOn color="white" width={20}/> :
        <MicOff color="white" width={20}/>
      }
    </div>
  ) : (
    <div id="audio-card">
      <div className="audio-icon" style={user.speaking ? { border: '2px solid white' } : {}}>
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