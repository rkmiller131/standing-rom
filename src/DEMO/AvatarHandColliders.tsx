import { VRM } from '@pixiv/three-vrm';
import Hand from './Hand';

interface AvatarHandColliderProps {
  avatar: React.RefObject<VRM>;
}

export default function AvatarHandColliders({ avatar }: AvatarHandColliderProps) {
  return (
    <>
      <Hand avatar={avatar} handedness='right'/>
      <Hand avatar={avatar} handedness='left'/>
    </>
  )
}