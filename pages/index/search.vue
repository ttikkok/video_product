<template>
	<view class="page">
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
						<image :src="item.cover" mode="aspectFill" class="item-cover" />
						<text class="item-duration">{{ item.duration }}</text>
						<view class="item-badge" v-if="item.badge">
							<text>{{ item.badge }}</text>
						</view>
					</view>
					<view class="item-info">
						<text class="item-title">{{ item.title }}</text>
						<view class="item-meta">
							<text class="item-views">{{ item.views }}</text>
							<text class="item-separator">·</text>
							<text class="item-tags">{{ item.tags }}</text>
						</view>
						<text class="item-code">{{ item.code }}</text>
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
				virtualTags: [],
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
		},
		methods: {
			loadCategories() {
				uni.showLoading({
					title: '加载中...'
				})
				VodApi_vod_category_tags_list({}).then(res => {
					uni.hideLoading()
					if (res && res.code === 1 && res.data) {
						const data = res.data.data || res.data
						this.virtualTags = data.virtual_tags || []
						this.tags = data.tags || []
						if (this.virtualTags.length > 0) {
							this.selectedVirtualTag = this.virtualTags[0].other_id
						}
					} else {
						this.virtualTags = [
							{ other_id: -1, name: '播放最多' },
							{ other_id: -2, name: '最近添加' },
							{ other_id: -3, name: '最高评分' }
						]
						this.tags = []
						this.selectedVirtualTag = -1
					}
					this.loadVideoList()
				}).catch(err => {
					uni.hideLoading()
					console.error('加载分类失败:', err)
					this.virtualTags = [
						{ other_id: -1, name: '播放最多' },
						{ other_id: -2, name: '最近添加' },
						{ other_id: -3, name: '最高评分' }
					]
					this.tags = []
					this.selectedVirtualTag = -1
					this.loadVideoList()
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
							views: this.formatNumber(item.look_number) || '0',
							tags: (item.tags || []).join(' ') || '',
							code: '',
							badge: item.is_free === 0 ? 'VIP' : null,
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
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	.search-header {
		display: flex;
		align-items: center;
		padding: 20rpx;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
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
		display: flex;
		background-color: #16213e;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.item-cover-wrap {
		position: relative;
		width: 200rpx;
		height: 140rpx;
		flex-shrink: 0;
	}

	.item-cover {
		width: 100%;
		height: 100%;
		border-radius: 10rpx;
	}

	.item-duration {
		position: absolute;
		bottom: 5rpx;
		right: 5rpx;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
		font-size: 20rpx;
		color: #fff;
	}

	.item-badge {
		position: absolute;
		top: 5rpx;
		left: 5rpx;
		background-color: #ffd700;
		padding: 2rpx 8rpx;
		border-radius: 4rpx;
		font-size: 20rpx;
		color: #000;
		font-weight: bold;
	}

	.item-info {
		flex: 1;
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.item-title {
		font-size: 28rpx;
		color: #fff;
		font-weight: bold;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.item-meta {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.item-views {
		font-size: 22rpx;
		color: #666;
	}

	.item-separator {
		font-size: 22rpx;
		color: #666;
	}

	.item-tags {
		font-size: 22rpx;
		color: #6BA3E0;
	}

	.item-code {
		font-size: 20rpx;
		color: #666;
		font-family: monospace;
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