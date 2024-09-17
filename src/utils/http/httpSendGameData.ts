import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface GameData {
  datePlayed: string;
  percentCompletion: number;
  bubblesPopped: number;
  rightAvgVelocity: string;
  leftAvgVelocity: string;
  maxLeftAngle: number;
  maxRightAngle: number;
  completed: boolean;
  achievements: {
    precisionPopper: boolean;
    speedDemon: boolean;
    bubbleBurstBonanza: boolean;
  };
}

export const sendResults = async (data: GameData): Promise<any> => {
  try {
    const config: AxiosRequestConfig = {
      method: 'post',
      url: `${API_BASE_URL}/session/submitResult`,
      headers: { 'Content-Type': 'application/json' },
      data,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error sending game data:', error);
    throw error;
  }
};
