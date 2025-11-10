import axios from 'axios';
import toast from 'react-hot-toast';
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => {
    toast.success(response.data.message);
    return response;
  },
  (error) => {
    toast.error(error.response.data.message);
    return Promise.reject(error);
  }
);

export default apiClient;
