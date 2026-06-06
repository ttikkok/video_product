<template>
	<view class="page">
		<!-- 固定顶部导航 -->
		<view class="fixed-header">
			<!-- 顶部搜索栏 -->
			<view class="search-header">
				<view class="search-bar">
					<image src="../../static/images/search.png" mode="widthFix" style="width:32rpx;" class="search-icon" />
					<input 
						class="search-input" 
						placeholder="搜索帖子" 
						v-model="searchKeyword"
						@confirm="handleSearch"
						@input="handleSearchInput"
					/>
					<view v-if="searchKeyword" class="search-clear" @click="clearSearch">✕</view>
				</view>
				<view class="search-actions">
					<image src="../../static/images/tongzhi.png" mode="widthFix" class="action-icon" @click="goToMessages" />
				</view>
			</view>

			<!-- 标签导航 -->
			<scroll-view scroll-x class="nav-tabs">
				<view class="tabs">
					<view 
						v-for="(category, index) in categoryList" 
						:key="category.id || index"
						:class="['tab-item', { active: activeTab === index }]"
						@click="switchNavTab(index)"
					>
						{{ category.name }}
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 帖子列表 -->
		<scroll-view scroll-y class="post-list" @scrolltolower="loadMore">
			<!-- 空状态 -->
			<u-empty v-if="!loading && postList.length === 0" :text="'暂无数据'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

			<template v-if="postList.length > 0">
				<view v-for="(post, index) in postList" :key="index" class="post-card">
					<view v-if="post.is_advertise" class="advertise-card" @click="openAdvertiseUrl(post.url)">
						<image :src="post.image || post.cover_image" mode="widthFix" class="advertise-image" />
					</view>
					<view v-else @click="goToDetail(post)">
				<!-- 帖子内容 -->
				<view class="post-content">
					<text>{{ post.title }}</text>
				</view>

				<!-- 视频直接加载 -->
				<view v-if="post.video" class="post-media video-container">
					<video 
						:src="post.video" 
						class="video-player" 
						:poster="post.images && post.images.length > 0 ? post.images[0] : post.cover_image"
						:duration="post.duration"
						controls
						show-center-play-btn
						enable-progress-gesture
					/>
					<text v-if="post.duration" class="video-duration">{{ post.duration }}</text>
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
				<view v-else-if="post.images && post.images.length === 1" class="post-media single-image">
					<image :src="post.images[0]" mode="aspectFill" class="media-image" @click.stop="previewImage(post.images, 0)" />
				</view>

				<!-- 帖子标签 -->
				<view v-if="post.tags && post.tags.length > 0" class="post-tags">
					<view v-for="(tag, tagIndex) in post.tags" :key="tagIndex" class="post-tag">
						{{ tag }}
					</view>
				</view>

				<!-- 互动数据 -->
				<view class="post-stats">
					<view class="stat-item">
						<image src="../../static/images/look.png" mode="widthFix" class="stat-icon" />
						<text class="stat-text">{{ post.look_number }}</text>
					</view>
					<view :class="['stat-item', { active: post.is_like === 1 }]" @click.stop="toggleLike(post)">
						<image :src="post.is_like === 1 ? '../../static/images/goods_active.png' : '../../static/images/goods.png'" mode="widthFix" class="stat-icon" />
						<text class="stat-text">{{ post.like_number }}</text>
					</view>
					<view :class="['stat-item', { active: post.is_collect === 1 }]" @click.stop="toggleCollect(post)">
						<image :src="post.is_collect === 1 ? '../../static/images/collect_active.png' : '../../static/images/collect.png'" mode="widthFix" class="stat-icon" />
						<text class="stat-text">{{ post.collect_number }}</text>
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
				</view>
			</template>
			<!-- 加载更多 -->
			<u-loadmore 
				v-if="postList.length > 0" 
				:status="loading ? 'loading' : (hasMore ? 'loadmore' : 'nomore')" 
				loading-text="加载中" 
				loadmore-text="加载中" 
				nomore-text="暂无更多数据" 
				class="py-3" 
			/>
		</scroll-view>

		<!-- 图片预览遮罩 -->
		<view v-if="showPreview" class="preview-overlay" @click="closePreview">
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
	import { CircleApi_circle_data_list, CircleApi_circle_type_list, CircleApi_circle_data_list_search, CircleApi_circle_like, CircleApi_circle_collect, AdvertiseApi_advertise_list } from '@/api/home.js'
	export default {
		data() {
			return {
				activeTab: 0,
				categoryList: [],
				currentCategoryId: null,
				postList: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				searchKeyword: '',
				hasMore: true,
				showPreview: false,
				previewImages: [],
				currentPreviewIndex: 0,
				advertiseList: []
			}
		},
		onLoad() {
			this.loadCategoryList()
			this.loadAdvertiseList()
			this.loadPostList()
		},
		methods: {
			loadMore() {
				if (this.loading) return
				if (!this.hasMore) return
				if (this.postList.length >= this.total && this.total > 0) {
					this.hasMore = false
					return
				}
				this.page++
				if (this.searchKeyword) {
					this.loadSearchList()
				} else {
					this.loadPostList()
				}
			},
			loadAdvertiseList() {
				AdvertiseApi_advertise_list({ name: '朋友圈广告位' }).then(res => {
					if (res && res.code === 1 && res.data && res.data.length > 0) {
						this.advertiseList = res.data
					}
				}).catch(err => {
					console.error('广告列表加载失败', err)
				})
			},
			insertAdvertise(list) {
				if (!this.advertiseList || this.advertiseList.length === 0) {
					return list
				}
				const result = []
				let advertiseIndex = 0
				const advertiseCount = this.advertiseList.length
				list.forEach((item, index) => {
					result.push(item)
					if ((index + 1) % 3 === 0) {
						result.push({
							...this.advertiseList[advertiseIndex % advertiseCount],
							is_advertise: true,
							ad_index: advertiseIndex
						})
						advertiseIndex++
					}
				})
				return result
			},
			openAdvertiseUrl(url) {
				if (url) {
					plus.runtime.openURL(url, function(res) {
						console.log('打开链接成功', res)
					}, function(err) {
						console.error('打开链接失败', err)
						uni.showToast({ title: '打开链接失败', icon: 'none' })
					})
				}
			},
			loadCategoryList() {
				CircleApi_circle_type_list().then(res => {
					if (res && res.code === 1 && res.data && res.data.length > 0) {
						this.categoryList = res.data
					} else {
						this.categoryList = [
							{ id: 0, name: '推荐' },
							{ id: 1, name: '视频' },
							{ id: 2, name: '图片' },
							{ id: 3, name: '话题' }
						]
					}
				}).catch(err => {
					console.error('分类列表加载失败', err)
					this.categoryList = [
						{ id: 0, name: '推荐' },
						{ id: 1, name: '视频' },
						{ id: 2, name: '图片' },
						{ id: 3, name: '话题' }
					]
				})
			},
			switchNavTab(index) {
				this.activeTab = index
				this.currentCategoryId = this.categoryList[index] && this.categoryList[index].id !== undefined ? this.categoryList[index].id : null
				this.page = 1
				this.postList = []
				this.loadPostList()
			},
			handleSearchInput() {
				if (!this.searchKeyword) {
					this.page = 1
					this.postList = []
					this.loadPostList()
				}
			},
			handleSearch() {
				if (this.searchKeyword.trim()) {
					this.page = 1
					this.postList = []
					this.loadSearchList()
				}
			},
			clearSearch() {
				this.searchKeyword = ''
				this.page = 1
				this.postList = []
				this.loadPostList()
			},
			loadSearchList(callback) {
				this.loading = true
				if (this.page === 1) {
					uni.showLoading({
						title: '加载中...'
					})
				}
				CircleApi_circle_data_list_search({ 
					page: this.page, 
					pagesize: this.pageSize,
					title: this.searchKeyword 
				}).then(res => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					if (res && res.code === 1 && res.data) {
						this.total = res.data.total || 0
						if (res.data.rows && res.data.rows.length > 0) {
							if (this.page === 1) {
								this.postList = res.data.rows
							} else {
								this.postList = [...this.postList, ...res.data.rows]
							}
						}
					} else {
						if (this.page === 1) {
							this.postList = []
						}
					}
					if (typeof callback === 'function') {
						callback()
					}
				}).catch(err => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					console.error('搜索失败', err)
					if (typeof callback === 'function') {
						callback()
					}
				})
			},
			goToDetail(post) {
				const postData = encodeURIComponent(JSON.stringify(post));
				uni.navigateTo({
					url: `/pages/banana/detail?post=${postData}`
				});
			},
			playVideo(post) {
				if (post.video) {
					uni.navigateTo({
						url: `/pages/index/play?id=${post.id}&title=${encodeURIComponent(post.title)}`
					})
				}
			},
			goToMessages() {
				uni.navigateTo({
					url: '/pages/mine/messages'
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
			},
			loadPostList(callback) {
				this.loading = true
				if (this.page === 1) {
					uni.showLoading({
						title: '加载中...'
					})
				}
				let params = { page: this.page, pagesize: this.pageSize }
				if (this.currentCategoryId !== null && this.currentCategoryId !== undefined) {
					params.category_id = this.currentCategoryId
				}
				CircleApi_circle_data_list(params).then(res => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					if (res && res.code === 1 && res.data) {
						this.total = res.data.total || 0
						const rows = res.data.rows || []
						if (rows.length > 0) {
							if (this.page === 1) {
								this.postList = this.insertAdvertise(rows)
							} else {
								const newRows = this.insertAdvertise(rows)
								this.postList = [...this.postList, ...newRows]
							}
						}
						if (rows.length < this.pageSize) {
							this.hasMore = false
						}
					} else {
						if (this.page === 1) {
							this.loadStaticData()
						}
					}
					if (typeof callback === 'function') {
						callback()
					}
				}).catch(err => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					console.error('帖子列表加载失败', err)
					if (this.page === 1) {
						this.loadStaticData()
					}
					if (typeof callback === 'function') {
						callback()
					}
				})
			},
			loadStaticData() {
				this.postList = [
					{
						id: 1,
						title: '互联网现在发展很快',
						tags: ['互联网', '计算机'],
						video: '',
						images: [
							'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20portrait%20artistic&image_size=square'
						],
						look_number: 12,
						like_number: 1,
						collect_number: 0,
						is_like: 0,
						is_collect: 0
					},
					{
						id: 2,
						title: '今天天气真好',
						tags: ['日常', '生活'],
						video: '',
						images: [
							'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20landscape%20nature&image_size=portrait_4_3',
							'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20sky%20clouds&image_size=portrait_4_3'
						],
						look_number: 89,
						like_number: 12,
						collect_number: 3,
						is_like: 0,
						is_collect: 0
					}
				]
				this.total = 2
			},
			toggleLike(post) {
				CircleApi_circle_like({ circle_id: post.id }).then(res => {
					if (res && res.code === 1) {
						if (post.is_like === 1) {
							post.is_like = 0
							post.like_number = Math.max(0, post.like_number - 1)
						} else {
							post.is_like = 1
							post.like_number++
						}
						uni.showToast({ title: res.msg || (post.is_like === 1 ? '点赞成功' : '取消点赞'), icon: 'none' })
					} else {
						uni.showToast({ title: res.msg || '操作失败', icon: 'none' })
					}
				}).catch(err => {
					console.error('点赞失败', err)
					uni.showToast({ title: '操作失败', icon: 'none' })
				})
			},
			toggleCollect(post) {
				CircleApi_circle_collect({ circle_id: post.id }).then(res => {
					if (res && res.code === 1) {
						if (post.is_collect === 1) {
							post.is_collect = 0
							post.collect_number = Math.max(0, post.collect_number - 1)
						} else {
							post.is_collect = 1
							post.collect_number++
						}
						uni.showToast({ title: res.msg || (post.is_collect === 1 ? '收藏成功' : '取消收藏'), icon: 'none' })
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

<style lang="scss" scoped>
	.page {
		// min-height: 100vh;
		background-color: #1a1a2e;
		// padding-bottom: 98rpx;
		// box-sizing: border-box;
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
		gap: 20rpx;
	}

	.search-bar {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
		padding: 15rpx 25rpx;
	}

	.search-actions {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.action-icon {
		width: 48rpx;
		height: 48rpx;
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

	.search-clear {
		width: 40rpx;
		height: 40rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999;
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

	/* 加载状态 */
	.loading-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.loading-spinner {
		width: 60rpx;
		height: 60rpx;
		border: 4rpx solid rgba(107, 163, 224, 0.3);
		border-top-color: #6BA3E0;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		margin-top: 20rpx;
		font-size: 28rpx;
		color: #999;
	}

	/* 空状态 */
	.empty-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	/* 帖子列表 */
	.post-list {
		height: calc(100vh - 200rpx - 98rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 200rpx - 98rpx - env(safe-area-inset-bottom));
		padding-top: calc(200rpx + constant(safe-area-inset-top));
		padding-top: calc(200rpx + env(safe-area-inset-top));
		box-sizing: content-box;
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
		font-size: 24rpx;
		padding: 6rpx 16rpx;
		border-radius: 6rpx;
		background-color: rgba(107, 163, 224, 0.2);
		color: #6BA3E0;
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
		// border-radius: 12rpx;
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

	.video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100rpx;
		height: 100rpx;
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

	.video-container {
		position: relative;
		width: 100%;
	}

	.video-player {
		width: 100%;
		height: 400rpx;
	}

	.video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		font-size: 24rpx;
		color: #fff;
		z-index: 10;
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4rpx;
	}

	.grid-image {
		width: 100%;
		height: 220rpx;
	}

	.single-image .media-image {
		height: auto;
		max-height: 500rpx;
	}

	/* 互动数据 */
	.post-stats {
		display: flex;
		align-items: center;
		gap: 50rpx;
		margin-bottom: 15rpx;
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 5rpx;
		// font-size: 24rpx;
		color: #999;
		white-space: nowrap;
	}

	.stat-icon {
		width: 30rpx;
		height: 30rpx;
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

	.load-more-tip {
		padding: 30rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}

	/* 图片预览 */
	.preview-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.95);
		z-index: 1000;
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

	.advertise-card {
		background-color: #1a1a2e;
		border-radius: 12rpx;
		overflow: hidden;
		margin-bottom: 15rpx;
	}

	.advertise-image {
		width: 100%;
		height: 80rpx;
		display: block;
	}
</style>
