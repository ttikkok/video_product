import configService from "./config.js";

// 请求方法
function requestType(type, url, params, baseUrl, resolve, reject) {
  let accesToken = uni.getStorageSync("token");
  let header = {};
  header["Lang"] = uni.getStorageSync('lang') || 'en';
  if (accesToken) {
    header.token = accesToken;
  }
  let baseVal = baseUrl || configService.baseApiOrg;
  if (params) {
    params = {
      ...params,
    };
  }
  uni.request({
    header: header,
    url: baseVal + url,
    method: type,
    data: params,
    timeout: 10000,
    success: (res) => {
      // if (res.data.code == 1003) {
      //   uni.showToast({
      //     title: res.data.message,
      //     icon: "none",
      //   });
      //   uni.removeStorageSync("token");
      //   uni.removeStorageSync("userInfo");
      //   uni.reLaunch({
      //     url: "/pages/login/index",
      //   });
      // }
      resolve(res.data);
    },
    fail: (res) => {
      if (res && res.errMsg) {
        let errMsg = res.errMsg;
        if (errMsg && errMsg.indexOf("timeout") > 0) {
          let errTxt = 'The request timed out, please try again later.';
          uni.showToast({
            title: errTxt,
            icon: "none",
          });
        }
      }
      reject(res);
    },
  });
}

const request = {
  get(url, params, baseUrl) {
    return new Promise((resolve, reject) => {
      requestType("get", url, params, baseUrl, resolve, reject);
    });
  },
  post(url, params, baseUrl) {
    return new Promise((resolve, reject) => {
      requestType("post", url, params, baseUrl, resolve, reject);
    });
  },
  delete(url, params, baseUrl) {
    return new Promise((resolve, reject) => {
      requestType("delete", url, params, baseUrl, resolve, reject);
    });
  },
  put(url, params, baseUrl) {
    return new Promise((resolve, reject) => {
      requestType("put", url, params, baseUrl, resolve, reject);
    });
  },
};

export default request;
