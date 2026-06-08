<template>
	<view class="page">
		<!-- 顶部自定义导航栏 -->
		<view class="custom-navbar">
			<view class="navbar-back" @click="goBack">
				<image src="/static/images/back.png" class="back-icon" mode="aspectFit"></image>
			</view>
			<view class="navbar-title">视频播放</view>
			<view class="navbar-placeholder"></view>
		</view>

		<!-- 视频播放窗口 -->
		<view class="video-container">
			<video 
			id="videoPlayer"
			class="video-player"
			:src="videoSrc"
			:poster="videoPoster"
			:autoplay="false"
			:show-center-play-btn="true"
			:controls="true"
			:enable-progress-gesture="true"
			:show-play-btn="true"
			object-fit="contain"
			@play="onPlay"
			@pause="onPause"
			@timeupdate="onTimeUpdate"
			@error="handleVideoError"
			@ended="onEnded"
		></video>
			<view v-if="!videoSrc" class="video-placeholder">
				<text class="placeholder-text">视频加载中...</text>
			</view>
		</view>

		

		<!-- 视频信息 -->
		<view class="video-info">
			<view class="video-title-row">
				<view v-if="isFree === 0" class="vip-label">VIP</view>
				<view class="video-title">{{ videoTitle }}</view>
			</view>
			<view class="video-meta">
				<view class="meta-item">
					<text class="meta-text">番號: {{ videoCode }}</text>
				</view>
				<view v-if="videoYear" class="meta-item">
					<text class="meta-text">年份: {{ videoYear }}</text>
				</view>
			</view>

			<view class="video-actions">
				<view class="action-item" @click="toggleLike">
					<image :src="isLiked ? '../../static/images/goods_active.png' : '../../static/images/goods.png'" mode="widthFix" class="action-icon" />
					<text class="action-text">{{ likeCount }}</text>
				</view>
				<view class="action-item" @click="toggleCollect">
					<image :src="isCollected ? '../../static/images/collect_active.png' : '../../static/images/collect.png'" mode="widthFix" class="action-icon" />
					<text class="action-text">{{ collectCount }}</text>
				</view>
			</view>

			<view v-if="videoTags.length > 0" class="video-tags">
				<text 
					v-for="(tag, index) in videoTags" 
					:key="index" 
					class="video-tag"
				>{{ tag }}</text>
			</view>

			<view class="rating-section">
				<view class="rating-bar">
					<view class="rating-fill" :style="{ width: ratingPercent + '%' }"></view>
				</view>
				<text class="rating-text">好評 {{ ratingPercent }}%</text>
			</view>

			<view class="video-desc">
				<text class="desc-text">{{ videoDesc }}</text>
			</view>
		</view>

		<!-- 相关推荐视频列表 -->
		<view class="recommend-section">
			<view class="section-header">
				<view class="header-left">
					<view class="title-badge"></view>
					<text class="section-title">相关推荐</text>
				</view>
				<view class="section-more" @click="goToMore">
					<text>更多</text>
					<text class="arrow">›</text>
				</view>
			</view>

			<view class="video-list">
				<view 
					class="video-card" 
					v-for="(item, index) in recommendList" 
					:key="index"
					@click="playVideo(item)"
				>
					<view class="video-cover">
						<image 
							:src="item.cover_image || item.poster" 
							mode="aspectFill" 
							class="cover-image"
					/>
						<view class="video-overlay">
							<view class="play-icon">▶</view>
						</view>
						<text class="video-duration">{{ item.duration || '00:15:00' }}</text>
					</view>
					<view class="video-detail">
						<view class="detail-title">{{ item.title || '精彩视频推荐' }}</view>
						<view class="detail-meta">
							<text class="meta-view">{{ item.views || '2.3萬' }}次播放</text>
						</view>
					</view>
				</view>
				<view v-if="!recommendHasMore && recommendList.length > 0" class="load-more-tip">
					<text>没有更多了</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { VodApi_vod_details, VodApi_vod_like, VodApi_vod_collect } from '@/api/home.js';

	export default {
		data() {
			return {
				videoId: '',
				videoSrc: '',
				videoPoster: '',
				videoTitle: '',
				videoCode: '',
				videoDuration: '',
				videoViews: '',
				videoDesc: '',
				ratingPercent: 0,
				isFree: 0,
				isMember: false,
				playTime: 0,
				hasShownVipModal: false,
				isLiked: false,
				isCollected: false,
				likeCount: '0',
				collectCount: '0',
				videoYear: '',
				videoTags: [],
				recommendList: [],
				recommendPage: 1,
				recommendPageSize: 10,
				recommendTotal: 0,
				recommendLoading: false,
				recommendHasMore: true
			}
		},
		onLoad(options) {
			// 从跳转参数中获取视频ID
			if (options.id) {
				this.videoId = options.id;
			}
			// 获取用户会员状态
			const userInfo = uni.getStorageSync('userinfo');
			this.isMember = userInfo && userInfo.is_member === 1;
			// 调用接口获取视频详情
			this.loadVideoData();
			// 加载相关推荐
			this.loadRecommendList();
		},
		onReachBottom() {
			if (this.recommendLoading) return
			if (!this.recommendHasMore) return
			if (this.recommendList.length >= this.recommendTotal && this.recommendTotal > 0) {
				this.recommendHasMore = false
				return
			}
			this.recommendPage++
			this.loadRecommendList()
		},
		onUnload() {
			// 停止视频播放
			try {
				const videoContext = uni.createVideoContext('videoPlayer', this);
				videoContext.stop();
			} catch(e) {
				console.log('视频停止失败', e);
			}
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			loadVideoData() {
				if (!this.videoId) {
					return;
				}
				uni.showLoading({
					title: '加载中...'
				});
				VodApi_vod_details({ video_id: this.videoId }).then(res => {
					uni.hideLoading();
					if (res && res.code === 1 && res.data) {
						const data = res.data;
						this.videoTitle = data.title || this.videoTitle;
						this.videoSrc = data.video || '';
						this.videoPoster = data.cover_image || this.videoPoster;
						this.videoYear = data.year || '';
						this.videoTags = data.tags || [];
						this.videoDesc = data.content || data.description || data.desc || '';
						this.isFree = data.is_free !== undefined ? data.is_free : 1;
						this.likeCount = data.like_number || '0';
						this.collectCount = data.collect_number || '0';
						this.isCollected = data.is_collect == 1 ? true : false;
						this.isLiked = data.is_like == 1 ? true : false;
					} else {
						console.log('视频详情加载失败：', res);
					}
				}).catch(err => {
					uni.hideLoading();
					console.error('视频详情加载失败：', err);
				});
			},
			loadRecommendList() {
				this.recommendLoading = true
				this.recommendLoading = false
				this.recommendTotal = 0
				this.recommendHasMore = false
			},
			onPlay() {
				console.log('视频开始播放');
				this.playTime = 0;
			},
			onPause() {
				console.log('视频暂停');
			},
			onTimeUpdate(e) {
				if (e && e.detail && e.detail.currentTime !== undefined) {
					this.playTime = e.detail.currentTime;
				}
				// 如果不是免费视频且用户不是会员，限制观看10秒
				if (this.isFree === 0 && !this.isMember && this.playTime >= 10 && !this.hasShownVipModal) {
					this.hasShownVipModal = true;
					this.showVipModal();
				}
			},
			handleVideoError(e) {
				console.error('视频播放错误', e);
				console.error('当前视频地址：', this.videoSrc);
			},
			onEnded() {
				console.log('视频播放结束');
			},
			showVipModal() {
				// 暂停视频
				const videoContext = uni.createVideoContext('videoPlayer', this);
				videoContext.pause();
				
				uni.showModal({
					title: '会员专属',
					content: '此视频为VIP专属内容，开通会员即可观看完整视频',
					confirmText: '开通会员',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							uni.navigateTo({
								url: '/pages/mine/vip'
							});
						}
					}
				});
			},
			playVideo(item) {
				// 跳转到新的视频播放页面
				uni.redirectTo({
					url: '/pages/index/play?id=' + item.id + 
						'&title=' + encodeURIComponent(item.title) +
						'&poster=' + encodeURIComponent(item.poster) +
						'&video=' + encodeURIComponent(item.video || '') +
						'&duration=' + item.duration +
						'&views=' + item.views
				});
			},
			goToMore() {
				uni.switchTab({
					url: '/pages/index/index'
				});
			},
			toggleLike() {
				if (!this.videoId) return;
				VodApi_vod_like({ video_id: this.videoId }).then(res => {
					if (res && res.code === 1) {
						this.isLiked = !this.isLiked;
						if (this.isLiked) {
							this.likeCount = (parseInt(this.likeCount) + 1).toString();
						} else {
							this.likeCount = Math.max(0, parseInt(this.likeCount) - 1).toString();
						}
						uni.showToast({ title: this.isLiked ? '点赞成功' : '取消点赞', icon: 'none' });
					} else {
						uni.showToast({ title: '操作失败', icon: 'none' });
					}
				}).catch(err => {
					console.error('点赞失败:', err);
					uni.showToast({ title: '点赞失败', icon: 'none' });
				});
			},
			toggleCollect() {
				if (!this.videoId) return;
				VodApi_vod_collect({ video_id: this.videoId }).then(res => {
					if (res && res.code === 1) {
						this.isCollected = !this.isCollected;
						if (this.isCollected) {
							this.collectCount = (parseInt(this.collectCount) + 1).toString();
						} else {
							this.collectCount = Math.max(0, parseInt(this.collectCount) - 1).toString();
						}
						uni.showToast({ title: this.isCollected ? '收藏成功' : '取消收藏', icon: 'none' });
					} else {
						uni.showToast({ title: '操作失败', icon: 'none' });
					}
				}).catch(err => {
					console.error('收藏失败:', err);
					uni.showToast({ title: '收藏失败', icon: 'none' });
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
		padding-bottom: 30rpx;
	}

	/* 自定义导航栏 */
	.custom-navbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 30rpx 20rpx;
		background-color: #16213e;
		position: sticky;
		top: 0;
		z-index: 100;
	}

	.navbar-back {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.navbar-title {
		font-size: 32rpx;
		color: #fff;
		font-weight: 600;
	}

	.navbar-placeholder {
		width: 60rpx;
	}

	.video-container {
		width: 100%;
		height: 420rpx;
		background-color: #000;
		position: relative;
	}

	.video-player {
		width: 100%;
		height: 100%;
	}

	.video-placeholder {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: #000;
	}

	.placeholder-text {
		color: #888;
		font-size: 28rpx;
	}

	.vip-label {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 24rpx;
		color: #ff6347;
		background-color: rgba(255, 99, 71, 0.25);
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		margin-right: 15rpx;
		font-weight: 700;
		flex-shrink: 0;
		border: 1rpx solid rgba(255, 99, 71, 0.4);
	}

	.video-title-row {
		display: flex;
		align-items: flex-start;
		margin-bottom: 20rpx;
	}

	.ad-section {
		padding: 20rpx 30rpx;
	}

	.ad-banner {
		position: relative;
		width: 100%;
		height: 180rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.ad-image {
		width: 100%;
		height: 100%;
	}

	.ad-label {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		background-color: rgba(231, 76, 60, 0.9);
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
	}

	.video-info {
		padding: 30rpx;
		background-color: #16213e;
		margin: 0 20rpx 20rpx;
		border-radius: 16rpx;
	}

	.video-title {
		font-size: 32rpx;
		color: #fff;
		font-weight: 600;
		line-height: 1.5;
		margin-bottom: 20rpx;
	}

	.video-meta {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 25rpx;
	}

	.meta-item {
		margin-right: 30rpx;
		margin-bottom: 10rpx;
	}

	.meta-text {
		font-size: 24rpx;
		color: #999;
	}

	.video-actions {
		display: flex;
		gap: 60rpx;
		margin-bottom: 25rpx;
	}

	.action-item {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.action-icon {
		width: 36rpx;
		height: 36rpx;
	}

	.action-text {
		font-size: 26rpx;
		color: #999;
	}

	.video-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
		margin-bottom: 25rpx;
	}

	.video-tag {
		padding: 8rpx 20rpx;
		background-color: rgba(107, 163, 224, 0.2);
		color: #6BA3E0;
		font-size: 24rpx;
		border-radius: 20rpx;
	}

	.rating-section {
		display: flex;
		align-items: center;
		margin-bottom: 25rpx;
	}

	.rating-bar {
		flex: 1;
		height: 12rpx;
		background-color: #2a3a52;
		border-radius: 6rpx;
		overflow: hidden;
		margin-right: 20rpx;
	}

	.rating-fill {
		height: 100%;
		background: linear-gradient(90deg, #f39c12 0%, #ffd700 100%);
		border-radius: 6rpx;
		transition: width 0.3s ease;
	}

	.rating-text {
		font-size: 24rpx;
		color: #ffd700;
		font-weight: 500;
		white-space: nowrap;
	}

	.video-desc {
		margin-bottom: 0;
	}

	.desc-text {
		font-size: 26rpx;
		color: #ccc;
		line-height: 1.6;
	}

	.recommend-section {
		padding: 0 20rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 25rpx;
		padding: 0 10rpx;
	}

	.header-left {
		display: flex;
		align-items: center;
		gap: 15rpx;
	}

	.title-badge {
		width: 8rpx;
		height: 32rpx;
		background: linear-gradient(180deg, #ffd700 0%, #ff8c00 100%);
		border-radius: 4rpx;
	}

	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
	}

	.section-more {
		display: flex;
		align-items: center;
	}

	.section-more text {
		font-size: 26rpx;
		color: #999;
	}

	.section-more .arrow {
		font-size: 32rpx;
		margin-left: 5rpx;
		color: #999;
	}

	.video-list {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
	}

	.video-card {
		display: flex;
		background-color: #16213e;
		border-radius: 12rpx;
		overflow: hidden;
		padding: 15rpx;
	}

	.video-cover {
		width: 240rpx;
		height: 160rpx;
		position: relative;
		flex-shrink: 0;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.cover-image {
		width: 100%;
		height: 100%;
	}

	.video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70rpx;
		height: 70rpx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play-icon {
		color: #fff;
		font-size: 28rpx;
		margin-left: 4rpx;
	}

	.video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 20rpx;
		padding: 4rpx 10rpx;
		border-radius: 6rpx;
	}

	.video-detail {
		flex: 1;
		padding: 0 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.detail-title {
		font-size: 26rpx;
		color: #fff;
		font-weight: 500;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.detail-meta {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.meta-view {
		font-size: 22rpx;
		color: #999;
	}

	.load-more-tip {
		padding: 30rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}
</style>