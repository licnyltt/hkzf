import axios from 'axios'
import { BASE_URL } from './url.js'

import { getToken, removeToken } from './token'

const API = axios.create({

  baseURL: BASE_URL

});


// Add a request interceptor
API.interceptors.request.use(function (config) {
  const { url } = config
  if (url.startsWith('/user') && !url.startsWith('/user/registered') && !url.startsWith('/user/login')) {
    config.headers.authorization = getToken()
  }

  // Do something before request is sent
  return config;
}, function (error) {

  // Do something with request error
  return Promise.reject(error);
});


// Add a response interceptor
API.interceptors.response.use(function (response) {
  console.log('response', response)
  if (response.data.status === 400) {
    removeToken()
  }

  // Do something with response data
  return response;
}, function (error) {

  // Do something with response error
  return Promise.reject(error);
});

export { API }




