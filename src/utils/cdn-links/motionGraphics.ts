// BASE BACKGROUND ANIMATION - THE ONE THAT LOOKS LIKE MOCAP DATA
export const baseBGAnimation = 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/BaseBGAnimation.mp4?v=1724098592130';

// ENVIRONMENT SELECTION SETUP SCREEN - WHITE VERSION OF BASE BG ANIMATION
export const setupBG = 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/WhiteBGAnimation.mp4?v=1724098719370';

export type H2PlayCard = {
  id: number;
  graphic: string;
}
// HOW TO PLAY SCREEN
export const h2Play = [
  {
    id: 0, // lateral raise graphic
    graphic: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/howToPlayAbduction.webm?v=1725386211408'
  },
  {
    id: 1, // frontal raise graphic
    graphic: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/howToPlayFlexion.webm?v=1725386216617'
  },
  {
    id: 2, // cross body graphic
    graphic: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/howToPlayAdduction.webm?v=1725386214468'
  }
];

// BUBBLE ANIMATIONS
export const bubbleAnimations: { [key: string]: string } = {
  idle: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/BubbleIdle.webm?v=1724098827602',
  popping: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/SingleBubblePopAnim.webm?v=1724098946056',
}

// COUNTDOWN SCREEN
export const countdownScreen = 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/countdownNoAudio.webm?v=1724099159345';

// LOADING SCREEN
export const loadingSplashAnimation = 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/BottomLoadingSplashAnimation.webm?v=1724099280553';

// SLIDING INFO
export const slidingInfoBG = 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/SlidingInfoBGAnimation.webm?v=1724099325758';

// SCORE DISPLAY
export const scoreDisplay: { [key: string]: string } = {
  'fire': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/fireCropped.webm?v=1724100348064',
}
