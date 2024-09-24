import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface GameData {
  code: number;
  results: {
    bubblesPopped: number;
    rightAvgVelocity: number;
    leftAvgVelocity: number;
    maxLeftAngle: number;
    maxRightAngle: number;
  };
  _id?: string;
}

export const sendResults = async (data: GameData): Promise<unknown> => {
  const workoutId = data._id;
  const postData: GameData = {
    code: data.code,
    results: data.results,
  };

  try {
    const config: AxiosRequestConfig = {
      method: 'patch',
      url: `${API_BASE_URL}/sessions/workout/${workoutId}`,
      headers: { 'Content-Type': 'application/json' },
      data: postData,
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error sending game data:', error);
    throw error;
  }
};
