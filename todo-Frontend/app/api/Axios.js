import axios from 'axios';

export const Axios = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3001'
});

