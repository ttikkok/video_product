<template>
	<view class="page">
		<view class="fixed-header">
			<view class="search-header">
				<view class="search-bar">
					<image src="../../static/images/search.png" mode="widthFix" style="width:32rpx;" class="search-icon" />
					<input class="search-input" placeholder="搜索小说" v-model="searchKeyword" confirm-type="search" @confirm="doSearch" />
				</view>
			</view>

			<scroll-view scroll-x class="category-tabs">
				<view class="tabs">
					<view 
						v-for="(category, index) in categories" 
						:key="index"
						:class="['tab-item', { active: activeCategory === index }]"
						@click="switchCategory(index)"
					>
						{{ category.title }}
					</view>
				</view>
			</scroll-view>
		</view>

		<scroll-view scroll-y class="novel-list" @scrolltolower="loadMore">
			<u-empty v-if="!loading && novels.length === 0" :text="'暂无数据'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

			<view v-if="novels.length > 0" class="list-container">
				<view 
					v-for="(novel, index) in novels" 
					:key="index"
					class="novel-card"
					@click="goToRead(novel)"
				>
					<view class="novel-cover">
						<image :src="novel.cover" mode="aspectFill" class="cover-image" />
						<view v-if="novel.isVip" class="vip-badge">VIP</view>
						<view v-if="novel.isFinished" class="finish-badge">已完结</view>
					</view>
					<view class="novel-info">
						<text class="novel-title">{{ novel.title }}</text>
						<text class="novel-author">{{ novel.author }}</text>
						<view class="novel-tags">
							<text 
								v-for="(tag, tagIndex) in novel.tags" 
								:key="tagIndex"
								class="novel-tag"
							>{{ tag }}</text>
						</view>
						<text class="novel-intro">{{ novel.intro }}</text>
						<view class="novel-stats">
							<view class="stat-text"><image src="../../static/images/look.png" mode="widthFix" class="stat-icon" />{{ novel.views }}</view>
							<view class="stat-text"><image src="../../static/images/shu.png" mode="widthFix" class="stat-icon" />{{ novel.chapters }}</view>
						</view>
					</view>
				</view>
				<u-loadmore 
					v-if="novels.length > 0" 
					:status="loading ? 'loading' : (hasMore ? 'loadmore' : 'nomore')" 
					loading-text="加载中" 
					loadmore-text="加载中" 
					nomore-text="暂无更多数据" 
					class="py-3" 
				/>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { NovelApi_novel_type_list, NovelApi_novel_data_list_search } from '@/api/home.js'
	export default {
		data() {
			return {
				activeCategory: 0,
				categories: [],
				searchKeyword: '',
				novels: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				hasMore: true
			}
		},
		onLoad() {
			this.loadCategories()
		},
		methods: {
			loadCategories() {
				NovelApi_novel_type_list({}).then(res => {
					if (res && res.code === 1 && res.data) {
						this.categories = [{ id: 0, title: '全部' }, ...res.data]
						this.loadNovelList()
					} else {
						this.categories = [{ id: 0, title: '全部' }]
					}
				}).catch(err => {
					console.error('加载分类失败:', err)
					this.categories = [{ id: 0, title: '全部' }]
				})
			},
			loadMore() {
				if (this.loading) return
				if (!this.hasMore) return
				if (this.novels.length >= this.total && this.total > 0) {
					this.hasMore = false
					return
				}
				this.page++
				this.loadNovelList()
			},
			loadNovelList() {
				this.loading = true
				if (this.page === 1) {
					uni.showLoading({
						title: '加载中...'
					})
				}
				const params = {
					page: this.page,
					pagesize: this.pageSize,
					type_id: this.categories[this.activeCategory]?.id || 0
				}
				if (this.searchKeyword) {
					params.title = this.searchKeyword
				}
				NovelApi_novel_data_list_search(params).then(res => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					if (res && res.code === 1 && res.data) {
						const list = Array.isArray(res.data) ? res.data : (res.data.rows || [])
						this.total = res.data.total || list.length
						const novels = list.map(item => ({
							id: item.id,
							title: item.title || '',
							author: item.author || '',
							cover: item.cover_image || '',
							tags: item.tags ? (Array.isArray(item.tags) ? item.tags.filter(t => t && t.trim()) : (typeof item.tags === 'string' ? item.tags.split(',').filter(t => t.trim()) : [])) : [],
							intro: item.content || '',
							views: item.look_number ? (parseInt(item.look_number) >= 10000 ? (parseInt(item.look_number) / 10000).toFixed(1) + '萬' : item.look_number) : '0',
							chapters: item.chapter_number || 0,
							likes: item.like_number || '0',
							isVip: item.is_vip === 1,
							isFinished: item.is_finished === 1,
							isCollect: item.is_collect === 1,
							isLike: item.is_like === 1,
							category: item.type_name || ''
						}))
						if (this.page === 1) {
							this.novels = novels
						} else {
							this.novels = [...this.novels, ...novels]
						}
						if (novels.length < this.pageSize) {
							this.hasMore = false
						}
					} else {
						this.novels = []
						this.hasMore = false
					}
				}).catch(err => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					console.error('加载小说列表失败:', err)
				})
			},
			switchCategory(index) {
				this.activeCategory = index
				this.page = 1
				this.total = 0
				this.novels = []
				this.hasMore = true
				this.loadNovelList()
			},
			doSearch() {
				this.page = 1
				this.total = 0
				this.novels = []
				this.hasMore = true
				this.loadNovelList()
			},
			goToRead(novel) {
				const params = new URLSearchParams()
				params.append('id', novel.id)
				params.append('title', novel.title)
				params.append('cover', novel.cover)
				params.append('author', novel.author)
				params.append('tags', (novel.tags || []).join(','))
				params.append('intro', novel.intro)
				params.append('views', novel.views)
				params.append('chapters', novel.chapters)
				params.append('likes', novel.likes)
				params.append('isVip', novel.isVip ? 'true' : 'false')
				params.append('isFinished', novel.isFinished ? 'true' : 'false')
				uni.navigateTo({
					url: `/pages/novel/read?${params.toString()}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		background-color: #1a1a2e;
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

	.search-header {
		padding: 20rpx;
	}

	.search-bar {
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 40rpx;
		padding: 15rpx 25rpx;
	}

	.search-icon {
		margin-right: 15rpx;
	}

	.search-input {
		flex: 1;
		height: 60rpx;
		font-size: 28rpx;
		color: #fff;
	}

	.category-tabs {
		white-space: nowrap;
		padding: 15rpx 0;
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.tabs {
		display: inline-flex;
		padding: 0 20rpx;
	}

	.tab-item {
		padding: 10rpx 30rpx;
		margin-right: 20rpx;
		border-radius: 30rpx;
		font-size: 26rpx;
		color: #999;
		background-color: rgba(255, 255, 255, 0.1);
		&.active {
			background-color: #ffd700;
			color: #000;
		}
	}

	.novel-list {
		height: calc(100vh - 200rpx - 98rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 200rpx - 98rpx - env(safe-area-inset-bottom));
		padding-top: calc(200rpx + constant(safe-area-inset-top));
		padding-top: calc(200rpx + env(safe-area-inset-top));
		box-sizing: content-box;
	}

	.list-container {
		padding: 20rpx;
	}

	.novel-card {
		display: flex;
		padding: 20rpx;
		background-color: #16213e;
		border-radius: 15rpx;
		margin-bottom: 20rpx;
	}

	.novel-cover {
		position: relative;
		width: 180rpx;
		height: 240rpx;
		flex-shrink: 0;
		border-radius: 10rpx;
		overflow: hidden;
	}

	.cover-image {
		width: 100%;
		height: 100%;
	}

	.vip-badge {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		background-color: #e74c3c;
		color: #fff;
		font-size: 20rpx;
		padding: 5rpx 15rpx;
		border-radius: 5rpx;
	}

	.finish-badge {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		background-color: #3498db;
		color: #fff;
		font-size: 20rpx;
		padding: 5rpx 15rpx;
		border-radius: 5rpx;
	}

	.novel-info {
		flex: 1;
		margin-left: 20rpx;
		display: flex;
		flex-direction: column;
	}

	.novel-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 10rpx;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.novel-author {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.novel-tags {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 10rpx;
	}

	.novel-tag {
		background-color: rgba(107, 163, 224, 0.2);
		color: #6BA3E0;
		font-size: 22rpx;
		padding: 5rpx 12rpx;
		border-radius: 5rpx;
		margin-right: 10rpx;
		margin-bottom: 5rpx;
	}

	.novel-intro {
		flex: 1;
		font-size: 24rpx;
		color: #666;
		line-height: 1.5;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
	}

	.novel-stats {
		display: flex;
		// justify-content: space-between;
		margin-top: 15rpx;
		gap: 30rpx;
	}

	.stat-text {
		display: flex;
		align-items: center;
		font-size: 22rpx;
		color: #666;
	}

	.stat-icon {
		width: 28rpx;
		height: 28rpx;
		margin-right: 5rpx;
	}
</style>