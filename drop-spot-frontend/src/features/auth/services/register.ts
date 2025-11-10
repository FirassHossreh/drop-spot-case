import apiClient from '../../../services/axios-client';
export async function registerService(data: any) {
  try {
    const response = await apiClient.post(`auth/register`, data);
    return response.data;
  } catch (error: any) {
    return error;
  }
}
