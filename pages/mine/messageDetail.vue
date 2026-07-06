<template>
	<view class="page">
		<view class="top-header">
			<u-status-bar bg-color="#f7f8fc"></u-status-bar>
			<view class="top-nav-view">
				<view class="nav-back" @click="goBack">
					<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
				</view>
				<view class="nav-title">消息详情</view>
				<view class="nav-placeholder"></view>
			</view>
		</view>

		<scroll-view scroll-y class="content">
			<u-status-bar></u-status-bar>
			<view v-if="message" class="detail-container">
				<view class="detail-header">
					<view class="detail-icon">{{ getCategoryIcon(message.category_id) }}</view>
					<view class="detail-info">
						<text class="detail-title">{{ message.title }}</text>
						<text class="detail-time">{{ formatTime(message.createtime*1000) }}</text>
					</view>
				</view>

				<view class="detail-content">
					<text>{{ message.content || '暂无内容' }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { MessageApi_message_details } from '@/api/home.js'
	export default {
		data() {
			return {
				message: null
			}
		},
		onLoad(options) {
			if (options.id) {
				this.loadMessageDetail(options.id)
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			loadMessageDetail(id) {
				MessageApi_message_details({ id: id }).then(res => {
					if (res && res.code === 1 && res.data) {
						this.message = res.data
					}
				}).catch(err => {
					console.error('加载消息详情失败', err)
				})
			},
			getCategoryIcon(categoryId) {
				const icons = {
					30: '📢',
					31: '📋'
				}
				return icons[categoryId] || '🔔'
			},
			formatTime(timestamp) {
				if (!timestamp) return ''
				const date = new Date(timestamp)
				const year = date.getFullYear()
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				const hours = String(date.getHours()).padStart(2, '0')
				const minutes = String(date.getMinutes()).padStart(2, '0')
				return `${year}-${month}-${day} ${hours}:${minutes}`
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #f7f8fc;
		display: flex;
		flex-direction: column;
	}

	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 30rpx 20rpx;
		background-color: #f7f8fc;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}
	.top-nav-view {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.top-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		height: 88rpx;
		background-color: #f7f8fc;
		padding-top: var(--status-bar-height, 44px);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
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
		font-weight: 600;
		color: #333333;
		text-align: center;
	}

	.nav-placeholder {
		width: 60rpx;
	}

	.content {
		flex: 1;
		padding-top: calc(88rpx + var(--status-bar-height, 44px));
	}

	.detail-container {
		padding: 30rpx;
	}

	.detail-header {
		display: flex;
		align-items: flex-start;
		gap: 20rpx;
		margin-bottom: 30rpx;
		padding-bottom: 30rpx;
		border-bottom: 1rpx solid #ffffff;
	}

	.detail-icon {
		font-size: 56rpx;
		flex-shrink: 0;
	}

	.detail-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		gap: 10rpx;
	}

	.detail-title {
		font-size: 34rpx;
		color: #333333;
		font-weight: 600;
	}

	.detail-time {
		font-size: 24rpx;
		color: #999999;
	}

	.detail-content {
		font-size: 30rpx;
		color: #333333;
		line-height: 2;
		white-space: pre-wrap;
	}
</style>