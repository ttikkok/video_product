<template>
	<view class="page">
		<!-- 顶部自定义导航栏 -->
		<view class="top-header">
			<u-status-bar bgColor="#16213e"></u-status-bar>
			<view class="custom-navbar">
				<view class="navbar-back" @click="goBack">
					<image src="/static/images/back.png" class="back-icon" mode="aspectFit"></image>
				</view>
				<view class="navbar-title">视频播放</view>
				<view class="navbar-placeholder"></view>
			</view>
		</view>

		<u-status-bar></u-status-bar>
		<!-- 视频播放窗口 -->
		<view class="video-container">
			<video 
			v-if="videoSrc"
			id="videoPlayer"
			class="video-player"
			:src="videoSrc"
			:poster="videoPoster"
			:autoplay="false"
			:show-center-play-btn="true"
			:controls="true"
			:enable-progress-gesture="true"
			:show-play-btn="true"
			:show-fullscreen-btn="true"
			:enable-play-gesture="true"
			:show-mute-btn="false"
			:enable-auto-rotation="false"
			object-fit="contain"
			playsinline
			webkit-playsinline
			@play="onPlay"
			@pause="onPause"
			@timeupdate="onTimeUpdate"
			@error="handleVideoError"
			@ended="onEnded"
			@loadedmetadata="onLoadedMetadata"
			@canplay="onCanPlay"
			@waiting="onVideoWaiting"
			@seeked="onSeeked"
		></video>
			<view v-if="!videoSrc" class="video-placeholder">
				<view class="loading-spinner"></view>
				<text class="placeholder-text">视频加载中...</text>
			</view>
			<view v-if="videoSrc && videoError" class="video-error">
				<text class="error-text">{{ videoErrorText }}</text>
				<view class="retry-btn" @click="retryPlay">重试</view>
			</view>
		</view>

		

		<!-- 视频信息 -->
		<view class="video-info">
			<view class="video-title-row">
				<view v-if="isFree === 0" class="vip-label">VIP</view>
				<view class="video-title">{{ videoTitle }}</view>
			</view>
			<view class="video-meta">
				<!-- <view class="meta-item">
					<text class="meta-text">番號: {{ videoCode }}</text>
				</view> -->
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

			<!-- <view class="rating-section">
				<view class="rating-bar">
					<view class="rating-fill" :style="{ width: ratingPercent + '%' }"></view>
				</view>
				<text class="rating-text">好評 {{ ratingPercent }}%</text>
			</view> -->

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

			<!-- 广告区域 -->
			<view v-if="recommendAdvertise" class="ad-item" @click="openAdUrl(recommendAdvertise.url)">
				<image :src="recommendAdvertise.image" mode="aspectFill" class="ad-image" />
				<view class="ad-overlay">
					<text class="ad-title">{{ recommendAdvertise.title }}</text>
				</view>
			</view>

			<view class="video-list">
				<view 
					v-for="(item, index) in recommendList" 
					:key="index" 
					class="content-item" 
					@click="playVideo(item)"
				>
					<view class="item-cover-wrap">
						<view class="item-title-overlay">
							<text class="item-title">{{ item.title || '精彩视频推荐' }}</text>
						</view>
						<image :src="item.cover_image || item.poster" mode="aspectFill" class="cover-image" />
						<view class="video-overlay">
							<view class="play-icon">▶</view>
						</view>
						<text class="play-count">{{ item.look_number || item.views || '0' }}次播放</text>
						<text class="video-duration">{{ item.duration || '00:15:00' }}</text>
						<view v-if="item.is_free === 0" class="vip-badge">VIP</view>
					</view>
					<view class="item-footer">
						<text class="time-text">{{ item.createtime ? formatTime(item.createtime) : '' }} 发布</text>
						<view class="item-like">
							<image :src="item.is_like == 1 ? '../../static/images/goods_active.png' : '../../static/images/goods.png'" mode="widthFix" class="like-icon" />
							<text class="like-text">{{ item.like_number || item.likeNumber || 0 }}</text>
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
	import { VodApi_vod_details, VodApi_vod_like, VodApi_vod_collect, UserApi_get_user_info, VodApi_get_recommend_videos } from '@/api/home.js';

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
				videoError: false,
				videoErrorText: '',
				hasLoadedOnce: false,
				showingVipModal: false,
				recommendList: [],
				recommendAdvertise: null,
				recommendPage: 1,
				recommendPageSize: 10,
				recommendTotal: 0,
				recommendLoading: false,
				recommendHasMore: true,
				playTimer: null
			}
		},
		onLoad(options) {
			// #ifdef APP-PLUS
			// 禁用HTML5+ Runtime版本检查，防止弹出模块缺失提示
			if (plus && plus.runtime && typeof plus.runtime.setRuntimeVersionCheck === 'function') {
				plus.runtime.setRuntimeVersionCheck(false);
			}
			// #endif
			// 从跳转参数中获取视频ID
			if (options.id) {
				this.videoId = options.id;
			}
			// 先从本地缓存获取用户会员状态
			const userInfo = uni.getStorageSync('userinfo');
			this.isMember = userInfo && userInfo.is_member === 1;
			// 调用接口获取最新用户信息
			this.loadUserInfo();
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
			// 清理定时器
			this.clearPlayTimer();
			// 停止视频播放
			try {
				const videoContext = uni.createVideoContext('videoPlayer', this);
				videoContext.stop();
			} catch(e) {
				console.log('视频停止失败', e);
			}
		},
		methods: {
			formatTime(timestamp) {
				if (!timestamp) return '';
				const date = new Date(timestamp * 1000);
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, '0');
				const day = String(date.getDate()).padStart(2, '0');
				return `${year}-${month}-${day}`;
			},
			goBack() {
				uni.navigateBack();
			},
			openAdUrl(url) {
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
				// 其他平台（微信小程序等）
				uni.setClipboardData({
					data: url,
					success: () => {
						uni.showToast({ title: '链接已复制，请到浏览器打开', icon: 'none' })
					}
				})
			},
			startPlayTimer() {
				this.clearPlayTimer();
			},
			clearPlayTimer() {
				if (this.playTimer) {
					clearTimeout(this.playTimer);
					this.playTimer = null;
				}
			},
			loadUserInfo() {
				UserApi_get_user_info().then(res => {
					if (res && res.code === 1 && res.data) {
						const userInfo = res.data;
						if (userInfo.userinfo && userInfo.userinfo.is_member !== undefined) {
							this.isMember = userInfo.userinfo.is_member === 1;
							// 更新本地缓存
							uni.setStorageSync('userinfo', userInfo.userinfo);
						}
					}
				}).catch(err => {
					console.error('获取用户信息失败:', err);
				});
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
				VodApi_get_recommend_videos({ 
					video_id: this.videoId,
					page: this.recommendPage,
					page_size: this.recommendPageSize
				}).then(res => {
					console.log('推荐视频接口返回:', res);
					if (res.code === 1 && res.data) {
						// 只有第一页时才更新广告
						if (this.recommendPage === 1) {
							this.recommendAdvertise = res.data.advertise && res.data.advertise.length > 0 ? res.data.advertise[0] : null;
						}
						// 添加推荐视频列表
						if (res.data.list && res.data.list.length > 0) {
							if (this.recommendPage === 1) {
								this.recommendList = res.data.list;
							} else {
								this.recommendList = [...this.recommendList, ...res.data.list];
							}
							this.recommendTotal = res.data.total || this.recommendList.length;
						} else {
							this.recommendHasMore = false;
						}
					}
				}).catch(err => {
					console.error('加载推荐视频失败:', err);
				}).finally(() => {
					this.recommendLoading = false;
				});
			},
			onPlay() {
				console.log('视频开始播放');
				this.videoError = false;
				this.playTime = 0;
			},
			onPause() {
				console.log('视频暂停');
			},
			onLoadedMetadata(e) {
				console.log('视频元数据加载完成:', e);
				console.log('视频时长:', e.detail.duration);
				this.hasLoadedOnce = true;
			},
			onCanPlay() {
				console.log('视频可以播放了');
			},
			onVideoWaiting() {
				console.log('视频缓冲中...');
			},
			onTimeUpdate(e) {
				if (e && e.detail && e.detail.currentTime !== undefined) {
					this.playTime = e.detail.currentTime;
				}
				this.checkMemberLimit();
			},
			checkMemberLimit() {
				if (this.showingVipModal) {
					return;
				}
				const userInfo = uni.getStorageSync('userinfo');
				const currentIsMember = userInfo && userInfo.is_member === 1;
				if (this.isFree === 0 && !currentIsMember && this.playTime >= 5) {
					console.log('检测到非会员超过5秒限制');
					this.showingVipModal = true;
					try {
						const videoContext = uni.createVideoContext('videoPlayer', this);
						videoContext.pause();
						videoContext.seek(5);
					} catch(e) {
						console.log('暂停视频失败', e);
					}
					this.playTime = 5;
					this.showVipModal();
				}
			},
			onSeeked(e) {
				console.log('用户拖动进度条完成');
				if (e && e.detail && e.detail.currentTime !== undefined) {
					this.playTime = e.detail.currentTime;
				}
				this.checkMemberLimit();
			},
			handleVideoError(e) {
				console.error('视频播放错误', e);
				console.error('当前视频地址：', this.videoSrc);
				if (e && e.detail) {
					if (e.detail.errCode) {
						if (e.detail.errCode === -1) {
							this.videoError = true;
							this.videoErrorText = '视频资源加载失败，请检查网络';
						} else if (e.detail.errCode === -2) {
							this.videoError = true;
							this.videoErrorText = '视频格式不支持';
						} else if (e.detail.errCode === -3) {
							this.videoError = true;
							this.videoErrorText = '视频解码失败';
						} else {
							console.log('忽略非致命视频错误:', e.detail.errCode);
							return;
						}
						uni.showToast({
							title: this.videoErrorText,
							icon: 'none',
							duration: 3000
						});
					}
				}
			},
			retryPlay() {
				this.videoError = false;
				if (this.videoSrc) {
					const videoContext = uni.createVideoContext('videoPlayer', this);
					videoContext.load();
					videoContext.play();
				}
			},
			onEnded() {
				console.log('视频播放结束');
			},
			showVipModal() {
				const videoContext = uni.createVideoContext('videoPlayer', this);
				videoContext.pause();
				
				uni.showModal({
					title: '会员专属',
					content: '此视频为VIP专属内容，开通会员即可观看完整视频',
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
	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9999;
		padding: 30rpx 30rpx;
		background-color: #16213e;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}

	.custom-navbar {
		// position: fixed;
		// top: var(--status-bar-height, 44px);
		// left: 0;
		// right: 0;
		// z-index: 100;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		// padding: 20rpx 30rpx;
		// background-color: #16213e;
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
		padding-top: 120rpx;
	}

	.video-player {
		width: 100%;
		height: 100%;
	}

	.video-placeholder {
		position: absolute;
		top: 120rpx;
		left: 0;
		width: 100%;
		height: calc(100% - 120rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: #000;
	}

	.loading-spinner {
		width: 60rpx;
		height: 60rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.3);
		border-top-color: #ff6b6b;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.placeholder-text {
		margin-top: 20rpx;
		color: #888;
		font-size: 28rpx;
	}

	.video-error {
		position: absolute;
		top: 120rpx;
		left: 0;
		width: 100%;
		height: calc(100% - 120rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		background-color: rgba(0, 0, 0, 0.8);
	}

	.error-text {
		color: #ff6b6b;
		font-size: 28rpx;
		margin-bottom: 30rpx;
	}

	.retry-btn {
		padding: 20rpx 60rpx;
		background-color: #ff6b6b;
		color: #fff;
		font-size: 28rpx;
		border-radius: 40rpx;
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
		line-height: 56rpx;
		// margin-bottom: 20rpx;
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

	.ad-item {
		margin-bottom: 15rpx;
		border-radius: 16rpx;
		overflow: hidden;
		position: relative;
	}

	.ad-image {
		width: 100%;
		height: 200rpx;
	}

	.ad-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		padding: 40rpx 20rpx 15rpx;
	}

	.ad-title {
		color: #fff;
		font-size: 24rpx;
	}

	.video-list {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.content-item {
		background-color: #16213e;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.item-cover-wrap {
		position: relative;
		width: 100%;
		height: 370rpx;
	}

	.item-title-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
		padding: 60rpx 20rpx 15rpx;
	}

	.item-title {
		color: #fff;
		font-size: 28rpx;
		font-weight: 500;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
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
		width: 80rpx;
		height: 80rpx;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.play-icon {
		color: #fff;
		font-size: 32rpx;
		margin-left: 5rpx;
	}

	.video-duration {
		position: absolute;
		bottom: 15rpx;
		right: 15rpx;
		background-color: rgba(0, 0, 0, 0.7);
		color: #fff;
		font-size: 22rpx;
		padding: 6rpx 12rpx;
		border-radius: 8rpx;
	}

	.play-count {
		position: absolute;
		top: 15rpx;
		left: 15rpx;
		background-color: rgba(0, 0, 0, 0.6);
		color: #fff;
		font-size: 22rpx;
		padding: 6rpx 12rpx;
		border-radius: 8rpx;
	}

	.vip-badge {
		position: absolute;
		top: 15rpx;
		right: 15rpx;
		background: linear-gradient(135deg, #ffd700, #ff8c00);
		color: #1a1a1a;
		font-size: 22rpx;
		font-weight: 600;
		padding: 6rpx 12rpx;
		border-radius: 8rpx;
	}

	.item-footer {
		padding: 16rpx 20rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.time-text {
		font-size: 26rpx;
		color: #999;
	}

	.item-like {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.like-icon {
		width: 32rpx;
		height: 32rpx;
	}

	.like-text {
		font-size: 26rpx;
		color: #999;
	}

	.load-more-tip {
		padding: 30rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}
</style>