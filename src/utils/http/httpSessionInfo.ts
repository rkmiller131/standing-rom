import axios, { AxiosRequestConfig } from 'axios';

const API_BASE_URL = 'http://localhost:3001';


export async function getSessionInformation(code: number): Promise<any> {
  try {
    const config: AxiosRequestConfig = {
      method: 'get',
      url: `${API_BASE_URL}/sessions/room/${code}`,
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error('Error sending game code:', error);
    throw error;
  }
}
