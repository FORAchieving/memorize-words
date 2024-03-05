import axios from 'axios';
import {status} from './respons-status';
import message from 'antd/es/message'

const http = axios.create({
  timeout: 10000,
});

// 请求拦截器
http.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么：例如添加token
    // config.headers['Authorization'] = '你的token';
    return config;
  },
  error => {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 响应拦截器
http.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const res = response.data;
    const responseMessage = status[res.errorCode as keyof typeof status];
    const successCode = 0;
    // 根据业务处理回调
    if (responseMessage && res.errorCode !== successCode) {
      // 处理错误
      message.error({
        content: responseMessage,
      })
    } else {
      return res;
    }
  },
  error => {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

export default http;