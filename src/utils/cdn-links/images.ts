import { EnvironmentSelectionType } from '../../hookstate-store/Types';

export const splash: { [key in EnvironmentSelectionType]: string } = {
  'Indoor Office': '/OfficeSplash.webp',
  Outdoors: '/OutdoorSplash.webp',
  '': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/genericLoadingSplash.JPG?v=1724091328417',
};

export const avatarCards = [
    {
        id: 1,
        name: 'Dennis',
        imgSrc: '/DennisHead.jpg',
        hoverImage: '/DennisPose.jpg',
    },
    {
        id: 2,
        name: 'Lillian',
        imgSrc: '/LillianHead.jpg',
        hoverImage: '/LillianPose.jpg'
    },
    {
        id: 3,
        name: 'Locked',
        imgSrc: '/lockedAvatar.png',
        hoverImage: '/lockedAvatarFull.webp'
    },
    {
        id: 4,
        name: 'Locked',
        imgSrc: '/lockedAvatar.png',
        hoverImage: '/lockedAvatarFull.webp'
    }
];

export const environmentCards = [
  {
    id: 1,
    name: 'Outdoors',
    imgSrc: '/outdoorEnvCard.webp',
  },
  {
    id: 2,
    name: 'Indoor Office',
    imgSrc: '/indoorEnvCard.webp',
  },
  {
    id: 3,
    name: 'Coming Soon',
    imgSrc: '/comingSoon.jpg',
  },
  {
    id: 4,
    name: 'Coming Soon',
    imgSrc: '/comingSoon.jpg',
  },
  {
    id: 5,
    name: 'Coming Soon',
    imgSrc: '/comingSoon.jpg',
  },
  {
    id: 6,
    name: 'Coming Soon',
    imgSrc: '/comingSoon.jpg',
  },
  {
    id: 7,
    name: 'Coming Soon',
    imgSrc: '/comingSoon.jpg',
  },
  {
    id: 8,
    name: 'Coming Soon',
    imgSrc: '/comingSoon.jpg',
  },
  {
    id: 9,
    name: 'Coming Soon',
    imgSrc: '/comingSoon.jpg',
  },
  {
    id: 10,
    name: 'Coming Soon',
    imgSrc: '/comingSoon.jpg',
  },
];

export const calibrationIcons = {
  calibrating:
    'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/yellowCalibIcon%20(1).png?v=1724093926378',
  calibrated:
    'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/blueCalibIcon%20(1).png?v=1724093823488',
};

export const uvxLogos: { [key: string]: string } = {
  uvxColor:
    'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/uvxLogoColor%20(1).png?v=1724094223669',
  uvxWhite:
    'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/uvxLogoWhite.png?v=1724094162122',
};

export const badgesIcons = {
  bronzeMedal:
    'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/bronzeMedal.webp?v=1724098067340',
  silverMedal:
    'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/silverMedal.webp?v=1724098064685',
  goldMedal:
    'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/goldMedal.webp?v=1724098061765',
};
