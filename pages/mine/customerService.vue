<template>
	<view class="page">
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
			<text class="service-name">好色先生官方客服</text>
			<text class="service-status">在线</text>
		</view>

		<scroll-view scroll-y class="chat-list" id="chatList">
			<view v-for="(msg, index) in messages" :key="index" :class="['chat-item', msg.type]">
				<view v-if="msg.type === 'customer'" class="chat-avatar">
					<text>🤖</text>
				</view>
				<view class="chat-content">
					<text class="chat-text">{{ msg.text }}</text>
					<text class="chat-time">{{ msg.time }}</text>
				</view>
				<view v-if="msg.type === 'user'" class="chat-avatar user">
					<text>👤</text>
				</view>
			</view>
		</scroll-view>

		<view class="input-area">
			<view class="input-wrap">
				<input v-model="inputText" class="chat-input" placeholder="输入您的问题..." @confirm="sendMessage" />
				<view class="send-btn" @click="sendMessage">
					<text>发送</text>
				</view>
			</view>
			<view class="quick-replies">
				<text v-for="(reply, index) in quickReplies" :key="index" class="quick-btn" @click="useQuickReply(reply)">
					{{ reply }}
				</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				inputText: '',
				messages: [
					{
						type: 'customer',
						text: '您好，欢迎来到好色先生！请问有什么可以帮到您的？',
						time: '10:30'
					}
				],
				quickReplies: [
					'如何开通VIP？',
					'如何下载视频？',
					'联系人工客服',
					'充值问题'
				]
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			sendMessage() {
				if (!this.inputText.trim()) return
				
				this.messages.push({
					type: 'user',
					text: this.inputText,
					time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
				})
				
				const text = this.inputText
				this.inputText = ''
				
				setTimeout(() => {
					this.messages.push({
						type: 'customer',
						text: '感谢您的咨询，您的问题已收到，正在为您处理...',
						time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
					})
				}, 1000)
			},
			useQuickReply(reply) {
				this.inputText = reply
				this.sendMessage()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		height: 100vh;
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

	.service-info {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx 20rpx;
		background-color: #16213e;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.service-avatar {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: rgba(255, 215, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 15rpx;
	}

	.service-avatar text {
		font-size: 60rpx;
	}

	.service-name {
		font-size: 30rpx;
		color: #fff;
		font-weight: 600;
		margin-bottom: 8rpx;
	}

	.service-status {
		font-size: 24rpx;
		color: #2ecc71;
	}

	.chat-list {
		flex: 1;
		padding: 20rpx;
	}

	.chat-item {
		display: flex;
		margin-bottom: 30rpx;
	}

	.chat-item.user {
		flex-direction: row-reverse;
	}

	.chat-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background-color: rgba(255, 215, 0, 0.2);
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.chat-avatar.user {
		background-color: rgba(107, 163, 224, 0.2);
	}

	.chat-avatar text {
		font-size: 36rpx;
	}

	.chat-content {
		max-width: 70%;
		margin: 0 20rpx;
		display: flex;
		flex-direction: column;
	}

	.chat-item.customer .chat-content {
		align-items: flex-start;
	}

	.chat-item.user .chat-content {
		align-items: flex-end;
	}

	.chat-text {
		background-color: #16213e;
		padding: 20rpx;
		border-radius: 16rpx;
		font-size: 28rpx;
		color: #fff;
		line-height: 1.5;
	}

	.chat-item.user .chat-text {
		background-color: rgba(255, 215, 0, 0.3);
	}

	.chat-time {
		font-size: 20rpx;
		color: #999;
		margin-top: 8rpx;
	}

	.input-area {
		background-color: #16213e;
		padding: 20rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.input-wrap {
		display: flex;
		align-items: center;
		gap: 15rpx;
		margin-bottom: 15rpx;
	}

	.chat-input {
		flex: 1;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
		padding: 20rpx 25rpx;
		font-size: 28rpx;
		color: #fff;
	}

	.send-btn {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 18rpx 30rpx;
		border-radius: 30rpx;
	}

	.send-btn text {
		font-size: 28rpx;
		color: #000;
		font-weight: 600;
	}

	.quick-replies {
		display: flex;
		gap: 15rpx;
		flex-wrap: wrap;
	}

	.quick-btn {
		background-color: rgba(255, 255, 255, 0.1);
		padding: 12rpx 20rpx;
		border-radius: 20rpx;
		font-size: 24rpx;
		color: #6BA3E0;
	}
</style>
