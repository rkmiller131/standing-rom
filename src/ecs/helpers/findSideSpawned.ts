enum SideSpawned {
  Right = 'right',
  Left = 'left',
  FrontRight = 'frontR',
  FrontLeft = 'frontL',
  CrossRight = 'crossR',
  CrossLeft = 'crossL',
}

/**
 * Finds the side from which bubbles are spawned based on the index of the current rep.
 * @param {number} index - The index of the current bubble in the set.
 * @returns {'right' | 'left' | 'frontR' | 'frontL' | 'crossR' | 'crossL'} The side of the Avatar from which bubbles are spawned.
 */
export default function findSideSpawned(index: number): SideSpawned {
  switch (index % 6) {
    case 0:
      // lateral raise on the right
      return SideSpawned.Right;
    case 1:
      // lateral raise on the left
      return SideSpawned.Left;
    case 2:
      // frontal raise on the right
      return SideSpawned.FrontRight;
    case 3:
      // frontal raise on the left
      return SideSpawned.FrontLeft;
    case 4:
      // linear crossbody path from right hand to left shoulder
      return SideSpawned.CrossRight;
    case 5:
      // linear crossbody path from left hand to right shoulder
      return SideSpawned.CrossLeft;
    default:
      return SideSpawned.Right;
  }
}
