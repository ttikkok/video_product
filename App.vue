<script>
	// import { getUserInfo } from "@/api/public";
	import config from "@/http/config";
	import { register_login, UserApi_get_user_info } from "@/api/home.js";
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
			this.updateUserInfo()
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
			updateUserInfo() {
				let token = uni.getStorageSync('token')
				if (token) {
					UserApi_get_user_info().then(res => {
						if (res && res.code === 1 && res.data) {
							if (res.data.userinfo) {
								uni.setStorageSync('userinfo', JSON.stringify(res.data.userinfo))
							}
							if (res.data.token) {
								uni.setStorageSync('token', res.data.token)
							}
							console.log('用户信息更新成功')
						}
					}).catch(err => {
						console.error('更新用户信息失败', err)
					})
				}
			},
			autoLogin() {
				loginPromise = new Promise((resolve, reject) => {
					let token = uni.getStorageSync('token')
					let userinfo = uni.getStorageSync('userinfo')
					
					if (token && userinfo) {
						console.log('已经登录成功，无需重复登录')
						loginResolved = true
						resolve({ token, userinfo })
						return
					}
					
					getRealDeviceId().then(deviceId => {
						console.log('获取到设备ID:', deviceId)
						
						if (!deviceId) {
							deviceId = uni.getStorageSync('last_device_id')
						}
						
						if (!deviceId) {
							deviceId = 'TEMP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
							console.log('设备ID获取失败，使用临时ID:', deviceId)
						}
						
						uni.setStorageSync('last_device_id', deviceId)
						
						register_login({ device_id: deviceId }).then(res => {
							loginResolved = true
							if (res && res.code === 1 && res.data) {
								if (res.data.userinfo) {
									uni.setStorageSync('userinfo', JSON.stringify(res.data.userinfo))
								}
								if (res.data.token) {
									uni.setStorageSync('token', res.data.token)
								}
								console.log('自动登录成功')
							} else if (res && res.code !== 1) {
								console.log('登录返回非成功状态:', res.code, res.msg)
							}
							resolve(res)
						}).catch(err => {
							loginResolved = true
							console.error('登录失败', err)
							resolve(null)
						})
					}).catch(err => {
						loginResolved = true
						console.error('获取设备ID失败', err)
						
						let deviceId = uni.getStorageSync('last_device_id')
						
						if (!deviceId) {
							deviceId = 'TEMP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
							console.log('设备ID获取失败，使用临时ID:', deviceId)
						}
						
						uni.setStorageSync('last_device_id', deviceId)
						
						register_login({ device_id: deviceId }).then(res => {
							if (res && res.code === 1 && res.data) {
								if (res.data.userinfo) {
									uni.setStorageSync('userinfo', JSON.stringify(res.data.userinfo))
								}
								if (res.data.token) {
									uni.setStorageSync('token', res.data.token)
								}
							}
							resolve(res)
						}).catch(() => {
							resolve(null)
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
