
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import http from './http/http.js'
import configService from "@/http/config.js";
Vue.prototype.$http = http
import store from '@/store';
Vue.prototype.$store = store;
// 通过 install 函数挂载 Vue 原型方法
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
import util from '@/utils/util'
Vue.prototype.$util = util;

//引入websocket文件
// import wsRequest from '@/utils/websocket.js'
//开启websocket
// let websocketOne = new wsRequest(configService.wss + "ws1", 5000)
// let websocketTwo = new wsRequest(configService.wss + "ws2", 5000)
//挂载到全局
// Vue.prototype.$socketOne = websocketOne
// Vue.prototype.$socketTwo = websocketTwo

// 多语言
import messages from './locale/index'
let i18nConfig = {
  silentTranslationWarn: true,
	locale: uni.getStorageSync('lang') || 'en',
	messages
}
// console.log(uni.getStorageSync('lang') )
// uni.setStorageSync('lang', 'en')
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
export const i18n = new VueI18n(i18nConfig)

import TopBar from '@/components/top-bar/index.vue'
Vue.component('top-bar', TopBar)

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    i18n,
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif