import VideoAudioCard from '../VideoAudioCard';

type Role = 'Practitioner' | 'Spectator' | 'Patient';

export default function PractitionerFeed () {
  // eventually have live stream integration, hopefully getting a user similar to this shape:
  const practitioner = {
    id: 654654,
    displayName: 'Dr. Tracy',
    role: 'Practitioner' as Role,
    video: true, // hard coded for now, depends on if streaming comes from client or server; third party tech like https://getstream.io/, from scratch, aws, etc.
    audio: true,
    speaking: true,
    fakeVideo: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/stock1.JPG?v=1724094480243'
  }

  return (
      <VideoAudioCard user={practitioner}/>
  )
}