// Choice hovers and select (buttons, game UI interactions)
export const uiInteractions: { [key: string]: string } = {
  choiceHover: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/UI_ChoiceHover.mp3?v=1722902822127',
  choiceSelect: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/UI_ChoiceSelect.mp3?v=1722902825876',
  choiceBack: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/UI_ChoiceBack.mp3?v=1725932608786',
};

// Based on the current score streak, the sound for popping will increase in intensity
export const bubblePopSounds: { [key: number]: string } = {
  0: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl1.mp3?v=1722966738930',
  1: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl2.mp3?v=1722966742615',
  2: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl3.mp3?v=1722966745932',
  3: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl4.mp3?v=1722966748808',
  4: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/bubblePopLvl5.mp3?v=1722966935678',
};

export const backgroundMusic: { [key: string]: string } = {
  IndoorOffice: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/OfficeNCS.mp3?v=1715028230989',
  Outdoors: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/outdoorBGMusicLayered1.mp3?v=1724366270546',
  OutdoorAmbience: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/OutdoorAmbience.mp3?v=1724774253836',
  IndoorAmbience: '',
};

export const gameOverSFX =
  'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/gameOverSFX.mp3?v=1722979032668';

export const announcer: { [key: string]: string } = {
  getCalibrated: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/okLetsGetCalibrated.mp3?v=1722981178811',
  getReady: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/getReady.mp3?v=1722981322450',
  countdown: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/countdown.mp3?v=1722978390256',
  r_lateralRaise: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/rightArmRaise.mp3?v=1722977906863',
  l_lateralRaise: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/nowToLeft.mp3?v=1722978163125',
  r_frontalRaise: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/rightArmInAFrontalRaise.mp3?v=1722978270639',
  l_frontalRaise: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/leftArmFrontalRaise.mp3?v=1722978300276',
  r_crossBody: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/rightArmToLeftShoulder.mp3?v=1722978334057',
  l_crossBody: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/leftCrossBodyStretch.mp3?v=1722978364244',
  perfectScore: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/flawlessVictory.mp3?v=1722978437302',
  greatScore: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/niceJob.mp3?v=1722978497532',
  goodScore: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/heyNotBad.mp3?v=1722978755948',
  badScore: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/itsOkYoullGetTheHang.mp3?v=1722978458576',
};
