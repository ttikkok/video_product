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
				:object-fit="contain"
				@play="onPlay"
				@pause="onPause"
				@error="onError"
				@ended="onEnded"
			></video>
		</view>

		<!-- 广告位 -->
		<view class="ad-section">
			<view class="ad-banner">
				<image 
					src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20ad%20banner%20promotion&image_size=landscape_16_9" 
					mode="aspectFill" 
					class="ad-image"
				/>
				<view class="ad-label">广告</view>
			</view>
		</view>

		<!-- 视频信息 -->
		<view class="video-info">
			<view class="video-title">{{ videoTitle }}</view>
			<view class="video-meta">
				<view class="meta-item">
					<text class="meta-text">番號: {{ videoCode }}</text>
				</view>
				<view class="meta-item">
					<text class="meta-text">時長: {{ videoDuration }}</text>
				</view>
				<view class="meta-item">
					<text class="meta-text">播放: {{ videoViews }}</text>
				</view>
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
							:src="item.poster || 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20video%20thumbnail&image_size=portrait_4_3'" 
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
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				videoId: '',
				videoSrc: 'https://example.com/video.mp4',
				videoPoster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20video%20poster%20cover&image_size=landscape_16_9',
				videoTitle: '【极品探花】顶级外围女神颜值爆表，极品长腿酒店约会',
				videoCode: 'FSDSS-789',
				videoDuration: '01:12:45',
				videoViews: '18.6萬',
				videoDesc: '精彩内容简介，视频相关介绍信息，本视频包含精彩剧情，不容错过...',
				ratingPercent: 95,
				recommendList: [
					{
						id: 1,
						title: '【太子极品探花】现代版黑裙少妇，穿上情趣装沙发上干后猛...',
						poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20pink%20dress%20video%20thumbnail&image_size=portrait_4_3',
						duration: '00:42:40',
						views: '2.0萬'
					},
					{
						id: 2,
						title: '【北寻花】高颜值长相甜美萌妹啪啪，连喘情绪超带感口交后入猛...',
						poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20sofa%20video%20thumbnail&image_size=portrait_4_3',
						duration: '00:25:12',
						views: '2.5萬'
					},
					{
						id: 3,
						title: '素人打野毒浓探花老嫖带你探外围，完美视角拍摄起来超浪...',
						poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=couple%20sofa%20intimate%20video%20thumbnail&image_size=portrait_4_3',
						duration: '01:16:05',
						views: '3.7萬'
					},
					{
						id: 4,
						title: '【富二代约会】重金约网红嫩模，颜值身材在线',
						poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20living%20room%20video%20thumbnail&image_size=portrait_4_3',
						duration: '00:55:30',
						views: '25.3萬'
					},
					{
						id: 5,
						title: '【国产精品】人妻少妇寂寞难耐',
						poster: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20wife%20domestic%20video%20thumbnail&image_size=portrait_4_3',
						duration: '01:08:20',
						views: '32.1萬'
					}
				]
			}
		},
		onLoad(options) {
			// 从跳转参数中获取视频信息
			if (options.id) {
				this.videoId = options.id;
			}
			if (options.title) {
				this.videoTitle = decodeURIComponent(options.title);
			}
			if (options.poster) {
				this.videoPoster = decodeURIComponent(options.poster);
			}
			if (options.duration) {
				this.videoDuration = options.duration;
			}
			if (options.views) {
				this.videoViews = options.views;
			}
			this.loadVideoData();
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
				uni.showLoading({
					title: '加载中...'
				});
				setTimeout(() => {
					uni.hideLoading();
				}, 500);
			},
			onPlay() {
				console.log('视频开始播放');
			},
			onPause() {
				console.log('视频暂停');
			},
			onError(e) {
				console.error('视频播放错误', e);
				uni.showToast({
					title: '视频加载失败',
					icon: 'none'
				});
			},
			onEnded() {
				console.log('视频播放结束');
			},
			playVideo(item) {
				// 跳转到新的视频播放页面
				uni.redirectTo({
					url: '/pages/index/play?id=' + item.id + 
						'&title=' + encodeURIComponent(item.title) +
						'&poster=' + encodeURIComponent(item.poster) +
						'&duration=' + item.duration +
						'&views=' + item.views
				});
			},
			goToMore() {
				uni.switchTab({
					url: '/pages/index/index'
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
</style>