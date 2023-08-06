import axios from 'axios';

export const requestApi = (endpoint: string, method: string, body = [], responseType = 'json') => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };

  const instance = axios.create({ headers });
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;
      console.log('Access Token Expired');
      if (error.response && error.response.status === 419) {
        try {
          console.log('call refresh token api !');
          const result = await instance.post('http://localhost:8080/auth/refresh-token', {
            refresh_token: localStorage.getItem('REFRESH_TOKEN'),
          });
          const { access_token, refresh_token } = result.data;
          console.log('data', result);
          localStorage.setItem('ACCESS_TOKEN', access_token);
          localStorage.setItem('REFRESH_TOKEN', refresh_token);
          originalConfig.headers['Authorization'] = `Bearer ${access_token}`;
          // return  instance(originalConfig ) để Authorization có chuỗi accessToken mới
          return instance(originalConfig);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('REFRESH_TOKEN');
            window.location.href = '/login';
            console.log('refresh token expired !');
          }
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
  );
  return instance.request({
    method: method,
    url: `http://localhost:8080${endpoint}`,
    data: body,
    responseType: responseType as any,
  });
};
export const requestApiFormData = (endpoint: string, method: string, body = new FormData(), responseType = 'json') => {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'multipart/form-data',
    'Access-Control-Allow-Origin': '*',
  };

  const instance = axios.create({ headers });
  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('ACCESS_TOKEN');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalConfig = error.config;
      console.log('Access Token Expired');
      if (error.response && error.response.status === 419) {
        try {
          console.log('call refresh token api !');
          const result = await instance.post('http://localhost:8080/auth/refresh-token', {
            refresh_token: localStorage.getItem('REFRESH_TOKEN'),
          });
          const { access_token, refresh_token } = result.data;
          console.log('data', result);
          localStorage.setItem('ACCESS_TOKEN', access_token);
          localStorage.setItem('REFRESH_TOKEN', refresh_token);
          originalConfig.headers['Authorization'] = `Bearer ${access_token}`;
          // return  instance(originalConfig ) để Authorization có chuỗi accessToken mới
          return instance(originalConfig);
        } catch (error) {
          if (error.response && error.response.status === 400) {
            localStorage.removeItem('ACCESS_TOKEN');
            localStorage.removeItem('REFRESH_TOKEN');
            window.location.href = '/login';
            console.log('refresh token expired !');
          }
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    },
  );
  return instance.request({
    method: method,
    url: `http://localhost:8080${endpoint}`,
    data: body,
    responseType: responseType as any,
  });
};
