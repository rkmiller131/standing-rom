import { VRM } from '@pixiv/three-vrm';
import HandCollider from './HandCollider';

interface AvatarHandColliderProps {
  avatar: React.RefObject<VRM>;
}

export default function AvatarHandColliders({ avatar }: AvatarHandColliderProps) {
  console.log('~~ Avatar hand colliders rendered: putting sphere colliders on avatar hands')
  return (
    <>
      <HandCollider avatar={avatar} handedness='right'/>
      <HandCollider avatar={avatar} handedness='left'/>
    </>
  )
}