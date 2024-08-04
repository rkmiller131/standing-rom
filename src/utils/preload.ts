import { EnvironmentSelectionType } from '../hookstate-store/Types'

type SplashType = {
    [key in EnvironmentSelectionType]: string
}

// For the loading screen background splash - kept in /public for faster load times
export const splash: SplashType = {
    'Indoor Office': '/OfficeSplash.webp',
    'Outdoors': '/OutdoorSplash.webp',
    '': 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/loadingStill.JPG?v=1722473502361'
}

// For the environment selection parallax background cards
export const environments = [
    {
        id: 1,
        name: 'Outdoors',
        imgSrc: 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/outdoorEnvCard.png?v=1722462345138'
    },
    {
        id: 2,
        name: 'Indoor Office',
        imgSrc: 'https://cdn.glitch.global/c4f540ac-7f7c-41b2-ae89-9e2617351aa6/indoorEnvCard.png?v=1722462389853'
    }
];