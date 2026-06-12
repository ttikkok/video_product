<template>
	<view class="page">
		<view class="top-header">
			<u-status-bar bg-color="#16213e"></u-status-bar>
			<view class="top-nav-view">
				<view class="nav-back" @click="goBack">
					<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
				</view>
				<view class="nav-title">我的书架</view>
				<view class="nav-placeholder"></view>
			</view>
		</view>

		<scroll-view scroll-y class="content-scroll" @scrolltolower="loadMore">
			<u-status-bar></u-status-bar>
			<view class="content-list">
				<u-empty v-if="!loading && novels.length === 0" :text="'暂无收藏小说'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

				<template v-if="novels.length > 0">
					<view v-for="(novel, index) in novels" :key="index" class="novel-item" @click="goToRead(novel)">
						<image :src="novel.cover" mode="aspectFill" class="novel-cover" />
						<view class="novel-info">
							<text class="novel-title">{{ novel.title }}</text>
							<text class="novel-author">{{ novel.author }}</text>
							<view class="novel-tags">
								<text v-for="(tag, tagIndex) in novel.tags" :key="tagIndex" class="novel-tag">{{ tag }}</text>
							</view>
							<view class="novel-meta">
								<text class="meta-item">{{ novel.views }}阅读</text>
								<text class="meta-item">{{ novel.chapters }}</text>
							</view>
						</view>
						<view v-if="novel.isVip" class="novel-vip">VIP</view>
					</view>
					<u-loadmore 
						v-if="novels.length > 0" 
						:status="loading ? 'loading' : (hasMore ? 'loadmore' : 'nomore')" 
						loading-text="加载中" 
						loadmore-text="加载更多" 
						nomore-text="暂无更多数据" 
						class="py-3" 
					/>
				</template>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { NovelApi_novel_collect_list } from '@/api/home.js'
	export default {
		data() {
			return {
				novels: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				hasMore: true
			}
		},
		onLoad() {
			this.loadNovelList()
		},
		methods: {
			goBack() {
				uni.navigateBack()
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
				NovelApi_novel_collect_list({ page: this.page, pagesize: this.pageSize }).then(res => {
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
							views: item.look_number ? (parseInt(item.look_number) >= 10000 ? (parseInt(item.look_number) / 10000).toFixed(1) + '万' : item.look_number) : '0',
							chapters: item.chapter_number || 0,
							isVip: item.is_vip === 1
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
					console.error('加载书架失败:', err)
				})
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
		min-height: 100vh;
		background-color: #1a1a2e;
	}

	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 30rpx 30rpx;
		background-color: #16213e;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}

	.top-nav-view {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.top-nav {
		position: fixed;
		top: var(--status-bar-height, 44px);
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx 30rpx;
		background-color: #16213e;
	}

	.nav-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #fff;
	}

	.nav-placeholder {
		width: 60rpx;
	}

	.content-scroll {
		height: 100vh;
		padding-top: calc(110rpx + constant(safe-area-inset-top));
		padding-top: calc(110rpx + env(safe-area-inset-top));
	}

	.content-list {
		padding: 20rpx;
	}

	.novel-item {
		display: flex;
		background-color: #16213e;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
	}

	.novel-cover {
		width: 180rpx;
		height: 240rpx;
		border-radius: 12rpx;
		flex-shrink: 0;
	}

	.novel-info {
		flex: 1;
		padding-left: 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
	}

	.novel-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #fff;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.novel-author {
		font-size: 24rpx;
		color: #888;
		margin-top: 8rpx;
	}

	.novel-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
		margin-top: 10rpx;
	}

	.novel-tag {
		font-size: 20rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.2);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
	}

	.novel-meta {
		display: flex;
		gap: 20rpx;
		margin-top: 10rpx;
	}

	.meta-item {
		font-size: 22rpx;
		color: #666;
	}

	.novel-vip {
		position: absolute;
		top: 20rpx;
		right: 20rpx;
		background-color: #ffd700;
		color: #000;
		font-size: 20rpx;
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		font-weight: bold;
	}
</style>