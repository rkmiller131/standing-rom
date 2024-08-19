import VideoAudioCard from './VideoAudioCard';

import '../../../css/LiveSocials.css';

export interface User {
  id: number;
  displayName: string;
  role: 'Practitioner' | 'Spectator' | 'Patient';
  video: boolean;
  audio: boolean;
  fakeVideo: string;
  speaking?: boolean;
}

// // Just going to place some mock data here for now:
const connectedUsers: User[] = [
  {
    id: 87894541,
    displayName: 'Care Giver 123',
    role: 'Spectator',
    video: false,
    audio: false,
    fakeVideo: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/stock3.JPG?v=1723147763201'
  },
  {
    id: 654654,
    displayName: 'Dr. Tracy',
    role: 'Practitioner',
    video: true, // hard coded for now, depends on if streaming comes from client or server; third party tech like https://getstream.io/, from scratch, aws, etc.
    audio: true,
    speaking: true,
    fakeVideo: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/stock1.JPG?v=1723146768212'
  },
  {
    id: 346597,
    displayName: 'Family Member2',
    role: 'Spectator',
    video: false,
    audio: true,
    fakeVideo: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/stock4.JPG?v=1723147767759',
    speaking: true
  },
  // {
  //   id: 346597,
  //   displayName: 'Family Member3',
  //   role: 'Spectator',
  //   video: false,
  //   audio: true,
  //   fakeVideo: '',
  //   speaking: false
  // },
  {
    id: 3497,
    displayName: 'Best Friend',
    role: 'Spectator',
    video: true,
    audio: false,
    fakeVideo: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/stock2.JPG?v=1723146805247'
  }
];


export default function LiveSocials() {
  // going to have to retrieve a list of all connected people who have practitioner or spectator tags
  // Practitioner should always be at the top, if present.
  // Next at the top comes anyone with video and audio on.
  // Then comes those with just video,
  // Then comes those with just audio,
  // Then last displayed should be pure spectators with no audio or video
  // Map the current list of connected people to a reusable component that changes appearance depending on the actions enabled.
  // Until we get actual multiplayer setup, we'll just put toggled states (camera on/camera off, audio on/audio off, etc) and refactor later.

  // have a sort function that sorts practitioner always at the top, but then also sorts by active audio/video connections
  const sortedUsers = sortUsers(connectedUsers);
  const practitioner = sortedUsers.find((user: User) => user.role === 'Practitioner');

  return (
    <div id="live-socials-screen">
      {practitioner && (
        <div className="practitioner-wrapper">
          <VideoAudioCard user={practitioner} key={practitioner.id}/>
        </div>
      )}
      <div className="spectator-wrapper">
        {sortedUsers.filter((user: User) => user.role !== 'Practitioner').map((user: User) =>
          <VideoAudioCard user={user} key={user.id}/>
        )}
      </div>
    </div>
  )
}

// put in a utils folder later once this is all fully fleshed out; might have to refactor a bunch when
// we actually implement video/audio streaming
function sortUsers (users: User[]) {
  return users.sort((a, b) => {
    // Place practitioners at the top
    if (a.role === 'Practitioner' && b.role !== 'Practitioner') return -1;
    if (b.role === 'Practitioner' && a.role !== 'Practitioner') return 1;

    // Next in priority is users with both audio and video
    if (a.audio && a.video && b.audio && b.video) return 0;
    if (a.audio && a.video) return -1;
    if (b.audio && b.video) return 1;

    // Next in priority is users with just video
    if (a.video && !b.video) return -1;
    if (!a.video && b.video) return 1;

    // Next in priority is users with just audio
    if (a.audio && !b.audio) return -1;
    if (!a.audio && b.audio) return 1;

    // Default case: users without audio or video, render at the bottom
    return 0;
  });
};
