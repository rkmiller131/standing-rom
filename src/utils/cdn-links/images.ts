import { EnvironmentSelectionType } from '../../hookstate-store/Types';

export const splash: { [key in EnvironmentSelectionType]: string } = {
  'Indoor Office': '/OfficeSplash.webp',
  Outdoors: '/OutdoorSplash.webp',
  '': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/genericLoadingSplash.JPG?v=1724091328417',
};

// Temporary. When we actually have these assets and they are potentially unlockable, then we
// can retrieve the actual asset splash and put a filter gradient over it for locked state.
export const lockedIcons = {
  environment: '/OfficeSplash.webp',
  avatar: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/lockedAvatarIcon.png?v=1725995275658'
}

export const calibrationIcons = {
  calibrating: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/yellowCalibIcon%20(1).png?v=1724093926378',
  calibrated: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/blueCalibIcon%20(1).png?v=1724093823488',
};

export const uvxLogos: { [key: string]: string } = {
  uvxColor: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/uvxLogoColor%20(1).png?v=1724094223669',
  uvxWhite: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/uvxLogoWhite.png?v=1724094162122',
};

export const badgesIcons = {
  bronzeMedal: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/bronzeMedal.webp?v=1724098067340',
  silverMedal: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/silverMedal.webp?v=1724098064685',
  goldMedal: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/goldMedal.webp?v=1724098061765',
};
