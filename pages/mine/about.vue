<template>
	<view class="page">
		<u-status-bar bg-color="#f7f8fc"></u-status-bar>
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">关于我们</view>
		</view>

		<view class="about-header">
			<view class="app-logo-placeholder"></view>
			<text class="app-name">快乐视频</text>
			<text class="app-version">版本 2.5.8</text>
		</view>

		<view class="about-section">
			<view class="section-title">关于我们</view>
			<view class="section-content">
				<text>快乐视频是一款专注于提供优质成人内容的移动应用，致力于为用户带来最优质的观影体验。我们拥有丰富的视频资源库，每日更新热门内容。</text>
			</view>
		</view>

		<!-- <view class="about-section">
			<view class="section-title">联系方式</view>
			<view class="contact-list">
				<view class="contact-item" @click="copyText('123456789')">
					<text class="contact-icon">📧</text>
					<text class="contact-label">官方邮箱</text>
					<text class="contact-value">service@haoses.com</text>
				</view>
				<view class="contact-item" @click="copyText('123456789')">
					<text class="contact-icon">💬</text>
					<text class="contact-label">官方微信</text>
					<text class="contact-value">haoses_com</text>
				</view>
				<view class="contact-item" @click="copyText('123456789')">
					<text class="contact-icon">🌐</text>
					<text class="contact-label">官方网站</text>
					<text class="contact-value">www.haoses.com</text>
				</view>
			</view>
		</view> -->

		<view class="about-section">
			<view class="section-title">用户协议</view>
			<view class="agreement-list">
				<view class="agreement-item">
					<text>用户服务协议</text>
					<text class="arrow">›</text>
				</view>
				<view class="agreement-item">
					<text>隐私政策</text>
					<text class="arrow">›</text>
				</view>
				<view class="agreement-item">
					<text>免责声明</text>
					<text class="arrow">›</text>
				</view>
			</view>
		</view>

		<view class="about-section">
			<view class="section-title">其他信息</view>
			<view class="info-list">
				<view class="info-item">
					<text class="info-label">审核时间</text>
					<text class="info-value">24小时内</text>
				</view>
				<view class="info-item">
					<text class="info-label">客服时间</text>
					<text class="info-value">09:00 - 22:00</text>
				</view>
				<view class="info-item">
					<text class="info-label">内容更新</text>
					<text class="info-value">每日更新</text>
				</view>
			</view>
		</view>

		<view class="about-footer">
			<text>© 2026 快乐视频 版权所有</text>
			<text>本APP仅供成年人使用</text>
		</view>
	</view>
</template>

<script>
	export default {
		methods: {
			goBack() {
				uni.navigateBack()
			},
			copyText(text) {
				uni.setClipboardData({
					data: text,
					success: () => {
						uni.showToast({ title: '已复制到剪贴板', icon: 'success' })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #f7f8fc;
		padding-bottom: 50rpx;
	}

	.top-nav {
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
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

	.about-header {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 20rpx;
		background-color: #ffffff;
		margin-bottom: 20rpx;
	}

	.app-logo {
		width: 150rpx;
		height: 150rpx;
		border-radius: 30rpx;
		margin-bottom: 20rpx;
	}

	.app-name {
		font-size: 36rpx;
		color: #ff2155;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.app-version {
		font-size: 24rpx;
		color: #999999;
	}

	.about-section {
		background-color: #ffffff;
		margin: 0 20rpx 20rpx;
		border-radius: 12rpx;
		padding: 30rpx;
	}

	.section-title {
		font-size: 30rpx;
		color: #333333;
		font-weight: 600;
		margin-bottom: 20rpx;
	}

	.section-content text {
		font-size: 26rpx;
		color: #666666;
		line-height: 1.8;
	}

	.contact-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.contact-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}

	.contact-icon {
		font-size: 36rpx;
		margin-right: 20rpx;
	}

	.contact-label {
		font-size: 26rpx;
		color: #999999;
		flex: 1;
	}

	.contact-value {
		font-size: 26rpx;
		color: #ff2155;
	}

	.agreement-list {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.agreement-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		background-color: #ffffff;
		border-radius: 10rpx;
	}

	.agreement-item text:first-child {
		font-size: 26rpx;
		color: #333333;
	}

	.arrow {
		font-size: 32rpx;
		color: #666;
	}

	.info-list {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.info-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 15rpx 0;
	}

	.info-label {
		font-size: 26rpx;
		color: #999999;
	}

	.info-value {
		font-size: 26rpx;
		color: #333333;
	}

	.about-footer {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx 20rpx;
		gap: 10rpx;
	}

	.about-footer text {
		font-size: 22rpx;
		color: #666;
	}
</style>
