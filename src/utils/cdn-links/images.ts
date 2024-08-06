import { EnvironmentSelectionType } from '../../hookstate-store/Types'

// For the loading screen background splash - kept in /public for faster load times
export const splash: { [key in EnvironmentSelectionType]: string } = {
    'Indoor Office': '/OfficeSplash.webp',
    'Outdoors': '/OutdoorSplash.webp',
    '': 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/loadingStill.JPG?v=1722473502361' // generic loading in case of error
}

// For the environment selection parallax background cards
export const environmentCards = [
    {
        id: 1,
        name: 'Outdoors', // The hover text content
        imgSrc: 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/outdoorEnvCard.png?v=1722462345138'
    },
    {
        id: 2,
        name: 'Indoor Office',
        imgSrc: 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/indoorEnvCard.png?v=1722462389853'
    }
];

// For the mocap webcamera feed
export const calibrationIcons = {
    calibrating: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/yellowCalibIcon.png?v=1722552935123',
    calibrated: 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/blueCalibIcon.png?v=1722553836596'
}

export const uvxLogos: { [key: string]: string } = {
    'uvxColor': 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/uvxLogoColor.png?v=1722519813838',
    'uvxWhite': 'https://cdn.glitch.global/22bbb2b4-7775-42b2-9c78-4b39e4d505e9/uvx-logoWhite.png?v=1722535954923'
}
