import VideoAudioCard, { User } from './VideoAudioCard';

  // Just going to place some mock data here for now:
  const connectedUsers: User[] = [
    {
      id: 87894541,
      displayName: 'Care Giver 123',
      role: 'Spectator',
      video: false,
      audio: false,
      fakeVideo: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/stock3.JPG?v=1724094484381'
    },
    {
      id: 346597,
      displayName: 'Family Member2',
      role: 'Spectator',
      video: false,
      audio: true,
      fakeVideo: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/stock4.JPG?v=1724094486048',
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
      fakeVideo: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/stock2.JPG?v=1724094482319',
    },
    // {
    //   id: 37,
    //   displayName: 'Best Friend2',
    //   role: 'Spectator',
    //   video: true,
    //   audio: false,
    //   fakeVideo: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/stock2.JPG?v=1724094482319'
    // },
    // {
    //   id: 374444,
    //   displayName: 'Best Friend3',
    //   role: 'Spectator',
    //   video: true,
    //   audio: false,
    //   fakeVideo: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/stock2.JPG?v=1724094482319'
    // },
  ];

export default function LiveSpectators() {
  // going to have to retrieve a list of all connected people who have practitioner or spectator tags
  // Practitioner should always be at the top, if present.
  // Next at the top comes anyone with video and audio on.
  // Then comes those with just video,
  // Then comes those with just audio,
  // Then last displayed should be pure spectators with no audio or video
  // Map the current list of connected people to a reusable component that changes appearance depending on the actions enabled.
  // Until we get actual multiplayer setup, we'll just put toggled states (camera on/camera off, audio on/audio off, etc) and refactor later.

  // have a sort function that sorts by active audio/video connections
  const sortedUsers = sortUsers(connectedUsers);

  return (
    <div className="spectator-wrapper">
      {sortedUsers.map((user: User) =>
        <VideoAudioCard user={user} small={true} key={user.id}/>
      )}
    </div>
  )
}

// put in a utils folder later once this is all fully fleshed out; might have to refactor a bunch when
// we actually implement video/audio streaming
// This will sort in reverse order for more screen space - videos on bottom, audio, then no audio/no video on top
function sortUsers (users: User[]) {
  return users.sort((a, b) => {
    // Next in priority is users with both audio and video
    if (a.audio && a.video && b.audio && b.video) return 0;
    if (a.audio && a.video) return 1;
    if (b.audio && b.video) return -1;

    // Next in priority is users with just video
    if (a.video && !b.video) return 1;
    if (!a.video && b.video) return -1;

    // Next in priority is users with just audio
    if (a.audio && !b.audio) return 1;
    if (!a.audio && b.audio) return -1;

    // Default case: users without audio or video, render at the bottom
    return 0;
  });
};