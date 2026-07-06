<template>
	<view class="page">
		<u-status-bar bg-color="#f7f8fc"></u-status-bar>
		<view class="search-header">
			<view class="back-btn" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="header-title">
				<view class="search-bar">
					<view class="search-input-wrap">
						<image src="../../static/images/search.png" mode="widthFix" style="width:36rpx;" class="search-icon" />
						<input class="search-input" placeholder="关键词搜索" v-model="searchKeyword" confirm-type="search" @confirm="goToSearch" />
					</view>
					<view class="search-actions">
						<view class="action-btn" @click="goToSearch">
							搜索
							<!-- <image src="../../static/images/img02.png" mode="widthFix" style="width:60%;" /> -->
						</view>
					</view>
				</view>
			</view>
			<!-- <view class="header-placeholder"></view> -->
		</view>

		<view class="filter-container">
		<scroll-view scroll-y class="filter-left-scroll">
			<view 
				v-for="(category, catIndex) in categoryTags" 
				:key="catIndex"
				:class="['category-item', { active: activeCategory === category.data_id }]"
				@click="selectCategory(category.data_id)"
			>
				<text>{{ category.title }}</text>
				<text v-if="getSelectedSubTagsCount(category.data_id) > 0" class="selected-count">
					{{ getSelectedSubTagsCount(category.data_id) }}
				</text>
			</view>
		</scroll-view>
		<scroll-view scroll-y class="filter-right-scroll">
			<view class="sub-tags-wrap">
				<view 
					v-for="(subTag, subIndex) in currentSubTags" 
					:key="subIndex"
					:class="['sub-tag', { active: isSubTagSelected(activeCategory, subTag.id) }]"
					@click="toggleSubTag(activeCategory, subTag)"
				>
					<text>{{ subTag.title }}</text>
				</view>
			</view>
		</scroll-view>
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

		<scroll-view scroll-y class="content-list" @scrolltolower="loadMore">
			<view v-if="!loading && searchResults.length === 0" class="empty-state">
				<text class="empty-icon">📭</text>
				<text class="empty-text">暂无数据</text>
				<text class="empty-hint">换个关键词试试吧</text>
			</view>
			<template v-if="searchResults.length > 0">
				<view class="content-container">
					<view v-for="(item, index) in searchResults" :key="index" class="content-item" @click="playVideo(item)">
						<view class="item-cover-wrap">
							<image :src="item.cover" mode="aspectFill" class="cover-image" />
							<text class="play-count">{{ item.playCount }}</text>
							<text class="video-duration">{{ item.duration }}</text>
							<view v-if="item.is_free === 0" class="vip-badge">VIP</view>
						</view>
						<view class="item-footer">
							<text class="item-title-bottom">{{ item.title }}</text>
							<view class="item-meta">
								<text class="time-text">{{ formatTime(item.createtime*1000) }} 发布</text>
								<view class="item-like">
									<image :src="item.is_like == 1 ? '../../static/images/goods_active.png' : '../../static/images/goods.png'" mode="widthFix" class="like-icon" />
									<text class="like-text">{{ item.likeNumber || 0 }}</text>
								</view>
							</view>
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
				searchKeyword: '',
				tags: [],
				selectedVirtualTag: -1,
				activeCategory: null,
				selectedCategories: [],
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
				return this.tags || []
			},
			currentSubTags() {
				if (this.activeCategory === null) return []
				const category = this.categoryTags.find(c => c.data_id === this.activeCategory)
				return category ? category.children || [] : []
			}
		},
		onLoad() {
			this.loadCategories()
			this.loadVideoList()
		},
		methods: {
			goToSearch() {
				this.loadVideoList()
			},
			loadCategories() {
				VodApi_vod_category_tags_list({}).then(res => {
					if (res && res.code === 1 && res.data) {
						const data = res.data.data || res.data
						this.virtualTags = data.virtual_tags || []
						this.tags = data.tags || []
						if (this.virtualTags.length > 0) {
							this.selectedVirtualTag = this.virtualTags[0].other_id
						}
						if (this.tags.length > 0) {
							this.activeCategory = this.tags[0].data_id
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
				const dataId = this.buildDataId()
				const params = {
					page: this.page,
					pagesize: this.pageSize,
					title: this.searchKeyword,
					data_id: dataId,
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
			buildDataId() {
				if (this.selectedCategories.length === 0) {
					return ''
				}
				const dataIdArray = this.selectedCategories.map(cat => {
					const children = cat.subTags.map(st => ({
						id: st.id,
						title: st.title
					}))
					return {
						data_id: cat.categoryId,
						children: children
					}
				})
				return JSON.stringify(dataIdArray)
			},
			isCategorySelected(categoryId) {
				return this.selectedCategories.some(c => c.categoryId === categoryId)
			},
			isSubTagSelected(categoryId, subTagId) {
				const cat = this.selectedCategories.find(c => c.categoryId === categoryId)
				return cat ? cat.subTags.some(st => st.id === subTagId) : false
			},
			getSelectedSubTagsCount(categoryId) {
				const cat = this.selectedCategories.find(c => c.categoryId === categoryId)
				return cat ? cat.subTags.length : 0
			},
			selectCategory(categoryId) {
				this.activeCategory = categoryId
			},
			toggleSubTag(categoryId, subTag) {
				let cat = this.selectedCategories.find(c => c.categoryId === categoryId)
				if (!cat) {
					cat = {
						categoryId: categoryId,
						subTags: []
					}
					this.selectedCategories.push(cat)
				}
				const subTagIndex = cat.subTags.findIndex(st => st.id === subTag.id)
				if (subTagIndex > -1) {
					cat.subTags.splice(subTagIndex, 1)
					if (cat.subTags.length === 0) {
						const catIndex = this.selectedCategories.findIndex(c => c.categoryId === categoryId)
						if (catIndex > -1) {
							this.selectedCategories.splice(catIndex, 1)
						}
					}
				} else {
					cat.subTags.push(subTag)
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
		background-color: #f7f8fc;
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
		background-color: #f7f8fc;
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
		// text-align: center;
		// font-size: 32rpx;
		// font-weight: bold;
		// color: #333333;
	}

	.header-placeholder {
		width: 60rpx;
	}

	.virtual-tags {
		background-color: #f7f8fc;
		padding: 20rpx 0;
		border-bottom: 1rpx solid #e0e0e0;
	}

	.virtual-tags-scroll {
		white-space: nowrap;
		padding: 0 20rpx;
	}

	.virtual-tag {
		display: inline-block;
		padding: 15rpx 30rpx;
		background-color: #f0f0f0;
		border-radius: 30rpx;
		margin-right: 20rpx;
		font-size: 26rpx;
		color: #666666;
		transition: all 0.3s;

		&.active {
			background-color: #ff2155;
			color: #fff;
		}
	}

	.filter-container {
		display: flex;
		background-color: #ffffff;
		height: 350rpx;
		padding-top: 100rpx;
	}

	.filter-left-scroll {
		width: 140rpx;
		height: 100%;
		background-color: #f7f8fc;
	}

	.category-item {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx 10rpx;
		font-size: 26rpx;
		color: #666666;
		position: relative;
		border-left: 4rpx solid transparent;
		transition: all 0.3s;

		&.active {
			color: #ff2155;
			font-weight: bold;
			background-color: rgba(255, 33, 85, 0.25);
			border-left-color: #ff2155;
		}
	}

	.selected-count {
		margin-left: 8rpx;
		font-size: 20rpx;
		color: #ff2155;
		background-color: rgba(255, 33, 85, 0.1);
		padding: 2rpx 8rpx;
		border-radius: 10rpx;
	}

	.filter-right-scroll {
		flex: 1;
		height: 100%;
		padding: 15rpx;
	}

	.sub-tags-wrap {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
	}

	.sub-tag {
		padding: 12rpx 24rpx;
		background-color: #e8e8e8;
		border-radius: 20rpx;
		font-size: 24rpx;
		color: #666666;
		transition: all 0.3s;

		&.active {
			background-color: #ff2155;
			color: #fff;
		}
	}

	.content-list {
		height: calc(100vh - 470rpx);
		padding: 20rpx;
	}

	.content-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
	}

	.content-item {
		background-color: #ffffff;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.08);
	}

	.item-cover-wrap {
		position: relative;
		width: 100%;
		height: 280rpx;
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
		left: 10rpx;
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
		flex-direction: column;
		gap: 8rpx;
	}

	.item-title-bottom {
		font-size: 26rpx;
		color: #333333;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.item-meta {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.time-text {
		font-size: 22rpx;
		color: #666;
	}

	.item-like {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}

	.like-icon {
		width: 28rpx;
		height: 28rpx;
	}

	.like-text {
		font-size: 22rpx;
		color: #666;
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
		color: #333333;
		margin-bottom: 15rpx;
	}

	.empty-hint {
		font-size: 26rpx;
		color: #666;
	}


	.search-bar {
		display: flex;
		align-items: center;
		gap: 20rpx;
		// margin-top: 6rpx;
	}
	
	.search-input-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: #ffffff;
		border-radius: 30rpx;
		padding: 12rpx 25rpx;
	}
	
	.search-icon {
		font-size: 28rpx;
		margin-right: 15rpx;
	}
	
	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		color: #333333;
		font-size: 28rpx;
	}
	
	.search-actions {
		display: flex;
		gap: 15rpx;
	}

	.action-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		// background-color: #ffffff;
		// border-radius: 50%;
		font-size: 26rpx;
		color: #666;
		
		&.history-btn {
			width: auto;
			height: auto;
			padding: 10rpx 20rpx;
			border-radius: 30rpx;
			flex-direction: column;
			gap: 5rpx;
		}
	}
</style>