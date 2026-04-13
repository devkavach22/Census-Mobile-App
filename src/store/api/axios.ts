import axios from 'axios';
import Config from 'react-native-config';
import { getStorageData, STORAGE_KEYS } from '../../utils/storage';

export const api = axios.create({
  baseURL: Config.BASE_URL,
  timeout: 20000,
});

api.interceptors.request.use(
  async config => {
    const token = await getStorageData(STORAGE_KEYS.TOKEN);
    console.log('Config.BASE_URL=====>', Config.BASE_URL);
    console.log('TOKEN=====>', token);
    if (token) {
      config.headers.Authorization = token;
    }

    return config;
  },
  error => Promise.reject(error),
);

// Response Interceptor (Optional)
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Unauthorized - logout user');
    }
    return Promise.reject(error);
  },
);
