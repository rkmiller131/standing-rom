import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export interface RoomCode {
  code: number;
}

export async function getSessionInformation(data: RoomCode): Promise<any> {
  try {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `${API_BASE_URL}/sessions/room/${data.code}`,
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error sending game code:', error);
    throw error;
  }
}
