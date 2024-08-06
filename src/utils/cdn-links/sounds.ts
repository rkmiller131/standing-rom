// Choice hovers and select (buttons, game UI interactions)
export const uiInteractions: { [key: string]: string } = {
  'choiceHover': 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/UI_ChoiceHover.mp3?v=1722902822127',
  'choiceSelect': 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/UI_ChoiceSelect.mp3?v=1722902825876'
}

// Based on the current score streak, the sound for popping will increase in intensity
export const bubblePopSounds: { [key: number]: string } = {
  0: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl1.mp3?v=1722966738930',
  1: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl2.mp3?v=1722966742615',
  2: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl3.mp3?v=1722966745932',
  3: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl4.mp3?v=1722966748808',
  4: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl5.mp3?v=1722966935678'
}

export const backgroundMusic: { [key: string]: string } = {
  'IndoorOffice': 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/OfficeNCS.mp3?v=1715028230989',
  'Outdoors': 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/OutdoorBGMusic.mp3?v=1716583481676',
}