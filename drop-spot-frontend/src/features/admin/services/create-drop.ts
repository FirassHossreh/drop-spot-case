import apiClient from '../../../services/axios-client';

export async function createDrop(data: any) {
  try {
    const response = await apiClient.post('/admin/drops', data);
    return response.data;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}
