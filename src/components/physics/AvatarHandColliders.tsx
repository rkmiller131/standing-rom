import { VRM } from '@pixiv/three-vrm';
import HandCollider from './HandCollider';

interface AvatarHandColliderProps {
  avatar: React.RefObject<VRM>;
}

export default function AvatarHandColliders({ avatar }: AvatarHandColliderProps) {
  return (
    <>
      <HandCollider avatar={avatar} handedness='right'/>
      <HandCollider avatar={avatar} handedness='left'/>
    </>
  )
}