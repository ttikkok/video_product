export default {
	token: uni.getStorageSync('token') || '',
	userInfo: uni.getStorageSync('userInfo') || {},
	bgColor: '', // 顶部导航背景色
	statusHeight: uni.getStorageSync('statusHeight') || 0, //系统状态栏高度
	navbarHeight: uni.getStorageSync('navbarHeight') || 44, //自定义顶部导航栏高度
}
