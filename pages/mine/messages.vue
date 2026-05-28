<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">消息通知</view>
			<view class="nav-all" @click="markAllRead">
				<text>全部已读</text>
			</view>
		</view>

		<scroll-view scroll-y class="message-list">
			<view v-for="(msg, index) in messages" :key="index" :class="['message-item', { unread: !msg.read }]" @click="openMessage(msg)">
				<view class="msg-icon">{{ msg.icon }}</view>
				<view class="msg-content">
					<view class="msg-header">
						<text class="msg-title">{{ msg.title }}</text>
						<text class="msg-time">{{ msg.time }}</text>
					</view>
					<text class="msg-desc">{{ msg.desc }}</text>
				</view>
				<view v-if="!msg.read" class="unread-dot"></view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				messages: [
					{
						icon: '💰',
						title: '充值成功',
						desc: '恭喜您成为VIP会员，享受无限观影特权',
						time: '10分钟前',
						read: false
					},
					{
						icon: '⭐',
						title: '收藏更新',
						desc: '您收藏的影片已更新最新章节',
						time: '30分钟前',
						read: false
					},
					{
						icon: '📢',
						title: '系统公告',
						desc: '平台新增午夜电台功能，快去体验吧',
						time: '1小时前',
						read: true
					},
					{
						icon: '🎁',
						title: '活动提醒',
						desc: '限时优惠：年卡会员买一送一',
						time: '昨天',
						read: true
					},
					{
						icon: '🔔',
						title: '评论回复',
						desc: '用户"小明"回复了您的评论',
						time: '昨天',
						read: true
					}
				]
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			markAllRead() {
				this.messages.forEach(msg => msg.read = true)
				uni.showToast({ title: '已全部标记为已读', icon: 'success' })
			},
			openMessage(msg) {
				msg.read = true
				uni.showToast({ title: msg.title, icon: 'none' })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
		display: flex;
		flex-direction: column;
	}

	.top-nav {
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
		padding-top: calc(30rpx + constant(safe-area-inset-top));
		padding-top: calc(30rpx + env(safe-area-inset-top));
		background-color: #16213e;
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
		color: #fff;
		font-weight: 600;
		text-align: center;
	}

	.nav-all {
		font-size: 26rpx;
		color: #6BA3E0;
	}

	.message-list {
		flex: 1;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.message-item {
		display: flex;
		align-items: flex-start;
		background-color: #16213e;
		border-radius: 12rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		position: relative;
	}

	.message-item.unread {
		background-color: rgba(107, 163, 224, 0.1);
	}

	.msg-icon {
		font-size: 48rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.msg-content {
		flex: 1;
		overflow: hidden;
	}

	.msg-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.msg-title {
		font-size: 28rpx;
		color: #fff;
		font-weight: 600;
	}

	.msg-time {
		font-size: 22rpx;
		color: #999;
	}

	.msg-desc {
		font-size: 24rpx;
		color: #ccc;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.unread-dot {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		width: 16rpx;
		height: 16rpx;
		background-color: #e74c3c;
		border-radius: 50%;
	}
</style>
