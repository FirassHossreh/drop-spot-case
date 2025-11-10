import apiClient from '../../../services/axios-client';

export async function getAllDrops() {
  try {
    const response = await apiClient.get('/admin/drops');
    return response.data;
  } catch (error: any) {
    return [];
  }
}
