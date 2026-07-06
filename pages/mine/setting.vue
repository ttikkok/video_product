<template>
	<view class="page">
		<u-status-bar bg-color="#f7f8fc"></u-status-bar>
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">设置</view>
			<view class="nav-placeholder"></view>
		</view>

		<view class="setting-list">
			<view class="setting-item" @click="goToProfile">
				<text class="item-label">個人資料</text>
				<view class="item-right">
					<text class="item-value">丟三丟四、不丟你￥</text>
					<text class="item-arrow">›</text>
				</view>
			</view>

			<view class="setting-item" @click="goToBindAccount">
				<text class="item-label">綁定帳號</text>
				<text class="item-arrow">›</text>
			</view>

			<view class="setting-item" @click="goToLines">
				<text class="item-label">线路设置</text>
				<view class="item-right">
					<text class="item-hint">圖片、視頻異常時請切換</text>
					<text class="item-arrow">›</text>
				</view>
			</view>

			<view class="setting-item" @click="goToLines">
				<text class="item-label">线路设置</text>
				<view class="item-right">
					<text class="item-hint">圖片、視頻異常時請切換</text>
					<text class="item-arrow">›</text>
				</view>
			</view>

			<view class="setting-item" @click="goToPrivacy">
				<text class="item-label">隐私设置</text>
				<view class="item-right">
					<text class="item-hint">更换应用图标、设置手势密码</text>
					<view class="item-dot"></view>
					<text class="item-arrow">›</text>
				</view>
			</view>

			<view class="setting-item" @click="goToSecurity">
				<text class="item-label">安全码</text>
				<view class="item-right">
					<text class="item-value">未设置</text>
					<text class="item-arrow">›</text>
				</view>
			</view>

			<view class="setting-item toggle-item">
				<text class="item-label">開啟預覽/自動播放視頻</text>
				<switch 
					:checked="autoPlay" 
					class="toggle-switch"
					@change="toggleAutoPlay"
				/>
			</view>

			<view class="setting-item" @click="goToNotifications">
				<text class="item-label">消息推送</text>
				<view class="item-right">
					<text class="item-value">已開關</text>
					<text class="item-arrow">›</text>
				</view>
			</view>

			<view class="setting-item" @click="clearCache">
				<text class="item-label">清除系統緩存</text>
				<view class="item-right">
					<text class="item-value cache-size">5.25MB</text>
					<text class="item-arrow">›</text>
				</view>
			</view>
		</view>

		<view class="login-link" @click="otherLogin">
			<text>使用其他账号登录</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				autoPlay: true,
				cacheSize: '5.25MB'
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			goToProfile() {
				uni.showToast({ title: '个人资料', icon: 'none' })
			},
			goToBindAccount() {
				uni.navigateTo({ url: '/pages/mine/bindAccount' })
			},
			goToLines() {
				uni.navigateTo({ url: '/pages/mine/lines' })
			},
			goToPrivacy() {
				uni.showToast({ title: '隐私设置', icon: 'none' })
			},
			goToSecurity() {
				uni.showToast({ title: '安全码设置', icon: 'none' })
			},
			toggleAutoPlay(e) {
				this.autoPlay = e.detail.value
				uni.setStorageSync('autoPlay', this.autoPlay ? 'true' : 'false')
				uni.showToast({ 
					title: this.autoPlay ? '已开启自动播放' : '已关闭自动播放', 
					icon: 'none' 
				})
			},
			goToNotifications() {
				uni.showToast({ title: '消息推送设置', icon: 'none' })
			},
			clearCache() {
				uni.showModal({
					title: '清除缓存',
					content: '确定要清除系统缓存吗？',
					success: (res) => {
						if (res.confirm) {
							this.cacheSize = '0MB'
							uni.showToast({ title: '缓存已清除', icon: 'success' })
						}
					}
				})
			},
			otherLogin() {
				uni.showToast({ title: '其他账号登录', icon: 'none' })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #f7f8fc;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	.top-nav {
		display: flex;
		align-items: center;
		padding: 30rpx;
		padding-top: calc(30rpx + constant(safe-area-inset-top));
		padding-top: calc(30rpx + env(safe-area-inset-top));
		background-color: #f7f8fc;
	}

	.nav-back {
		width: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.nav-title {
		flex: 1;
		font-size: 32rpx;
		color: #333333;
		font-weight: 600;
		text-align: center;
	}

	.nav-placeholder {
		width: 60rpx;
	}

	.setting-list {
		background-color: #ffffff;
		margin: 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.setting-item {
		display: flex;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid #ffffff;
	}

	.setting-item:last-child {
		border-bottom: none;
	}

	.item-label {
		font-size: 28rpx;
		color: #333333;
		flex: 1;
	}

	.item-right {
		display: flex;
		align-items: center;
	}

	.item-value {
		font-size: 26rpx;
		color: #999999;
		margin-right: 15rpx;
	}

	.cache-size {
		color: #333333;
		font-weight: 500;
	}

	.item-hint {
		font-size: 24rpx;
		color: #999999;
		margin-right: 15rpx;
	}

	.item-arrow {
		font-size: 32rpx;
		color: #999999;
	}

	.item-dot {
		width: 12rpx;
		height: 12rpx;
		background-color: #e74c3c;
		border-radius: 50%;
		margin-right: 10rpx;
	}

	.toggle-item {
		justify-content: space-between;
	}

	.toggle-switch {
		transform: scale(0.8);
	}

	.login-link {
		text-align: center;
		padding: 40rpx;
	}

	.login-link text {
		font-size: 26rpx;
		color: #ff9800;
	}
</style>
