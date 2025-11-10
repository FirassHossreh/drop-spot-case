import apiClient from '../../../services/axios-client';

export async function deleteDrop(id: string): Promise<boolean> {
  try {
    await apiClient.delete(`/admin/drops/${id}`);
    return true;
  } catch (error: any) {
    return false;
  }
}
