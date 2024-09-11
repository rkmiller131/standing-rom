import { SoundConfig } from '../components/ui/game-setup/GameSetupScreen';
import { useGameState } from '../hookstate-store/GameState';
import { useSceneState } from '../hookstate-store/SceneState';
import { AvatarSelectionType, EnvironmentSelectionType } from '../hookstate-store/Types';

export default function useHookstateGetters() {
  const gameState = useGameState();
  const sceneState = useSceneState();

  // SCENE STATE
  const environmentLoaded = () => sceneState.environmentLoaded.get({ noproxy: true });
  const environmentSelected = () => sceneState.selectedEnvironment.get({ noproxy: true });
  const sceneLoaded = () => sceneState.sceneLoaded.get({ noproxy: true });
  const gameRunning = () => sceneState.gameRunning.get({ noproxy: true });
  const setGameRunning = (value: boolean) => {
    sceneState.gameRunning.set(value);
  };
  const getUserDevice = () => sceneState.device.get({ noproxy: true });
  const getSettingsReady = () => sceneState.sceneSettings.ready.get({ noproxy: true });
  const getMusic = () => sceneState.sceneSettings.music.get({ noproxy: true });
  const getSFX = () => sceneState.sceneSettings.sfx.get({ noproxy: true });
  const getAnnouncer = () => sceneState.sceneSettings.announcer.get({ noproxy: true });
  const getAllSoundsMuted = () => sceneState.sceneSettings.muteAllSound.get({ noproxy: true });
  const setGameConfigs = (avatar: AvatarSelectionType, environment: EnvironmentSelectionType, sound: SoundConfig) => {
    sceneState.sceneSettings.set(sound);
    sceneState.selectedAvatar.set(avatar);
    sceneState.selectedEnvironment.set(environment);
    sceneState.sceneSettings.ready.set(true);
  }

  // GAME STATE
  const gameOver = () => gameState.gameOver.get({ noproxy: true });
  const getMaxLeftArmAngle = () => gameState.score.maxLeftArmAngle.get({ noproxy: true });
  const getMaxRightArmAngle = () => gameState.score.maxRightArmAngle.get({ noproxy: true });
  const getPoppedBubbleCount = () => gameState.score.popped.get({ noproxy: true });
  const getTotalBubbleCount = () => gameState.score.totalBubbles.get({ noproxy: true });
  const getPoppedVelocities = () => {
    const right = gameState.score.poppedRightVelocities.get({ noproxy: true });
    const left = gameState.score.poppedLeftVelocities.get({ noproxy: true });
    return { right, left };
  };
  const getCurrentStreak = () => gameState.score.currentStreak.get({ noproxy: true });
  const getSideSpawned = () => {
    if (gameState.levels.length > 0) {
      const side = gameState.levels[0].sideSpawned.get({ noproxy: true });
      if (side === 'right' || side === 'crossR' || side === 'frontR') {
        return 'right';
      } else {
        return 'left';
      }
    }
    return null;
  };

  return {
    environmentLoaded,
    environmentSelected,
    sceneLoaded,
    gameRunning,
    setGameRunning,
    getUserDevice,
    gameOver,
    getMaxLeftArmAngle,
    getMaxRightArmAngle,
    getPoppedBubbleCount,
    getTotalBubbleCount,
    getPoppedVelocities,
    getCurrentStreak,
    getSideSpawned,
    getSettingsReady,
    getAllSoundsMuted,
    getMusic,
    getSFX,
    getAnnouncer,
    setGameConfigs
  };
}
