import axios from 'axios';
import {Platform} from 'react-native';

const LOCALHOST =
  Platform.OS === 'ios' ? 'http://127.0.0.1' : 'http://10.0.2.2';

const api = axios.create({
  baseURL: `${LOCALHOST}:3333`,
});

export default api;
