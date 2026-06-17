import configService from "./config.js";

function waitForLogin(skipLoginCheck = false) {
  if (skipLoginCheck) {
    return Promise.resolve();
  }
  const app = getApp();
  if (app && app.globalData && typeof app.globalData.isLoginResolved === 'function') {
    const isResolved = app.globalData.isLoginResolved();
    if (isResolved) {
      return Promise.resolve();
    }
    if (app.globalData.getLoginPromise) {
      const loginPromise = app.globalData.getLoginPromise();
      if (loginPromise) {
        return loginPromise;
      }
    }
  }
  return Promise.resolve();
}

function requestType(type, url, params, baseUrl, resolve, reject, skipLoginCheck = false) {
  waitForLogin(skipLoginCheck).then(() => {
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
  }).catch(() => {
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
  });
}

const request = {
  get(url, params, baseUrl, skipLoginCheck = false) {
    return new Promise((resolve, reject) => {
      requestType("get", url, params, baseUrl, resolve, reject, skipLoginCheck);
    });
  },
  post(url, params, baseUrl, skipLoginCheck = false) {
    return new Promise((resolve, reject) => {
      requestType("post", url, params, baseUrl, resolve, reject, skipLoginCheck);
    });
  },
  delete(url, params, baseUrl, skipLoginCheck = false) {
    return new Promise((resolve, reject) => {
      requestType("delete", url, params, baseUrl, resolve, reject, skipLoginCheck);
    });
  },
  put(url, params, baseUrl, skipLoginCheck = false) {
    return new Promise((resolve, reject) => {
      requestType("put", url, params, baseUrl, resolve, reject, skipLoginCheck);
    });
  },
};

export default request;
