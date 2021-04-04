import axios from 'axios';
import {Platform} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const LOCALHOST =
  Platform.OS === 'ios' ? 'http://127.0.0.1' : 'http://10.0.2.2';

const api = axios.create({
  baseURL: `${LOCALHOST}:3333`,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
export default api;
