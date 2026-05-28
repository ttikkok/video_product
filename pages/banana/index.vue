<template>
	<view class="page">
		<!-- 固定顶部导航 -->
		<view class="fixed-header">
			<!-- 顶部搜索栏 -->
			<view class="search-header">
				<view class="search-bar">
					<image src="../../static/images/search.png" mode="widthFix" style="width:32rpx;" class="search-icon" />
					<input class="search-input" placeholder="搜索帖子" />
				</view>
			</view>

			<!-- 标签导航 -->
			<scroll-view scroll-x class="nav-tabs">
				<view class="tabs">
					<view 
						v-for="(tab, index) in navTabs" 
						:key="index"
						:class="['tab-item', { active: activeTab === index }]"
						@click="switchNavTab(index)"
					>
						{{ tab.name }}
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 帖子列表 -->
		<scroll-view scroll-y class="post-list">
			<view v-for="(post, index) in postList" :key="index" class="post-card" @click="goToDetail(post)">
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
					<!-- <view class="follow-btn">+ 關注</view> -->
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
					<text v-if="post.hasMore" class="expand-text">_ 全部</text>
				</view>

				<!-- 帖子图片/视频 -->
				<view v-if="post.media" class="post-media">
					<image :src="post.media" mode="aspectFill" class="media-image" />
					<view v-if="post.mediaOverlay" class="media-overlay">
						<image :src="post.mediaOverlay" mode="aspectFill" class="overlay-image" />
					</view>
				</view>

				<!-- 互动数据 -->
				<view class="post-stats">
					<view class="stat-item">
						<image src="../../static/images/look.png" mode="widthFix" class="stat-icon" />
						<text class="stat-text">{{ post.views }}</text>
					</view>
					<!-- <view class="stat-item">
						<text class="stat-icon">💬</text>
						<text class="stat-text">{{ post.comments }}</text>
					</view> -->
					<view class="stat-item">
						<image src="../../static/images/dianzan.png" mode="widthFix" class="stat-icon" />
						<text class="stat-text">{{ post.likes }}</text>
					</view>
					<view class="stat-item">
						<image src="../../static/images/shoucang.png" mode="widthFix" class="stat-icon" />
						<!-- <text class="stat-icon">🤍</text> -->
					</view>
					<!-- <view class="stat-item">
						<text class="stat-icon">↗️</text>
					</view>
					<view class="stat-item reward-btn">
						<text class="stat-icon">🧧</text>
						<text class="stat-text">打賞</text>
					</view> -->
				</view>

				<!-- 位置标签 -->
				<!-- <view v-if="post.location" class="post-location">
					<text class="location-icon">📍</text>
					<text class="location-text">{{ post.location }}</text>
				</view> -->

				<!-- 话题标签 -->
				<!-- <view v-if="post.topics && post.topics.length > 0" class="post-topics">
					<view v-for="(topic, topicIndex) in post.topics" :key="topicIndex" class="topic-item">
						#{{ topic }}
					</view>
				</view> -->

				<!-- 回复预览 -->
				<!-- <view v-if="post.replies && post.replies.length > 0" class="post-replies">
					<view v-for="(reply, replyIndex) in post.replies" :key="replyIndex" class="reply-item">
						<image :src="reply.avatar" mode="aspectFill" class="reply-avatar" />
					</view>
				</view> -->

				<!-- 底部回复区 -->
				<!-- <view v-if="post.bottomReply" class="bottom-reply">
					<view class="reply-user-info">
						<image :src="post.bottomReply.avatar" mode="aspectFill" class="reply-user-avatar" />
						<view class="reply-user-details">
							<text class="reply-user-name">{{ post.bottomReply.userName }}</text>
							<view v-if="post.bottomReply.level" class="reply-user-level">LV.{{ post.bottomReply.level }}</view>
						</view>
					</view>
					<view class="reply-content">
						<text>{{ post.bottomReply.content }}</text>
					</view>
				</view> -->
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 1,
				navTabs: [
					{ name: '關注' },
					{ name: '推薦' },
					{ name: '同城樓鳳' },
					{ name: '視頻' },
					{ name: '圖片' },
					{ name: '話題' }
				],
				postList: [
					{
						avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20portrait%20avatar&image_size=square',
						userName: '好色先生官方帳號',
						level: 3,
						tags: [
							{ name: '置頂', bgColor: '#e74c3c', color: '#fff' },
							{ name: '原創', bgColor: '#3498db', color: '#fff' }
						],
						content: '好色先生官方棋牌平台，招募微信支付宝码商，押金2万起！\n棋牌平台长期收量，欢迎各大渠道联系合作 _ 全部',
						hasMore: true,
						media: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20video%20cover%20artistic&image_size=portrait_4_3',
						mediaOverlay: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=chinese%20casino%20ad%20banner&image_size=landscape_16_9',
						views: '296.2萬',
						comments: '1363',
						likes: '6134',
						location: '香港特别行政区',
						topics: ['最爱啪啪啪', '寂寞才自慰', 'AV番號交流'],
						replies: [
							{ avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait&image_size=square' },
							{ avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait&image_size=square' },
							{ avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait&image_size=square' },
							{ avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait&image_size=square' },
							{ avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait&image_size=square' },
							{ avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=user%20avatar%20portrait&image_size=square' }
						]
					},
					{
						avatar: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=handsome%20man%20portrait%20avatar&image_size=square',
						userName: '不安的流年、∞',
						level: 1,
						tags: [],
						content: '效果嘎嘎猛',
						hasMore: false,
						media: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=video%20call%20screenshot&image_size=landscape_16_9',
						views: '1.2萬',
						comments: '86',
						likes: '234',
						location: '',
						topics: [],
						replies: [],
						bottomReply: null
					}
				]
			}
		},
		methods: {
			switchNavTab(index) {
				this.activeTab = index;
			},
			goToDetail(post) {
				const postData = encodeURIComponent(JSON.stringify(post));
				uni.navigateTo({
					url: `/pages/banana/detail?post=${postData}`
				});
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
		padding-bottom: 98rpx;
	}

	.fixed-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background-color: #16213e;
		z-index: 100;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	/* 搜索头部 */
	.search-header {
		background-color: #16213e;
		padding: 20rpx 30rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.search-bar {
		width: 100%;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
		padding: 15rpx 25rpx;
	}

	.search-icon {
		margin-right: 15rpx;
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		color: #fff;
		font-size: 28rpx;
	}

	.header-actions {
		display: flex;
		gap: 15rpx;
	}

	.action-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.icon-text {
		font-size: 32rpx;
	}

	/* 导航标签 */
	.nav-tabs {
		background-color: #16213e;
		white-space: nowrap;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.tabs {
		display: inline-flex;
		gap: 40rpx;
		padding: 0 20rpx;
	}

	.tab-item {
		padding: 20rpx 10rpx;
		font-size: 30rpx;
		color: #999;
		position: relative;
		white-space: nowrap;
	}

	.tab-item.active {
		color: #ffd700;
		font-weight: 600;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 40rpx;
		height: 4rpx;
		background-color: #ffd700;
		border-radius: 2rpx;
	}

	/* 帖子列表 */
	.post-list {
		flex: 1;
		padding-top: calc(180rpx + constant(safe-area-inset-top));
		padding-top: calc(180rpx + env(safe-area-inset-top));
	}

	.post-card {
		background-color: #16213e;
		margin-bottom: 20rpx;
		padding: 20rpx;
	}

	/* 帖子头部 */
	.post-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 15rpx;
	}

	.user-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
	}

	.user-details {
		display: flex;
		flex-direction: column;
	}

	.user-name-row {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.user-name {
		font-size: 30rpx;
		color: #fff;
		font-weight: 500;
	}

	.user-level {
		background-color: #ffd700;
		color: #000;
		font-size: 20rpx;
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
	}

	.follow-btn {
		background-color: rgba(255, 255, 255, 0.1);
		color: #6BA3E0;
		font-size: 26rpx;
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
	}

	/* 帖子标签 */
	.post-tags {
		display: flex;
		gap: 10rpx;
		margin-bottom: 15rpx;
	}

	.post-tag {
		font-size: 22rpx;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
	}

	/* 帖子内容 */
	.post-content {
		font-size: 28rpx;
		color: #fff;
		line-height: 1.6;
		margin-bottom: 15rpx;
	}

	.expand-text {
		color: #6BA3E0;
	}

	/* 帖子媒体 */
	.post-media {
		position: relative;
		margin-bottom: 15rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.media-image {
		width: 100%;
		height: 400rpx;
		display: block;
	}

	.media-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.overlay-image {
		width: 100%;
		height: 100%;
	}

	/* 互动数据 */
	.post-stats {
		display: flex;
		align-items: center;
		gap: 30rpx;
		margin-bottom: 15rpx;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 5rpx;
		font-size: 24rpx;
		color: #999;
		white-space: nowrap;
	}

	.stat-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
		flex-shrink: 0;
	}

	.reward-btn {
		background-color: #e74c3c;
		color: #fff;
		padding: 5rpx 15rpx;
		border-radius: 4rpx;
		margin-left: auto;
	}

	.reward-btn .stat-text {
		color: #fff;
	}

	/* 位置标签 */
	.post-location {
		display: flex;
		align-items: center;
		gap: 5rpx;
		font-size: 24rpx;
		color: #6BA3E0;
		margin-bottom: 15rpx;
	}

	.location-icon {
		font-size: 24rpx;
	}

	/* 话题标签 */
	.post-topics {
		display: flex;
		gap: 15rpx;
		flex-wrap: wrap;
		margin-bottom: 15rpx;
	}

	.topic-item {
		font-size: 24rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.1);
		padding: 5rpx 12rpx;
		border-radius: 4rpx;
	}

	/* 回复预览 */
	.post-replies {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 15rpx;
		padding: 10rpx 0;
		border-top: 1rpx solid rgba(255, 255, 255, 0.05);
	}

	.reply-avatar {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
	}

	/* 底部回复 */
	.bottom-reply {
		background-color: rgba(255, 255, 255, 0.05);
		padding: 15rpx;
		border-radius: 8rpx;
	}

	.reply-user-info {
		display: flex;
		align-items: center;
		gap: 10rpx;
		margin-bottom: 10rpx;
	}

	.reply-user-avatar {
		width: 50rpx;
		height: 50rpx;
		border-radius: 50%;
	}

	.reply-user-details {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.reply-user-name {
		font-size: 26rpx;
		color: #fff;
	}

	.reply-user-level {
		background-color: #ffd700;
		color: #000;
		font-size: 18rpx;
		padding: 2rpx 6rpx;
		border-radius: 3rpx;
	}

	.reply-content {
		font-size: 26rpx;
		color: #ccc;
		line-height: 1.5;
	}
</style>
