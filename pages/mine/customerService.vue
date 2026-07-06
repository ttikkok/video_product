<template>
	<view class="page">
		<u-status-bar bg-color="#f7f8fc"></u-status-bar>
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">在线客服</view>
		</view>

		<view class="service-info">
			<view class="service-avatar">
				<text>🤖</text>
			</view>
			<text class="service-name">快乐视频官方客服</text>
			<text class="service-status">在线</text>
		</view>

		<view class="service-tip">
			<text>点击下方按钮跳转到客服页面</text>
		</view>

		<view class="action-area">
			<view class="contact-btn" @click="contactService">
				<text>联系客服</text>
			</view>
		</view>

	</view>
</template>

<script>
	const { UserApi_get_customer_service } = require('../../api/home.js')
	export default {
		data() {
			return {
				customerServiceUrl: ''
			}
		},
		onLoad() {
			this.loadCustomerServiceUrl()
		},
		methods: {
			loadCustomerServiceUrl() {
				var that = this
				UserApi_get_customer_service({}).then(function(res) {
					if (res.code === 1 && res.data && res.data.customer_service_url) {
						that.customerServiceUrl = res.data.customer_service_url
					}
				}).catch(function(error) {
					console.error('获取客服链接失败', error)
				})
			},
			goBack() {
				uni.navigateBack()
			},
			contactService() {
				var that = this
				if (that.customerServiceUrl) {
					that.openCustomerService(that.customerServiceUrl)
					return
				}

				uni.showLoading({ title: '加载中...' })
				UserApi_get_customer_service({}).then(function(res) {
					uni.hideLoading()
					if (res.code === 1 && res.data && res.data.customer_service_url) {
						that.customerServiceUrl = res.data.customer_service_url
						that.openCustomerService(res.data.customer_service_url)
					} else {
						uni.showToast({ title: '获取客服链接失败', icon: 'none' })
					}
				}).catch(function(error) {
					console.error('获取客服链接失败', error)
					uni.hideLoading()
					uni.showToast({ title: '获取客服链接失败', icon: 'none' })
				})
			},
			openCustomerService(url) {
				if (!url) return
				// #ifdef APP-PLUS
				if (typeof plus !== 'undefined' && plus.runtime && plus.runtime.openURL) {
					plus.runtime.openURL(url)
					return
				}
				// #endif
				// #ifdef H5
				if (typeof window !== 'undefined' && window.open) {
					window.open(url, '_blank')
					return
				}
				// #endif
				uni.setClipboardData({
					data: url,
					success: function() {
						uni.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
		background-color: #f7f8fc;
		display: flex;
		flex-direction: column;
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

	.service-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 60rpx 20rpx;
		background-color: #ffffff;
		border-bottom: 1rpx solid #ffffff;
	}

	.service-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: rgba(255, 215, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;
	}

	.service-avatar text {
		font-size: 60rpx;
	}

	.service-name {
		font-size: 32rpx;
		color: #333333;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.service-status {
		font-size: 26rpx;
		color: #2ecc71;
	}

	.service-tip {
		padding: 40rpx 30rpx;
		text-align: center;
	}

	.service-tip text {
		font-size: 28rpx;
		color: #999999;
	}

	.action-area {
		padding: 40rpx 30rpx;
	}

	.contact-btn {
		background: linear-gradient(90deg, #ff215599 0%, #ff2155 100%);
		padding: 24rpx;
		border-radius: 12rpx;
		text-align: center;
	}

	.contact-btn text {
		font-size: 32rpx;
		color: #ffffff;
		font-weight: 600;
	}
</style>