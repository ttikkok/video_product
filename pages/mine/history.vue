<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">观看历史</view>
			<view class="nav-edit" @click="toggleEdit">
				<text>{{ isEdit ? '完成' : '编辑' }}</text>
			</view>
		</view>

		<!-- 时间分类已注释 -->
		<!-- <view class="time-filter">
			<view 
				v-for="(filter, index) in filters" 
				:key="index"
				:class="['filter-item', { active: activeFilter === index }]"
				@click="switchFilter(index)"
			>
				{{ filter }}
			</view>
		</view> -->

		<!-- 内容列表 -->
		<scroll-view scroll-y class="content-list" @scrolltolower="loadMore">
			<!-- 空状态 -->
			<u-empty v-if="!loading && history.length === 0" :text="'暂无观看历史'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

			<template v-if="history.length > 0">
				<view v-for="(item, index) in history" :key="index" class="content-item" @click="playVideo(item)">
					<view v-if="isEdit" class="item-checkbox" @click.stop="toggleSelect(index)">
						<text>{{ item.selected ? '✓' : '' }}</text>
					</view>
					<view class="item-cover-wrap">
						<image :src="item.cover" mode="aspectFill" class="item-cover" />
						<view class="item-progress" v-if="item.progress > 0">
							<view class="progress-bar" :style="{ width: item.progress + '%' }"></view>
						</view>
						<text class="item-duration">{{ item.duration }}</text>
					</view>
					<view class="item-info">
						<text class="item-title">{{ item.title }}</text>
						<view class="item-tags">
							<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="item-tag">{{ tag }}</text>
						</view>
						<view class="item-meta">
							<text class="item-year" v-if="item.year">{{ item.year }}</text>
							<text class="item-time">{{ item.watchTime }}</text>
						</view>
					</view>
				</view>
				<!-- 加载更多 -->
				<u-loadmore 
					v-if="history.length > 0" 
					:status="loading ? 'loading' : (hasMore ? 'loadmore' : 'nomore')" 
					loading-text="加载中" 
					loadmore-text="加载中" 
					nomore-text="暂无更多数据" 
					class="py-3" 
				/>
			</template>
		</scroll-view>

		<view v-if="isEdit && selectedCount > 0" class="bottom-bar">
			<view class="bar-info">
				<text>已选择 {{ selectedCount }} 项</text>
			</view>
			<view class="bar-delete" @click="deleteSelected">
				<text>删除</text>
			</view>
		</view>
	</view>
</template>

<script>
	import { VodApi_vod_history_list } from '@/api/home.js'
	export default {
		data() {
			return {
				isEdit: false,
				history: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				hasMore: true
			}
		},
		computed: {
			selectedCount() {
				return this.history.filter(item => item.selected).length
			}
		},
		onLoad() {
			this.loadHistory()
		},
		methods: {
			loadMore() {
				if (this.loading) return
				if (!this.hasMore) return
				if (this.history.length >= this.total && this.total > 0) {
					this.hasMore = false
					return
				}
				this.page++
				this.loadHistory()
			},
			loadHistory(callback) {
				this.loading = true
				if (this.page === 1) {
					uni.showLoading({
						title: '加载中...'
					})
				}
				VodApi_vod_history_list({ page: this.page, pagesize: this.pageSize }).then(res => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					if (res && res.code === 1 && res.data) {
						const list = Array.isArray(res.data) ? res.data : (res.data.rows || res.data.data || [])
						this.total = res.data.total || list.length
						const historyData = list.map(item => ({
							id: item.id,
							cover: item.cover_image || '',
							title: item.title || '',
							tags: item.tags || [],
							year: item.year || '',
							duration: item.duration || '',
							video: item.video || '',
							progress: item.progress || 0,
							watchTime: item.watch_time || '刚刚',
							selected: false
						}))
						if (this.page === 1) {
							this.history = historyData
						} else {
							this.history = [...this.history, ...historyData]
						}
						if (historyData.length < this.pageSize) {
							this.hasMore = false
						}
					} else {
						this.history = []
						this.total = 0
						this.hasMore = false
					}
					if (typeof callback === 'function') {
						callback()
					}
				}).catch(err => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					console.error('加载观看历史失败:', err)
					if (typeof callback === 'function') {
						callback()
					}
				})
			},
			goBack() {
				uni.navigateBack()
			},
			switchFilter(index) {
				this.activeFilter = index
			},
			toggleEdit() {
				this.isEdit = !this.isEdit
				if (!this.isEdit) {
					this.filteredHistory.forEach(item => item.selected = false)
				}
			},
			toggleSelect(index) {
				this.filteredHistory[index].selected = !this.filteredHistory[index].selected
			},
			playVideo(item) {
				if (!this.isEdit) {
					uni.navigateTo({
						url: `/pages/index/play?id=${item.id}&title=${encodeURIComponent(item.title)}&poster=${encodeURIComponent(item.cover)}&video=${encodeURIComponent(item.video)}&duration=${item.duration}`
					})
				}
			},
			deleteSelected() {
				this.history = this.history.filter(item => !item.selected)
				this.isEdit = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
	}

	.top-nav {
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
		padding-top: calc(30rpx + constant(safe-area-inset-top));
		padding-top: calc(30rpx + env(safe-area-inset-top));
		background-color: #16213e;
	}

	.nav-back {
		width: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.nav-title {
		flex: 1;
		font-size: 32rpx;
		color: #fff;
		font-weight: 600;
		text-align: center;
	}

	.nav-edit {
		font-size: 28rpx;
		color: #6BA3E0;
	}

	.time-filter {
		display: flex;
		gap: 20rpx;
		padding: 20rpx;
		background-color: #16213e;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.filter-item {
		font-size: 26rpx;
		color: #999;
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		background-color: rgba(255, 255, 255, 0.1);
	}

	.filter-item.active {
		color: #ffd700;
		background-color: rgba(255, 215, 0, 0.2);
	}

	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.empty-icon {
		font-size: 100rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.content-list {
		height: calc(100vh - 140rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 140rpx - env(safe-area-inset-bottom));
		padding: 20rpx;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
		box-sizing: border-box;
	}

	.content-item {
		display: flex;
		align-items: center;
		background-color: #16213e;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.item-checkbox {
		width: 44rpx;
		height: 44rpx;
		border: 2rpx solid #666;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}

	.item-checkbox text {
		font-size: 24rpx;
		color: #ffd700;
	}

	.item-cover-wrap {
		position: relative;
		width: 160rpx;
		height: 200rpx;
		border-radius: 10rpx;
		overflow: hidden;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.item-cover {
		width: 100%;
		height: 100%;
	}

	.item-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 6rpx;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.progress-bar {
		height: 100%;
		background-color: #ffd700;
	}

	.item-duration {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 3rpx 8rpx;
		border-radius: 4rpx;
	}

	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.item-title {
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
		margin-bottom: 8rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.item-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
		margin-bottom: 8rpx;
	}

	.item-tag {
		font-size: 20rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.2);
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
	}

	.item-meta {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.item-year {
		font-size: 22rpx;
		color: #999;
	}

	.item-time {
		font-size: 22rpx;
		color: #999;
	}

	.bottom-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		background-color: #16213e;
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
		position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
	}

	.bar-info text {
		font-size: 26rpx;
		color: #999;
	}

	.bar-delete {
		background-color: #e74c3c;
		padding: 15rpx 40rpx;
		border-radius: 30rpx;
	}

	.bar-delete text {
		font-size: 28rpx;
		color: #fff;
		font-weight: 600;
	}

	.load-more-tip {
		padding: 30rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}
</style>
