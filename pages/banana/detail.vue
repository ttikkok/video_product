<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">帖子详情</view>
			<view class="nav-placeholder"></view>
		</view>

		<!-- 帖子内容 -->
		<scroll-view scroll-y class="content">
			<!-- 帖子头部 -->
			<view class="post-header">
				<view class="user-info">
					<image :src="post.avatar" mode="aspectFill" class="user-avatar" />
					<view class="user-details">
						<view class="user-name-row">
							<text class="user-name">{{ post.userName }}</text>
							<view v-if="post.level" class="user-level">LV.{{ post.level }}</view>
						</view>
					</view>
				</view>
			</view>

			<!-- 帖子标签 -->
			<view v-if="post.tags && post.tags.length > 0" class="post-tags">
				<view v-for="(tag, tagIndex) in post.tags" :key="tagIndex" class="post-tag" :style="{ backgroundColor: tag.bgColor, color: tag.color }">
					{{ tag.name }}
				</view>
			</view>

			<!-- 帖子内容 -->
			<view class="post-content">
				<text>{{ post.content }}</text>
			</view>

			<!-- 帖子图片/视频 -->
			<view v-if="post.media" class="post-media">
				<image :src="post.media" mode="widthFix" class="media-image" />
				<!-- <view v-if="post.mediaOverlay" class="media-overlay">
					<image :src="post.mediaOverlay" mode="widthFix" class="overlay-image" />
				</view> -->
			</view>

			<!-- 位置标签 -->
			<view v-if="post.location" class="post-location">
				<text class="location-icon">📍</text>
				<text class="location-text">{{ post.location }}</text>
			</view>

			<!-- 话题标签 -->
			<view v-if="post.topics && post.topics.length > 0" class="post-topics">
				<text v-for="(topic, topicIndex) in post.topics" :key="topicIndex" class="topic-tag">#{{ topic }}</text>
			</view>

			<!-- 分割线 -->
			<view class="divider"></view>

			<!-- 互动按钮 -->
			<view class="action-bar">
				<view class="action-item" :class="{ active: isLiked }" @click="toggleLike">
					<image :src="isLiked ? '../../static/images/dianzan-active.png' : '../../static/images/dianzan.png'" mode="widthFix" class="action-icon" />
					<text class="action-text">{{ post.likes }}{{ isLiked ? '+1' : '' }}</text>
				</view>
				<view class="action-item" :class="{ active: isCollected }" @click="toggleCollect">
					<image :src="isCollected ? '../../static/images/shoucang-active.png' : '../../static/images/shoucang.png'" mode="widthFix" class="action-icon" />
					<text class="action-text">{{ isCollected ? '已收藏' : '收藏' }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				post: {},
				isLiked: false,
				isCollected: false
			}
		},
		onLoad(options) {
			const postData = JSON.parse(decodeURIComponent(options.post));
			this.post = postData;
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			toggleLike() {
				this.isLiked = !this.isLiked;
				if (this.isLiked) {
					uni.showToast({
						title: '点赞成功',
						icon: 'none'
					});
				}
			},
			toggleCollect() {
				this.isCollected = !this.isCollected;
				uni.showToast({
					title: this.isCollected ? '收藏成功' : '已取消收藏',
					icon: 'none'
				});
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #0f1629;
		min-height: 100vh;
	}

	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.top-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		height: 88rpx;
		background-color: #16213e;
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
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
	}

	.nav-placeholder {
		width: 60rpx;
	}

	.content {
		flex: 1;
		padding-top: calc(88rpx + var(--status-bar-height, 44px));
	}

	.post-header {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #16213e;
		margin-bottom: 15rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
	}

	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.user-details {
		margin-left: 15rpx;
	}

	.user-name-row {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.user-name {
		font-size: 30rpx;
		font-weight: 600;
		color: #fff;
	}

	.user-level {
		font-size: 20rpx;
		color: #ffd700;
		background-color: rgba(255, 215, 0, 0.15);
		padding: 2rpx 10rpx;
		border-radius: 20rpx;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
		padding: 0 20rpx 15rpx;
	}

	.post-tag {
		font-size: 22rpx;
		padding: 5rpx 15rpx;
		border-radius: 6rpx;
	}

	.post-content {
		padding: 0 20rpx 15rpx;
		font-size: 28rpx;
		color: #ccc;
		line-height: 1.6;
	}

	.post-media {
		position: relative;
		margin-bottom: 15rpx;
		width: 100%;
	}

	.media-image {
		width: 100%;
		height: auto;
		display: block;
	}

	.media-overlay {
		// position: absolute;
		// top: 0;
		// left: 0;
		// right: 0;
		// bottom: 0;
		// display: flex;
		// align-items: center;
		// justify-content: center;
		// background-color: rgba(0, 0, 0, 0.3);
    width: 100%;
	}

	.overlay-image {
		width: 100%;
		height: 100%;
	}

	.post-location {
		display: flex;
		align-items: center;
		padding: 0 20rpx 15rpx;
	}

	.location-icon {
		font-size: 28rpx;
		margin-right: 8rpx;
	}

	.location-text {
		font-size: 26rpx;
		color: #999;
	}

	.post-topics {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
		padding: 0 20rpx 20rpx;
	}

	.topic-tag {
		font-size: 26rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.15);
		padding: 5rpx 15rpx;
		border-radius: 6rpx;
	}

	.divider {
		height: 15rpx;
		background-color: #0f1629;
	}

	.action-bar {
		display: flex;
		justify-content: center;
		gap: 100rpx;
		padding: 25rpx 0;
		background-color: #16213e;
		margin-bottom: 15rpx;
	}

	.action-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}

	.action-icon {
		width: 60rpx;
		height: 60rpx;
	}

	.action-item.active .action-icon {
		filter: brightness(1.2);
	}

	.action-text {
		font-size: 26rpx;
		color: #999;
	}

	.action-item.active .action-text {
		color: #ffd700;
	}
</style>