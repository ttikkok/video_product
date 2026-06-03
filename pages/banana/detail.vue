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
			<!-- 帖子内容 -->
			<view class="post-content">
				<text>{{ post.title }}</text>
			</view>

			<!-- 帖子视频 -->
			<view v-if="post.video" class="post-media video">
				<video 
					:src="post.video" 
					class="video-player"
					:poster="post.images && post.images.length > 0 ? post.images[0] : ''"
					controls
					show-center-play-btn
					:duration="post.duration"
				></video>
			</view>
			<view v-else-if="post.images && post.images.length > 1" class="post-media images-grid">
				<image 
					v-for="(img, imgIndex) in post.images.slice(0, 9)" 
					:key="imgIndex" 
					:src="img" 
					mode="aspectFill" 
					:class="['grid-image', { 'big': post.images.length === 2 && imgIndex === 0 }]" 
				/>
			</view>
			<view v-else-if="post.images && post.images.length === 1" class="post-media single-image">
				<image :src="post.images[0]" mode="aspectFill" class="media-image" />
			</view>

			<!-- 帖子标签 -->
			<view v-if="post.tags && post.tags.length > 0" class="post-tags">
				<view v-for="(tag, tagIndex) in post.tags" :key="tagIndex" class="post-tag">
					{{ tag }}
				</view>
			</view>

			<!-- 分割线 -->
			<view class="divider"></view>

			<!-- 互动按钮 -->
			<view class="action-bar">
				<view class="action-item" :class="{ active: isLiked }" @click="toggleLike">
					<image :src="isLiked ? '../../static/images/goods_active.png' : '../../static/images/goods.png'" mode="widthFix" class="action-icon" />
					<text class="action-text">{{ post.like_number }}</text>
				</view>
				<view class="action-item" :class="{ active: isCollected }" @click="toggleCollect">
					<image :src="isCollected ? '../../static/images/collect_active.png' : '../../static/images/collect.png'" mode="widthFix" class="action-icon" />
					<text class="action-text">{{ isCollected ? '已收藏' : '收藏' }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { CircleApi_circle_details, CircleApi_circle_like, CircleApi_circle_collect } from '@/api/home.js'
	export default {
		data() {
			return {
				post: {},
				isLiked: false,
				isCollected: false
			}
		},
		onLoad(options) {
			if (options.id) {
				this.loadPostDetail(options.id)
			} else if (options.post) {
				const postData = JSON.parse(decodeURIComponent(options.post));
				this.post = postData;
				this.isLiked = postData.is_like === 1
				this.isCollected = postData.is_collect === 1
			}
		},
		methods: {
			loadPostDetail(circleId) {
				CircleApi_circle_details({ circle_id: circleId }).then(res => {
					if (res && res.code === 1 && res.data) {
						this.post = res.data
						this.isLiked = res.data.is_like === 1
						this.isCollected = res.data.is_collect === 1
					}
				}).catch(err => {
					console.error('帖子详情加载失败', err)
				})
			},
			goBack() {
					uni.navigateBack();
				},
				playVideo() {
					if (this.post.video) {
						uni.navigateTo({
							url: `/pages/index/play?id=${this.post.id}&title=${encodeURIComponent(this.post.title)}`
						})
					}
				},
			toggleLike() {
				CircleApi_circle_like({ circle_id: this.post.id }).then(res => {
					if (res && res.code === 1) {
						this.isLiked = !this.isLiked
						if (this.post.like_number !== undefined) {
							this.post.like_number = this.isLiked ? this.post.like_number + 1 : Math.max(0, this.post.like_number - 1)
						}
						uni.showToast({ title: res.msg || (this.isLiked ? '点赞成功' : '取消点赞'), icon: 'none' })
					} else {
						uni.showToast({ title: res.msg || '操作失败', icon: 'none' })
					}
				}).catch(err => {
					console.error('点赞失败', err)
					uni.showToast({ title: '操作失败', icon: 'none' })
				})
			},
			toggleCollect() {
				CircleApi_circle_collect({ circle_id: this.post.id }).then(res => {
					if (res && res.code === 1) {
						this.isCollected = !this.isCollected
						if (this.post.collect_number !== undefined) {
							this.post.collect_number = this.isCollected ? this.post.collect_number + 1 : Math.max(0, this.post.collect_number - 1)
						}
						uni.showToast({ title: res.msg || (this.isCollected ? '收藏成功' : '取消收藏'), icon: 'none' })
					} else {
						uni.showToast({ title: res.msg || '操作失败', icon: 'none' })
					}
				}).catch(err => {
					console.error('收藏失败', err)
					uni.showToast({ title: '操作失败', icon: 'none' })
				})
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
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
		background-color: rgba(107, 163, 224, 0.2);
		color: #6BA3E0;
	}

	.video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 120rpx;
		height: 120rpx;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.video-player {
		width: 100%;
		height: 400rpx;
	}

	.video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 30rpx;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		font-size: 24rpx;
		color: #fff;
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4rpx;
		padding: 0 20rpx;
	}

	.grid-image {
		width: 100%;
		height: 200rpx;
		border-radius: 8rpx;
	}

	.grid-image.big {
		grid-row: span 2;
		height: 404rpx;
	}

	.single-image {
		padding: 0 20rpx;
	}

	.single-image .media-image {
		border-radius: 12rpx;
		max-height: 600rpx;
	}

	.post-content {
		padding: 0 20rpx 15rpx;
		font-size: 28rpx;
		color: #ccc;
		line-height: 1.6;
		padding-top: 40rpx;
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