<script>
	// import { getUserInfo } from "@/api/public";
	import config from "@/http/config";
	export default {
		onLaunch: function() {
			// console.log('App Launch')
		},
		onShow: function() {
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
