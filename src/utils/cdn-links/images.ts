import { EnvironmentSelectionType } from '../../hookstate-store/Types'

// For the loading screen background splash
export const splash: { [key in EnvironmentSelectionType]: string } = {
    'Indoor Office': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/OfficeSplash%20(2).webp?v=1724090985294',
    'Outdoors': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/OutdoorSplash%20(1).webp?v=1724091199820',
    '': 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/genericLoadingSplash.JPG?v=1724091328417' // generic loading in case of error
}

// For the environment selection parallax background cards
export const environmentCards = [
    {
        id: 1,
        name: 'Outdoors', // The hover text content
        imgSrc: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/outdoorEnvCard.webp?v=1724091746123',
    },
    {
        id: 2,
        name: 'Indoor Office',
        imgSrc: 'https://cdn.glitch.global/155b1488-cef3-43d5-92c7-da25735e6c95/indoorEnvCard.webp?v=1724091747127',
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