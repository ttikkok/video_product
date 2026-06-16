<template>
	<view class="page">
		<!-- 帖子列表（包含头部，一起滚动） -->
		<scroll-view scroll-y class="scroll-container" @scrolltolower="loadMore">
			<!-- 页面头部 -->
			<view class="page-header">
				<u-status-bar bg-color="#16213e"></u-status-bar>
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

			<!-- 帖子列表内容 -->
			<view class="post-list">
			<u-status-bar></u-status-bar>
			<!-- 空状态 -->
			<u-empty v-if="!loading && postList.length === 0" :text="'暂无数据'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

			<template v-if="postList.length > 0">
				<view v-for="(post, index) in postList" :key="index" class="post-page">
					<view v-if="post.is_advertise" class="advertise-card" @click.stop="openAdvertiseUrl(post.url)">
						<image :src="post.image || post.cover_image" mode="aspectFill" class="advertise-image" />
					</view>
					<view v-else @click.stop="goToDetail(post)">
				<!-- 帖子内容 -->
				<view class="post-content">
					<text>{{ post.title }}</text>
				</view>

				<!-- 视频直接加载 -->
				<view v-if="post.video" class="post-media video-container" @click.stop>
					<sunny-video 
						 :ref="el => { if (el) videoRefs[index] = el }"
						 :video-id="'sunny-video-' + index"
						 title="视频"
						 :src="post.video" 
						 :poster="post.images && post.images.length > 0 ? post.images[0] : post.cover_image"
						 :trialTime="0.1"
						 :seekTime="0"
						 @timeupdate="timeupdate" 
						 @handleBtn="handleBtn" 
						 zIndex="0"
						 @click="() => handleVideoClick(index)"
						 @play="() => handleVideoPlay(index)"
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
			</view>
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
				actualDataCount: 0, // 实际数据条数（不包括广告）
				showPreview: false,
				previewImages: [],
				currentPreviewIndex: 0,
				advertiseList: [],
				currentPlayingIndex: -1,
				videoRefs: {}
			}
		},
		onLoad() {
			this.loadCategoryList()
			this.loadAdvertiseList()
			this.loadPostList()
		},
		onReachBottom() {
			this.loadMore()
		},
		methods: {
			handleVideoClick(index) {
				if (this.currentPlayingIndex === index) {
					this.currentPlayingIndex = -1
				} else {
					this.currentPlayingIndex = index
				}
			},
			handleVideoPlay(index) {
				if (this.currentPlayingIndex !== index) {
					this.pauseOtherVideos(index)
					this.currentPlayingIndex = index
				}
			},
			pauseOtherVideos(currentIndex) {
				for (let i = 0; i < this.postList.length; i++) {
					if (i !== currentIndex && this.postList[i].video) {
						const videoRef = this.videoRefs[i]
						if (videoRef && videoRef.videoCtx) {
							videoRef.videoCtx.pause()
						}
					}
				}
			},
			handleBtn() {
				uni.switchTab({
					url: '/pages/vip/index'
				});
			},
			loadMore() {
				console.log('loadMore 触发, loading:', this.loading, ', hasMore:', this.hasMore, ', page:', this.page, ', total:', this.total, ', actualDataCount:', this.actualDataCount)
				if (this.loading) {
					console.log('正在加载中，跳过')
					return
				}
				if (!this.hasMore) {
					console.log('hasMore 为 false，跳过')
					return
				}
				if (this.actualDataCount >= this.total && this.total > 0) {
					console.log('数据已加载完毕')
					this.hasMore = false
					return
				}
				console.log(`开始加载第 ${this.page + 1} 页`)
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
			timeupdate(e){
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
				console.log('请求参数:', params)
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
								this.actualDataCount = rows.length
							} else {
								const newRows = this.insertAdvertise(rows)
								this.postList = [...this.postList, ...newRows]
								this.actualDataCount += rows.length
							}
						}
						// 判断是否还有更多数据（使用实际数据条数，不包括广告）
						if (this.total > 0) {
							this.hasMore = this.actualDataCount < this.total
						} else {
							this.hasMore = rows.length >= this.pageSize
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
				this.postList = []
				this.total = 0
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
		min-height: 100vh;
		background-color: #1a1a2e;
	}

	/* 页面头部 */
	.page-header {
		background-color: #16213e;
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

	/* 滚动容器 */
	.scroll-container {
		height: 100vh;
		box-sizing: border-box;
	}

	/* 帖子列表 */
	.post-list {
		padding: 20rpx;
		// padding-bottom: 60rpx;
	}

	.post-card {
		background-color: #16213e;
		margin-bottom: 20rpx;
		padding: 20rpx;
		border-radius: 16rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
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
		gap: 12rpx;
		margin-bottom: 20rpx;
		flex-wrap: wrap;
	}

	.post-tag {
		font-size: 24rpx;
		padding: 8rpx 18rpx;
		border-radius: 20rpx;
		background-color: rgba(107, 163, 224, 0.15);
		color: #6BA3E0;
		border: 1rpx solid rgba(107, 163, 224, 0.3);
	}
	.post-page {
		width: 100%;
		padding: 20rpx;
		background-color: #16213e;
		// border-radius: 16rpx;
		// box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
		margin-bottom: 20rpx;
	}

	/* 帖子内容 */
	.post-content {
		font-size: 30rpx;
		color: #fff;
		line-height: 1.7;
		margin-bottom: 20rpx;
		white-space: pre-wrap;
		word-break: break-word;
	}

	.expand-text {
		color: #6BA3E0;
	}

	/* 帖子媒体 */
	.post-media {
		position: relative;
		margin-bottom: 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
		background-color: #0f0f1a;
		z-index: 1;
	}

	.media-image {
		width: 100%;
		height: 420rpx;
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

	.video-container {
		position: relative;
		width: 100%;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.video-player {
		width: 100%;
		height: 420rpx;
	}

	.video-duration {
		position: absolute;
		bottom: 12rpx;
		right: 12rpx;
		background-color: rgba(0, 0, 0, 0.75);
		padding: 6rpx 14rpx;
		border-radius: 8rpx;
		font-size: 24rpx;
		color: #fff;
		z-index: 10;
		backdrop-filter: blur(4rpx);
	}

	.images-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 8rpx;
		border-radius: 12rpx;
		overflow: hidden;
	}

	.grid-image {
		width: 100%;
		height: 220rpx;
	}

	.single-image {
		border-radius: 12rpx;
		overflow: hidden;
	}

	.single-image .media-image {
		width: 100%;
		height: auto;
		max-height: 500rpx;
		display: block;
	}

	/* 互动数据 */
	.post-stats {
		display: flex;
		align-items: center;
		gap: 50rpx;
		margin-bottom: 0;
		padding-top: 20rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.08);
	}

	.stat-item {
		display: flex;
		align-items: center;
		gap: 10rpx;
		font-size: 26rpx;
		color: #888;
		white-space: nowrap;
		transition: all 0.3s ease;
	}

	.stat-item.active {
		color: #ff6b6b;
	}

	.stat-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 8rpx;
		flex-shrink: 0;
	}

	.stat-text {
		font-size: 26rpx;
	}

	.reward-btn {
		background-color: linear-gradient(135deg, #ff6b6b, #ee5a5a);
		color: #fff;
		padding: 8rpx 20rpx;
		border-radius: 20rpx;
		margin-left: auto;
		font-size: 24rpx;
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
		background-color: #16213e;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
	}

	.advertise-image {
		width: 100%;
		height: 240rpx;
		display: block;
	}
</style>
