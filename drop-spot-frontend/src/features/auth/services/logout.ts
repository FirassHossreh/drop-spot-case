import apiClient from '../../../services/axios-client';
export async function logoutService() {
  try {
    const response = await apiClient.post(`auth/logout`);
    return response;
  } catch (error: any) {
    return error;
  }
}
