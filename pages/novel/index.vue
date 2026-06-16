<template>
	<view class="page">
		<view class="fixed-header">
			<u-status-bar bg-color="#16213e"></u-status-bar>
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
			<u-status-bar></u-status-bar>
			<u-empty v-if="!loading && novels.length === 0" :text="'暂无数据'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

			<view v-if="novels.length > 0" class="list-container">
				<view 
					v-for="(novel, index) in novels" 
					:key="index"
					class="novel-item"
				>
					<view v-if="novel.is_advertise" class="advertise-card" @click="openAdvertiseUrl(novel.url)">
						<image :src="novel.image || novel.cover_image" mode="aspectFill" class="advertise-image" />
					</view>
					<view v-else class="novel-card" @click="goToRead(novel)">
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
	import { NovelApi_novel_type_list, NovelApi_novel_data_list_search, AdvertiseApi_advertise_list } from '@/api/home.js'
	export default {
		data() {
			return {
				activeCategory: 0,
				categories: [{ id: 0, title: '全部' }],
				searchKeyword: '',
				novels: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				hasMore: true,
				advertiseList: [],
				actualDataCount: 0
			}
		},
		onLoad() {
			this.loadCategories()
			this.loadAdvertiseList()
			this.loadNovelList()
		},
		methods: {
			loadCategories() {
				NovelApi_novel_type_list({}).then(res => {
					if (res && res.code === 1 && res.data) {
						this.categories = [{ id: 0, title: '全部' }, ...res.data]
					}
				}).catch(err => {
					console.error('加载分类失败:', err)
				})
			},
			loadAdvertiseList() {
				console.log('开始加载小说广告位')
				AdvertiseApi_advertise_list({ name: '小说广告位' }).then(res => {
					console.log('广告接口返回:', res)
					if (res && res.code === 1 && res.data && Array.isArray(res.data)) {
						this.advertiseList = res.data
						console.log('广告列表加载成功:', this.advertiseList.length, '条')
					} else {
						console.log('广告列表为空或返回格式错误')
					}
				}).catch(err => {
					console.error('加载广告列表失败:', err)
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
				uni.setClipboardData({
					data: url,
					success: () => {
						uni.showToast({ title: '链接已复制，请到浏览器打开', icon: 'none' })
					}
				})
			},
			loadMore() {
				if (this.loading) return
				if (!this.hasMore) return
				if (this.actualDataCount >= this.total && this.total > 0) {
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
							this.novels = this.insertAdvertise(novels)
							this.actualDataCount = novels.length
						} else {
							const newNovels = this.insertAdvertise(novels)
							this.novels = [...this.novels, ...newNovels]
							this.actualDataCount += novels.length
						}
						if (this.total > 0) {
							this.hasMore = this.actualDataCount < this.total
						} else {
							this.hasMore = novels.length >= this.pageSize
						}
					} else {
						this.novels = []
						this.actualDataCount = 0
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
				this.actualDataCount = 0
				this.loadNovelList()
			},
			doSearch() {
				this.page = 1
				this.total = 0
				this.novels = []
				this.hasMore = true
				this.actualDataCount = 0
				this.loadNovelList()
			},
			goToRead(novel) {
				uni.navigateTo({
					url: `/pages/novel/read?id=${novel.id}`
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

	.category-tabs {
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

	.novel-list {
		height: calc(100vh - 120rpx - 98rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 120rpx - 98rpx - env(safe-area-inset-bottom));
		padding-top: calc(200rpx + constant(safe-area-inset-top));
		padding-top: calc(200rpx + env(safe-area-inset-top));
		box-sizing: content-box;
	}

	.list-container {
		padding: 20rpx;
	}

	.novel-item {
		display: block;
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