import axios from 'axios';
import Cookie from 'js-cookie';

// const baseURL = "http://localhost:3002/api/v1/admin";
// const baseURL = "http://192.168.100.59:3002/api/v1/admin";
const baseURL = process.env.REACT_APP_API_URL;
console.log(baseURL);

// const timeout = 16000;

const token = localStorage.getItem('token');
// let refreshToken = Cookie.get('refreshToken');

const instance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Content-Type': 'multipart/form-data',
  },
});

instance.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// function refreshTokenFunc() {
//   return instance.post("/token/refresh_token", {
//     merchant_name: localStorage.getItem("merchant_name"),
//     refreshToken,
//   });
// }

// instance.setToken = (tokenParam) => {
//   instance.defaults.headers["Authorization"] = `Bearer ${tokenParam}`;
//   Cookie.set("token", tokenParam);
// };

// let isRefreshing = false;
// let requests = [];

// instance.interceptors.response.use(undefined, async (err) => {
//   const error = err.response;
//   if (error && error.data.code === 401) {
//     const config = error.config;
//     // alert(error.data.data.message);
//     if (!isRefreshing) {
//       isRefreshing = true;
//       return refreshTokenFunc()
//         .then((res) => {
//           const { token: tokenParam, refreshToken: refToken } = res.data.data;

//           Cookie.set("refreshToken", refToken);
//           instance.setToken(tokenParam);
//           requests.forEach((cb) => cb(tokenParam));
//           requests = [];
//           window.location.reload();
//           return instance(config);
//         })
//         .catch(async (res) => {
//           console.error("RefreshToken Error =>", res);
//           var token1 = Cookie.get("token") ? await Cookie.get("token") : "";
//           requests.forEach((cb) => cb(token1));
//         })
//         .finally(() => {
//           isRefreshing = false;
//         });
//     } else {
//       return new Promise((resolve) => {
//         requests.push((token) => {
//           config.baseURL = baseURL;
//           config.headers["Authorization"] = `Bearer ${token}`;
//           resolve(instance(config));
//         });
//       });
//     }
//   } else {
//     return error;
//   }
// });

export default instance;
