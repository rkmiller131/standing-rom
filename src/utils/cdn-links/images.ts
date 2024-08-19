import { EnvironmentSelectionType } from '../../hookstate-store/Types'

// For the loading screen background splash - kept in /public for faster load times
export const splash: { [key in EnvironmentSelectionType]: string } = {
    'Indoor Office': '/OfficeSplash.webp',
    'Outdoors': '/OutdoorSplash.webp',
    '': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/genericLoadingSplash.JPG?v=1724091328417' // generic loading in case of error
}

// For the environment selection parallax background cards
export const environmentCards = [
    {
        id: 1,
        name: 'Outdoors', // The hover text content
        imgSrc: '/outdoorEnvCard.webp',
    },
    {
        id: 2,
        name: 'Indoor Office',
        imgSrc: '/indoorEnvCard.webp',
    }
];

// For the mocap webcamera feed
export const calibrationIcons = {
    calibrating: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/yellowCalibIcon%20(1).png?v=1724093926378',
    calibrated: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/blueCalibIcon%20(1).png?v=1724093823488'
}

export const uvxLogos: { [key: string]: string } = {
    'uvxColor': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/uvxLogoColor%20(1).png?v=1724094223669',
    'uvxWhite': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/uvxLogoWhite.png?v=1724094162122'
}

export const badgesIcons = {
    bronzeMedal: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/bronzeMedal.webp?v=1724098067340',
    silverMedal: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/silverMedal.webp?v=1724098064685',
    goldMedal: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/goldMedal.webp?v=1724098061765'
}