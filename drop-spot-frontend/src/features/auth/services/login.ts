import apiClient from '../../../services/axios-client';
export async function loginService(data: any) {
  try {
    const response = await apiClient.post(`auth/login`, data);
    return response.data;
  } catch (error: any) {
    return error;
  }
}
