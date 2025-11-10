import apiClient from '../../../services/axios-client';

export async function updateDrop(id: string, data: any) {
  try {
    const response = await apiClient.put(`/admin/drops/${id}`, data);
    return response.data;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}
