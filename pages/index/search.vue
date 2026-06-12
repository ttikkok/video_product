<template>
	<view class="page">
		<u-status-bar bg-color="#16213e"></u-status-bar>
		<view class="search-header">
			<view class="back-btn" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="header-title">搜索</view>
			<view class="header-placeholder"></view>
		</view>

		<view class="virtual-tags">
			<scroll-view scroll-x class="virtual-tags-scroll">
				<view 
					v-for="(tag, index) in virtualTags" 
					:key="index"
					:class="['virtual-tag', { active: selectedVirtualTag === tag.other_id }]"
					@click="selectVirtualTag(tag.other_id)"
				>
					<text>{{ tag.name }}</text>
				</view>
			</scroll-view>
		</view>

		<view class="filter-container">
			<view class="filter-left">
				<view class="section-title">分类</view>
				<scroll-view scroll-y class="tags-scroll">
					<view class="tags-wrap">
						<view 
							v-for="(item, index) in categoryTags" 
							:key="index"
							:class="['filter-tag', { active: selectedCategory === item.id, single: true }]"
							@click="selectCategory(item.id)"
						>
							<text>{{ item.title }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="filter-right">
				<view class="section-title">标签</view>
				<scroll-view scroll-y class="tags-scroll">
					<view class="tags-wrap">
						<view 
							v-for="(item, index) in normalTags" 
							:key="index"
							:class="['filter-tag', { active: selectedTags.includes(item.id) }]"
							@click="toggleTag(item)"
						>
							<text>{{ item.title }}</text>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>

		<scroll-view scroll-y class="content-list" @scrolltolower="loadMore">
			<view v-if="!loading && searchResults.length === 0" class="empty-state">
				<text class="empty-icon">📭</text>
				<text class="empty-text">暂无数据</text>
				<text class="empty-hint">换个关键词试试吧</text>
			</view>
			<template v-if="searchResults.length > 0">
				<view v-for="(item, index) in searchResults" :key="index" class="content-item" @click="playVideo(item)">
					<view class="item-cover-wrap">
						<view class="item-title-overlay">
							<text class="item-title">{{ item.title }}</text>
						</view>
						<image :src="item.cover" mode="aspectFill" class="cover-image" />
						<view class="video-overlay">
							<view class="play-icon">▶</view>
						</view>
						<text class="play-count">{{ item.playCount }}</text>
						<text class="video-duration">{{ item.duration }}</text>
						<view v-if="item.is_free === 0" class="vip-badge">VIP</view>
					</view>
					<view class="item-footer">
						<text class="time-text">{{ formatTime(item.createtime) }} 发布</text>
						<view class="item-like">
							<image :src="item.is_like == 1 ? '../../static/images/goods_active.png' : '../../static/images/goods.png'" mode="widthFix" class="like-icon" />
							<text class="like-text">{{ item.likeNumber || 0 }}</text>
						</view>
					</view>
				</view>
				<u-loadmore 
					v-if="searchResults.length > 0" 
					:status="loading ? 'loading' : (hasMore ? 'loadmore' : 'nomore')" 
					loading-text="加载中" 
					loadmore-text="加载更多" 
					nomore-text="暂无更多数据" 
					class="py-3" 
				/>
			</template>
		</scroll-view>
	</view>
</template>

<script>
	import { VodApi_vod_category_tags_list, VodApi_vod_data_type_search } from '@/api/home.js'
	export default {
		data() {
			return {
				virtualTags: [
					{ other_id: -1, name: '播放最多' },
					{ other_id: -2, name: '最近添加' },
					{ other_id: -3, name: '最高评分' }
				],
				tags: [],
				selectedVirtualTag: -1,
				selectedCategory: 0,
				selectedTags: [],
				selectedTagNames: [],
				searchResults: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				hasMore: true
			}
		},
		computed: {
			categoryTags() {
				const categoryGroup = this.tags.find(t => t.title === '分类')
				return categoryGroup?.children || []
			},
			normalTags() {
				const tagGroup = this.tags.find(t => t.title === '标签')
				return tagGroup?.children || []
			}
		},
		onLoad() {
			this.loadCategories()
			this.loadVideoList()
		},
		methods: {
			loadCategories() {
				VodApi_vod_category_tags_list({}).then(res => {
					if (res && res.code === 1 && res.data) {
						const data = res.data.data || res.data
						this.virtualTags = data.virtual_tags || []
						this.tags = data.tags || []
						if (this.virtualTags.length > 0) {
							this.selectedVirtualTag = this.virtualTags[0].other_id
						}
					}
				}).catch(err => {
					console.error('加载分类失败:', err)
				})
			},
			loadVideoList() {
				this.loading = true
				if (this.page === 1) {
					uni.showLoading({
						title: '加载中...'
					})
				}
				const params = {
					page: this.page,
					pagesize: this.pageSize,
					data_id: this.selectedCategory,
					id: this.selectedTags.join(','),
					name: this.selectedTagNames.join(','),
					other_id: this.selectedVirtualTag
				}
				VodApi_vod_data_type_search(params).then(res => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					if (res && res.code === 1 && res.data) {
						const list = Array.isArray(res.data) ? res.data : (res.data.rows || [])
						this.total = res.data.total || list.length
						const videos = list.map(item => ({
							id: item.id,
							cover: item.cover_image || '',
							title: item.title || '',
							duration: item.duration || '00:00',
							playCount: this.formatNumber(item.look_number) || '0',
							createtime: item.createtime || '',
							likeNumber: item.like_number || 0,
							is_free: item.is_free,
							is_like: item.is_like,
							video: item.video || ''
						}))
						if (this.page === 1) {
							this.searchResults = videos
						} else {
							this.searchResults = [...this.searchResults, ...videos]
						}
						if (videos.length < this.pageSize) {
							this.hasMore = false
						}
					} else {
						if (this.page === 1) {
							this.searchResults = []
						}
						this.hasMore = false
					}
				}).catch(err => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					console.error('加载视频列表失败:', err)
				})
			},
			loadMore() {
				if (this.loading) return
				if (!this.hasMore) return
				if (this.searchResults.length >= this.total && this.total > 0) {
					this.hasMore = false
					return
				}
				this.page++
				this.loadVideoList()
			},
			formatNumber(num) {
				if (!num) return '0'
				let n = parseInt(num)
				if (n >= 10000) {
					return (n / 10000).toFixed(1) + '萬'
				}
				return num.toString()
			},
			formatTime(timestamp) {
				if (!timestamp) return ''
				const date = new Date(timestamp)
				const month = String(date.getMonth() + 1).padStart(2, '0')
				const day = String(date.getDate()).padStart(2, '0')
				const hours = String(date.getHours()).padStart(2, '0')
				const minutes = String(date.getMinutes()).padStart(2, '0')
				return `${month}-${day} ${hours}:${minutes}`
			},
			goBack() {
				uni.navigateBack()
			},
			selectVirtualTag(otherId) {
				this.selectedVirtualTag = otherId
				this.page = 1
				this.hasMore = true
				this.loadVideoList()
			},
			selectCategory(categoryId) {
				this.selectedCategory = categoryId
				this.page = 1
				this.hasMore = true
				this.loadVideoList()
			},
			toggleTag(tag) {
				const index = this.selectedTags.indexOf(tag.id)
				if (index > -1) {
					this.selectedTags.splice(index, 1)
					this.selectedTagNames.splice(index, 1)
				} else {
					this.selectedTags.push(tag.id)
					this.selectedTagNames.push(tag.title)
				}
				this.page = 1
				this.hasMore = true
				this.loadVideoList()
			},
			playVideo(item) {
				uni.navigateTo({
					url: `/pages/index/play?id=${item.id}&video=${encodeURIComponent(JSON.stringify(item))}`
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

	.search-header {
		position: fixed;
		top: var(--status-bar-height, 44px);
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #16213e;
	}

	.back-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		width: 40rpx;
	}

	.header-title {
		flex: 1;
		text-align: center;
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}

	.header-placeholder {
		width: 60rpx;
	}

	.virtual-tags {
		background-color: #16213e;
		padding: 20rpx 0;
		padding-top: 140rpx;
		border-bottom: 1rpx solid #2a2a4a;
	}

	.virtual-tags-scroll {
		white-space: nowrap;
		padding: 0 20rpx;
	}

	.virtual-tag {
		display: inline-block;
		padding: 15rpx 30rpx;
		background-color: #2a2a4a;
		border-radius: 30rpx;
		margin-right: 20rpx;
		font-size: 26rpx;
		color: #999;
		transition: all 0.3s;

		&.active {
			background-color: #ffd700;
			color: #000;
		}
	}

	.filter-container {
		display: flex;
		background-color: #1a1a2e;
		height: 280rpx;
	}

	.filter-left {
		flex: 1;
		border-right: 1rpx solid #2a2a4a;
		display: flex;
		flex-direction: column;
	}

	.filter-right {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.section-title {
		font-size: 26rpx;
		color: #fff;
		font-weight: bold;
		padding: 20rpx 15rpx;
		height: 60rpx;
		box-sizing: border-box;
	}

	.tags-scroll {
		height: 220rpx;
		padding: 10rpx 15rpx;
	}

	.tags-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}

	.filter-tag {
		padding: 10rpx 18rpx;
		background-color: #16213e;
		border-radius: 18rpx;
		font-size: 22rpx;
		color: #999;
		transition: all 0.3s;
		margin-bottom: 10rpx;

		&.active {
			background-color: #ffd700;
			color: #000;
		}

		&.single.active {
			background-color: #ffd700;
			color: #000;
		}
	}

	.content-list {
		height: calc(100vh - 500rpx);
		padding: 20rpx;
	}

	.content-item {
		background-color: #16213e;
		border-radius: 16rpx;
		overflow: hidden;
		margin-bottom: 20rpx;
	}

	.item-cover-wrap {
		position: relative;
		width: 100%;
		height: 370rpx;
	}

	.cover-image {
		width: 100%;
		height: 100%;
	}

	.item-title-overlay {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		padding: 20rpx 24rpx;
		display: flex;
		align-items: center;
		gap: 12rpx;
		background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%);
		z-index: 10;
	}

	.item-title {
		font-size: 30rpx;
		color: #fff;
		font-weight: 600;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		flex: 1;
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

	.play-count {
		position: absolute;
		bottom: 10rpx;
		left: 15rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.9);
		background-color: rgba(0, 0, 0, 0.5);
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}

	.video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 15rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.9);
		background-color: rgba(0, 0, 0, 0.5);
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}

	.vip-badge {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		font-size: 22rpx;
		color: #fff;
		background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%);
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		font-weight: 700;
		box-shadow: 0 4rpx 12rpx rgba(255, 69, 0, 0.5);
		z-index: 10;
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
		gap: 10rpx;
	}

	.like-icon {
		width: 36rpx;
		height: 36rpx;
	}

	.like-text {
		font-size: 26rpx;
		color: #999;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 40rpx;
	}

	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 30rpx;
	}

	.empty-text {
		font-size: 32rpx;
		color: #fff;
		margin-bottom: 15rpx;
	}

	.empty-hint {
		font-size: 26rpx;
		color: #666;
	}
</style>