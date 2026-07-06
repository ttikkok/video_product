<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="top-header">
			<u-status-bar bg-color="#f7f8fc"></u-status-bar>
			<view class="top-nav-view">
				<view class="nav-back" @click="goBack">
					<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
				</view>
				<view class="nav-title">帖子详情</view>
				<view class="nav-placeholder"></view>
			</view>
		</view>

		<!-- 帖子内容 -->
		<scroll-view scroll-y class="content">
			<!-- 帖子内容 -->
			<view class="post-content">
				<view style="color: #333;font-size: 32rpx;font-weight: bold;margin-bottom: 24rpx;">
					<text>{{ post.title }}</text>
				</view>
				<rich-text :nodes="post.content" style="color: #666;"></rich-text>
			</view>

			<!-- 帖子视频 -->
			<view v-if="post.video && post.video.trim() !== ''" class="post-media video">
				<sunny-video 
					videoId="videoPlayer"
					:title="post.title"
					:src="post.video"
					:poster="post.images && post.images.length > 0 ? post.images[0] : ''"
					:trialTime="!isMember ? 0.1 : 0"
					:seekTime="0"
					@play="onVideoPlay"
					@handleBtn="handleBtn"
				/>
			</view>
			<view v-else-if="post.images && post.images.length > 1" class="post-media images-grid">
				<image 
					v-for="(img, imgIndex) in post.images.slice(0, 9)" 
					:key="imgIndex" 
					:src="img" 
					mode="aspectFill" 
					class="grid-image"
					@click.stop="previewImage(post.images, imgIndex)"
				/>
			</view>
			<view v-else-if="post.images && post.images.length > 0" class="post-media single-image">
				<image :src="post.images[0]" mode="aspectFill" class="media-image" @click.stop="previewImage(post.images, 0)" />
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
					<text class="action-text">{{ post.like_number || 0 }}</text>
				</view>
				<view class="action-item" :class="{ active: isCollected }" @click="toggleCollect">
					<image :src="isCollected ? '../../static/images/collect_active.png' : '../../static/images/collect.png'" mode="widthFix" class="action-icon" />
					<text class="action-text">{{ isCollected ? '已收藏' : '收藏' }}</text>
				</view>
			</view>
		</scroll-view>

		<!-- 底部固定联系方式按钮 -->
		<view v-if="post.information && post.information.trim() !== ''" class="bottom-contact-bar">
			<view class="contact-btn" @click="getContact">
				<!-- <image src="../../static/images/kefu.png" mode="widthFix" class="contact-icon" /> -->
				<text class="contact-text">获取联系方式</text>
			</view>
		</view>

		<!-- 图片预览遮罩 -->
		<view v-if="showPreview" class="preview-overlay" @click="closePreview">
			<u-status-bar></u-status-bar>
			<view class="preview-header">
				<text class="preview-close" @click="closePreview">✕</text>
				<text class="preview-index">{{ currentPreviewIndex + 1 }}/{{ previewImages.length }}</text>
			</view>
			<swiper 
				class="preview-swiper" 
				:current="currentPreviewIndex" 
				@change="onPreviewChange"
				@click.stop
			>
				<swiper-item v-for="(img, index) in previewImages" :key="index">
					<image :src="img" mode="aspectFit" class="preview-image" />
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	import { CircleApi_circle_details, CircleApi_circle_like, CircleApi_circle_collect } from '@/api/home.js'
	export default {
		data() {
			return {
				post: {},
				isLiked: false,
				isCollected: false,
				showPreview: false,
				previewImages: [],
				currentPreviewIndex: 0,
				isMember: false,
				showingVipModal: false
			}
		},
		onLoad(options) {
			const userInfoStr = uni.getStorageSync('userinfo');
			let userInfo = null;
			try {
				userInfo = typeof userInfoStr === 'string' ? JSON.parse(userInfoStr) : userInfoStr;
			} catch (e) {
				console.error('解析用户信息失败:', e);
			}
			this.isMember = userInfo && userInfo.is_member === 1;
			if (options.id) {
				this.loadPostDetail(options.id)
			}
		},
		methods: {
			loadPostDetail(circleId) {
				uni.showLoading({
					title: '加载中...'
				})
				CircleApi_circle_details({ circle_id: circleId }).then(res => {
					uni.hideLoading()
					if (res && res.code === 1 && res.data) {
						this.post = res.data
						this.isLiked = res.data.is_like === 1
						this.isCollected = res.data.is_collect === 1
					}
				}).catch(err => {
					uni.hideLoading()
					console.error('帖子详情加载失败', err)
				})
			},
			goBack() {
				uni.navigateBack();
			},
			onVideoPlay() {
				if (!this.isMember) {
					this.showVipModal()
					const videoContext = uni.createVideoContext('videoPlayer', this);
					videoContext.pause();
					return;
				}
			},
			handleBtn() {
				this.showVipModal();
			},
			getContact() {
				if (!this.isMember) {
					this.showVipModal(1);
					return;
				}
				uni.showModal({
					title: '联系方式',
					content: this.post.information,
					showCancel: false,
					confirmText: '知道了'
				});
			},
			showVipModal(type) {
				if (this.showingVipModal) return;
				this.showingVipModal = true;
				uni.showModal({
					title: '会员专属',
					content: type == 1 ? '开通会员即可查看联系方式' : '此视频为VIP专属内容，开通会员即可观看完整视频',
					confirmText: '开通会员',
					cancelText: '取消',
					success: (res) => {
						this.showingVipModal = false;
						if (res.confirm) {
							uni.switchTab({
								url: '/pages/vip/index'
							});
						}
					},
					fail: () => {
						this.showingVipModal = false;
					},
					complete: () => {
						this.showingVipModal = false;
					}
				});
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
			},
			previewImage(images, index) {
				this.previewImages = images
				this.currentPreviewIndex = index
				this.showPreview = true
			},
			closePreview() {
				this.showPreview = false
				this.previewImages = []
				this.currentPreviewIndex = 0
			},
			onPreviewChange(e) {
				this.currentPreviewIndex = e.detail.current
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #f7f8fc;
		min-height: 100vh;
	}

	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.top-header {
		padding: 30rpx 20rpx;
		// height: 88rpx;
		background-color: #f7f8fc;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
	}

	.top-nav-view {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
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
		color: #333333;
	}

	.nav-placeholder {
		width: 60rpx;
	}

	.content {
		flex: 1;
		padding-top: calc(120rpx + var(--status-bar-height, 44px));
		padding-bottom: 140rpx;
	}

	.post-header {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #ffffff;
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
		color: #333333;
	}

	.user-level {
		font-size: 20rpx;
		color: #ff2155;
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
		background-color: rgba(255, 33, 85, 0.1);
		color: #ff2155;
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

	.video {
		position: relative;
		width: 100%;
		max-height: 460rpx;
	}

	.video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 30rpx;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		font-size: 24rpx;
		color: #ffffff;
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4rpx;
		padding: 0 20rpx;
	}

	.grid-image {
		width: 100%;
		height: 220rpx;
		// border-radius: 8rpx;
	}

	.single-image {
		padding: 0 20rpx;
	}

	// .single-image .media-image {
	// 	border-radius: 12rpx;
	// 	max-height: 600rpx;
	// }

	.post-content {
		padding: 0 20rpx 15rpx;
		font-size: 28rpx;
		color: #666666;
		line-height: 1.6;
		padding-top: 40rpx;
	}

	.post-media {
		position: relative;
		margin-bottom: 15rpx;
		width: 100%;
		// height: 400rpx;
	}

	.media-image {
		width: 100%;
		height: 410rpx;
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
		color: #999999;
	}

	.post-topics {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
		padding: 0 20rpx 20rpx;
	}

	.topic-tag {
		font-size: 26rpx;
		color: #ff2155;
		background-color: rgba(255, 33, 85, 0.1);
		padding: 5rpx 15rpx;
		border-radius: 6rpx;
	}

	.divider {
		height: 15rpx;
		background-color: #ffffff;
	}

	.action-bar {
		display: flex;
		justify-content: center;
		gap: 100rpx;
		padding: 25rpx 0;
		background-color: #ffffff;
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
		color: #999999;
	}

	.action-item.active .action-text {
		color: #ff2155;
	}

	.bottom-contact-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		background-color: rgba(255, 255, 255, 0.95);
		padding: 20rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		z-index: 9998;
	}

	.bottom-contact-bar .contact-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
		border-radius: 12rpx;
		padding: 24rpx;
		gap: 16rpx;
	}

	.contact-icon {
		width: 48rpx;
		height: 48rpx;
	}

	.contact-text {
		font-size: 32rpx;
		color: #fff;
		font-weight: bold;
	}

	/* 图片预览 */
	.preview-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.95);
		z-index: 9999;
		display: flex;
		flex-direction: column;
	}

	.preview-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}

	.preview-close {
		font-size: 48rpx;
		color: #fff;
		line-height: 1;
	}

	.preview-index {
		font-size: 28rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.preview-swiper {
		flex: 1;
		width: 100%;
	}

	.preview-image {
		width: 100%;
		height: 100%;
	}
</style>