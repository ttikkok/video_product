<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="top-nav">
			<view class="nav-title">我的</view>
			<view class="nav-setting" @click="goToSetting">
				<image src="../../static/images/setting.png" mode="widthFix" style="width: 40rpx;"></image>
			</view>
		</view>

		<!-- 用户信息 -->
		<view class="user-section">
			<view class="user-info">
				<image :src="userInfo.avatar" mode="aspectFill" class="user-avatar" />
				<view class="user-detail">
					<text class="user-name">{{ userInfo.name }}</text>
					<view class="user-vip">
						<text class="vip-tag">{{ userInfo.vipTag }}</text>
						<text class="vip-time" v-if="userInfo.vipTime">{{ userInfo.vipTime }}</text>
					</view>
				</view>
				<view v-if="!isBound" class="bind-btn" @click="goToBindAccount">
					<text>绑定账号</text>
				</view>
			</view>
			<view v-if="!isBound" class="device-id">
				<text class="device-label">设备ID：{{ deviceId }}</text>
				<text class="device-hint">当前为游客模式，绑定账号后数据可同步</text>
			</view>
		</view>

		<!-- VIP充值入口 -->
		<view class="vip-banner" @click="goToVip">
			<view class="banner-left">
				<text class="banner-icon">👑</text>
				<view class="banner-info">
					<text class="banner-title">开通VIP会员</text>
					<text class="banner-desc">享受无限观影特权</text>
				</view>
			</view>
			<view class="banner-btn">
				<text>立即开通</text>
			</view>
		</view>

		<!-- 功能菜单 -->
		<view class="menu-section">
			<view class="menu-item" @click="goToPage('favorites')">
				<!-- <text class="menu-icon">⭐</text> -->
				<image src="../../static/images/shoucang.png" mode="widthFix" class="menu-icon"></image>
				<text class="menu-name">我的收藏</text>
				<text class="menu-count">{{ userInfo.favoritesCount }}部</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToPage('history')">
				<image src="../../static/images/img02.png" mode="widthFix" class="menu-icon"></image>
				<text class="menu-name">观看历史</text>
				<text class="menu-count">{{ userInfo.historyCount }}部</text>
				<text class="menu-arrow">›</text>
			</view>
			<!-- <view class="menu-item" @click="goToPage('downloads')">
				<image src="../../static/images/img01.png" mode="widthFix" class="menu-icon"></image>
				<text class="menu-name">下载管理</text>
				<text class="menu-count">{{ userInfo.downloadCount }}部</text>
				<text class="menu-arrow">›</text>
			</view> -->
		</view>

		<view class="menu-section">
			<view class="menu-item" @click="goToPage('messages')">
				<image src="../../static/images/tongzhi.png" mode="widthFix" class="menu-icon"></image>
				<text class="menu-name">消息通知</text>
				<view class="menu-badge" v-if="userInfo.unreadMessages > 0">
					<text>{{ userInfo.unreadMessages }}</text>
				</view>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToPage('lines')">
				<image src="../../static/images/wangluo.png" mode="widthFix" class="menu-icon"></image>
				<text class="menu-name">线路设置</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>

		<view class="menu-section">
			<view class="menu-item" @click="clearCache">
				<image src="../../static/images/delecte.png" mode="widthFix" class="menu-icon"></image>
				<text class="menu-name">清除缓存</text>
				<text class="menu-value">{{ cacheSize }}</text>
				<text class="menu-arrow">›</text>
			</view>
			<view class="menu-item" @click="goToPage('customerService')">
				<image src="../../static/images/kefu.png" mode="widthFix" class="menu-icon"></image>
				<text class="menu-name">在线客服</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>

		<view class="menu-section">
			<view class="menu-item" @click="goToPage('about')">
				<image src="../../static/images/guanyu.png" mode="widthFix" class="menu-icon"></image>
				<text class="menu-name">关于我们</text>
				<text class="menu-arrow">›</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isBound: false,
				deviceId: '',
				userInfo: {
					avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avatar%20portrait%20icon&image_size=square',
					name: '游客用户',
					vipTag: '普通会员',
					vipTime: '',
					favoritesCount: 12,
					historyCount: 56,
					downloadCount: 8,
					unreadMessages: 3
				},
				cacheSize: '23.5MB'
			}
		},
		onLoad() {
			this.getDeviceId()
			this.checkBindStatus()
		},
		methods: {
			getDeviceId() {
				let deviceId = uni.getStorageSync('deviceId')
				if (!deviceId) {
					deviceId = 'UDID_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
					uni.setStorageSync('deviceId', deviceId)
				}
				this.deviceId = deviceId.slice(-16)
			},
			checkBindStatus() {
				this.isBound = uni.getStorageSync('isBound') === 'true'
				if (this.isBound) {
					this.userInfo.name = '已绑定用户'
				}
			},
			goToBindAccount() {
				uni.navigateTo({ url: '/pages/mine/bindAccount' })
			},
			goToSetting() {
				uni.navigateTo({ url: '/pages/mine/setting' })
			},
			goToVip() {
				uni.switchTab({ url: '/pages/vip/index' })
			},
			goToPage(page) {
				const routes = {
					favorites: '/pages/mine/favorites',
					history: '/pages/mine/history',
					downloads: '/pages/mine/downloads',
					messages: '/pages/mine/messages',
					lines: '/pages/mine/lines',
					customerService: '/pages/mine/customerService',
					about: '/pages/mine/about'
				}
				if (page === 'customerService' || page === 'about') {
					uni.navigateTo({ url: routes[page] })
				} else {
					uni.navigateTo({ url: routes[page] })
				}
			},
			clearCache() {
				uni.showModal({
					title: '清除缓存',
					content: '确定要清除缓存吗？',
					success: (res) => {
						if (res.confirm) {
							this.cacheSize = '0MB'
							uni.showToast({ title: '缓存已清除', icon: 'success' })
						}
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
		padding-bottom: 120rpx;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	.top-nav {
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 30rpx 30rpx;
		padding-top: calc(30rpx + constant(safe-area-inset-top));
		padding-top: calc(30rpx + env(safe-area-inset-top));
		background-color: #16213e;
		position: relative;
	}

	.nav-title {
		font-size: 34rpx;
		color: #fff;
		font-weight: 600;
	}

	.nav-setting {
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 36rpx;
	}

	.user-section {
		background-color: #16213e;
		padding: 40rpx 30rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.user-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		border: 3rpx solid #ffd700;
	}

	.user-detail {
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.user-name {
		font-size: 32rpx;
		color: #fff;
		font-weight: 500;
	}

	.bind-btn {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 15rpx 30rpx;
		border-radius: 30rpx;
	}

	.bind-btn text {
		font-size: 24rpx;
		color: #000;
		font-weight: 600;
	}

	.device-id {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.device-label {
		font-size: 24rpx;
		color: #999;
		font-family: monospace;
	}

	.device-hint {
		font-size: 22rpx;
		color: #666;
	}

	.user-vip {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.vip-tag {
		font-size: 22rpx;
		color: #ffd700;
		background-color: rgba(255, 215, 0, 0.2);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
	}

	.vip-time {
		font-size: 22rpx;
		color: #999;
	}

	.vip-banner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: linear-gradient(90deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.2) 100%);
		margin: 20rpx;
		padding: 25rpx;
		border-radius: 16rpx;
	}

	.banner-left {
		display: flex;
		align-items: center;
		gap: 15rpx;
	}

	.banner-icon {
		font-size: 50rpx;
	}

	.banner-info {
		display: flex;
		flex-direction: column;
		gap: 5rpx;
	}

	.banner-title {
		font-size: 28rpx;
		color: #fff;
		font-weight: 600;
	}

	.banner-desc {
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.7);
	}

	.banner-btn {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 12rpx 25rpx;
		border-radius: 30rpx;
	}

	.banner-btn text {
		font-size: 24rpx;
		color: #000;
		font-weight: 600;
	}

	.menu-section {
		background-color: #16213e;
		margin: 20rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.menu-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
	}

	.menu-item:last-child {
		border-bottom: none;
	}

	.menu-icon {
		// font-size: 36rpx;
		width: 36rpx;
		margin-right: 20rpx;
	}

	.menu-name {
		flex: 1;
		font-size: 28rpx;
		color: #fff;
	}

	.menu-count {
		font-size: 24rpx;
		color: #999;
		margin-right: 15rpx;
	}

	.menu-value {
		font-size: 24rpx;
		color: #999;
		margin-right: 15rpx;
	}

	.menu-badge {
		background-color: #e74c3c;
		min-width: 36rpx;
		height: 36rpx;
		border-radius: 18rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0 10rpx;
		margin-right: 15rpx;
	}

	.menu-badge text {
		font-size: 22rpx;
		color: #fff;
		font-weight: 600;
	}

	.menu-arrow {
		font-size: 36rpx;
		color: #666;
	}
</style>
