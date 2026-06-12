<script>
	// import { getUserInfo } from "@/api/public";
	import config from "@/http/config";
	import { register_login } from "@/api/home.js";
	import { getRealDeviceId } from "@/common/device.js";
	
	let loginPromise = null
	let loginResolved = false
	
	export default {
		onLaunch: function() {
			// #ifdef APP-PLUS
			// 禁用HTML5+ Runtime版本检查
			if (plus && plus.runtime && typeof plus.runtime.setRuntimeVersionCheck === 'function') {
				plus.runtime.setRuntimeVersionCheck(false);
			}
			// #endif
			this.autoLogin()
			this.setPageTitle()
		},
		globalData: {
			getLoginPromise: function() {
				return loginPromise
			},
			isLoginResolved: function() {
				return loginResolved
			}
		},
		onShow: function() {
			// #ifdef APP-PLUS
			// 禁用HTML5+ Runtime版本检查
			if (plus && plus.runtime && typeof plus.runtime.setRuntimeVersionCheck === 'function') {
				plus.runtime.setRuntimeVersionCheck(false);
			}
			// #endif
			this.setPageTitle()
			// uni.request({  
			// 	url: config.baseApiOrg + 'app/index/logo', // url地址  
			// 	method: 'GET',
			// 	timeout: 5000, // 设置超时时间为5000毫秒（5秒）  
			// 	success: (res) => {  
			// 		// 请求成功时的处理
			// 		// console.log('请求成功', res);  
			// 	},  
			// 	fail: (err) => {  
			// 		// 请求失败时的处理  
			// 		// 跳转到指定页面 
			// 		uni.reLaunch({
			// 			url: '/pages/update/index'
			// 		}); 
			// 		// if (err.errMsg === 'request:fail timeout') {  
			// 		// 	// 检查是否是超时错误  
			// 		// } else {
			// 		// 	// 其他错误处理  
			// 		// 	// console.error('请求失败', err);  
			// 		// }  
			// 	}  
			// });
			// console.log('App Show')
			// getUserInfo().then(res => {
			// 	if (res.code == 200 && res.data) {
			// 		let orgUserInfo = JSON.stringify(res.data.userinfo);
			// 		uni.setStorageSync('userInfo', orgUserInfo);
			// 	}
			// })
			// let accesToken = uni.getStorageSync('token');
			// if (accesToken) {
      //   // 获取用户登录后的信息
			// 	getUserInfo().then(res => {
			// 		if (res.code == 200 && res.data) {
			// 			let orgUserInfo = JSON.stringify(res.data);
			// 			uni.setStorageSync('userInfo', orgUserInfo);
			// 		}
			// 	})
			// }
		},
		onHide: function() {
			// console.log('App Hide')
		},
		methods: {
			setPageTitle() {
				//#ifdef H5
				if (typeof window !== 'undefined' && window.document) {
					window.document.title = '视频平台'
				}
				//#endif
			},
			autoLogin() {
				loginPromise = new Promise((resolve, reject) => {
					// 检查是否已经登录成功，如果有token则不需要重复登录
					let token = uni.getStorageSync('token')
					let userinfo = uni.getStorageSync('userinfo')
					
					if (token && userinfo) {
						console.log('已经登录成功，无需重复登录')
						loginResolved = true
						resolve({ token, userinfo })
						return
					}
					
					// 获取真实设备ID
					getRealDeviceId().then(deviceId => {
						console.log('获取到设备ID:', deviceId)
						register_login({ device_id: deviceId }).then(res => {
							loginResolved = true
							if (res && res.code === 1 && res.data) {
								if (res.data.userinfo) {
									uni.setStorageSync('userinfo', JSON.stringify(res.data.userinfo))
								}
								if (res.data.token) {
									uni.setStorageSync('token', res.data.token)
								}
							}
							resolve(res)
						}).catch(err => {
							loginResolved = true
							console.error('登录失败', err)
							reject(err)
						})
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	// @import "uview-ui/theme.scss";
	// @import "uview-ui/index.scss";
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/theme.scss";
	@import "@/uni_modules/uview-ui/index.scss";
	@import '@/uni_modules/uni-scss/index.scss';
	/* 引入free样式库 */
	@import url("@/common/main.css");
	/* 引入全局样式库 */
	@import url("@/common/common.css");
	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';
	// 设置整个项目的背景色
	// page {
	// 	background-color: #f5f5f5;
	// }
	/* #endif */
	/* 移除全局uni-text样式，避免影响文字换行 */
	/* uni-text {
		white-space: nowrap !important;
	} */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	.uni-tabbar {
		.uni-tabbar__item {
			.uni-tabbar__bd {
				// width: 100%;
				height: auto !important;
			}
			.uni-tabbar__label {
				// overflow: hidden;
				// text-overflow: ellipsis;
				// white-space: nowrap;
				// width: 95%;
				height: 46rpx;
				line-height: 20rpx !important;
				display: flex;
				align-items: center;
				// text-align: center;
			}
		}
	}
</style>
