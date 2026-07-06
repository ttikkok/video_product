<template>
	<view class="page">
		<view class="top-header">
			<u-status-bar bgColor="#f7f8fc"></u-status-bar>
			<view class="top-nav-view">
				<view class="nav-back" @click="goBack">
					<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
				</view>
				<view class="nav-title">我的收藏</view>
				<view class="nav-edit" @click="toggleEdit">
					<text>{{ isEdit ? '完成' : '编辑' }}</text>
				</view>
			</view>
		</view>

		<!-- 内容列表 -->
		<scroll-view scroll-y class="content-list" @scrolltolower="loadMore">
			<u-status-bar></u-status-bar>
			<!-- 空状态 -->
			<u-empty v-if="!loading && favorites.length === 0" :text="'暂无收藏内容'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

			<template v-if="favorites.length > 0">
				<view v-for="(item, index) in favorites" :key="item.id || index" class="content-item" @click="playVideo(item)">
					<!-- <view v-if="isEdit" class="item-checkbox" @click.stop="toggleSelect(index)">
						<text>{{ item.selected ? '✓' : '' }}</text>
					</view> -->
					<image :src="item.cover_image" mode="aspectFill" class="item-cover" />
					<view class="item-info">
						<text class="item-title">{{ item.title }}</text>
						<view class="item-tags">
							<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="item-tag">{{ tag }}</text>
						</view>
						<text class="item-content">{{ item.content }}</text>
						<!-- <text class="item-duration">{{ item.duration }}</text> -->
					</view>
					<view class="item-delete" v-if="isEdit" @click.stop="deleteItem(index)">
						<!-- <text>🗑️</text> -->
						<image src="../../static/images/delecte.png" mode="widthFix" class="delete-icon" />
					</view>
				</view>
				<!-- 加载更多 -->
				<u-loadmore 
					v-if="favorites.length > 0" 
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
	import { VodApi_vod_collect_list, VodApi_vod_collect } from '@/api/home.js'
	export default {
		data() {
			return {
				isEdit: false,
				favorites: [],
				loading: false,
				page: 1,
				pageSize: 10,
				total: 0,
				hasMore: true
			}
		},
		computed: {
			selectedCount() {
				return this.favorites.filter(item => item.selected).length
			}
		},
		onLoad() {
			this.loadFavorites()
		},
		methods: {
			loadMore() {
				if (this.loading) return
				if (!this.hasMore) return
				if (this.favorites.length >= this.total && this.total > 0) {
					this.hasMore = false
					return
				}
				this.page++
				this.loadFavorites()
			},
			loadFavorites(callback) {
				this.loading = true
				if (this.page === 1) {
					uni.showLoading({
						title: '加载中...'
					})
				}
				VodApi_vod_collect_list({ page: this.page, pagesize: this.pageSize }).then(res => {
					this.loading = false
					if (this.page === 1) {
						uni.hideLoading()
					}
					if (res && res.code === 1 && res.data) {
						this.total = res.data.total || 0
						console.log(this.total)
						const list = res.data.rows || []
						if (list.length > 0) {
							const newList = list.map(item => ({
								id: item.id,
								cover_image: item.cover_image || '',
								title: item.title || '',
								tags: item.tags || [],
								duration: item.duration || '',
								video: item.video || '',
								content: item.content || '',
								selected: false
							}))
							if (this.page === 1) {
								this.favorites = newList
							} else {
								this.favorites = [...this.favorites, ...newList]
							}
						}
						if (list.length < this.pageSize) {
							this.hasMore = false
						}
					} else {
						if (this.page === 1) {
							this.favorites = []
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
					console.error('加载收藏列表失败:', err)
					if (this.page === 1) {
						this.favorites = []
					}
					if (typeof callback === 'function') {
						callback()
					}
				})
			},
			goBack() {
				uni.navigateBack()
			},
			toggleEdit() {
				this.isEdit = !this.isEdit
				if (!this.isEdit) {
					this.favorites.forEach(item => item.selected = false)
				}
			},
			toggleSelect(index) {
				this.favorites[index].selected = !this.favorites[index].selected
			},
			playVideo(item) {
				if (!this.isEdit) {
					uni.navigateTo({
						url: '/pages/index/play?id=' + item.id +
							'&title=' + encodeURIComponent(item.title) +
							'&poster=' + encodeURIComponent(item.cover_image) +
							'&video=' + encodeURIComponent(item.video || '') +
							'&duration=' + item.duration
					})
				}
			},
			deleteItem(index) {
				const item = this.favorites[index]
				VodApi_vod_collect({ video_id: item.id }).then(res => {
					if (res && res.code === 1) {
						this.favorites.splice(index, 1)
						uni.showToast({ title: '取消收藏成功', icon: 'success' })
					} else {
						uni.showToast({ title: '取消收藏失败', icon: 'none' })
					}
				}).catch(err => {
					console.error('取消收藏失败:', err)
					uni.showToast({ title: '取消收藏失败', icon: 'none' })
				})
			},
			deleteSelected() {
				const selectedIds = this.favorites.filter(item => item.selected).map(item => item.id).join(',')
				VodApi_vod_collect({ video_id: selectedIds }).then(res => {
					if (res && res.code === 1) {
						this.favorites = this.favorites.filter(item => !item.selected)
						this.isEdit = false
						uni.showToast({ title: '批量取消收藏成功', icon: 'success' })
					} else {
						uni.showToast({ title: '批量取消收藏失败', icon: 'none' })
					}
				}).catch(err => {
					console.error('批量取消收藏失败:', err)
					uni.showToast({ title: '批量取消收藏失败', icon: 'none' })
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

	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 30rpx 20rpx;
		background-color: #f7f8fc;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}
	.top-nav-view {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
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

	.delete-icon {
		width: 40rpx;

	}

	.empty-text {
		font-size: 28rpx;
		color: #999999;
	}

	.content-list {
		height: calc(100vh - constant(safe-area-inset-bottom));
		height: calc(100vh - env(safe-area-inset-bottom));
		padding: 20rpx;
		padding-top: calc(120rpx + constant(safe-area-inset-top));
		padding-top: calc(120rpx + env(safe-area-inset-top));
		box-sizing: border-box;
	}

	.content-item {
		display: flex;
		align-items: center;
		background-color: #ffffff;
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
		color: #ff2155;
	}

	.item-cover {
		width: 160rpx;
		height: 200rpx;
		border-radius: 10rpx;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.item-title {
		font-size: 28rpx;
		color: #333333;
		font-weight: 500;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.item-tags {
		display: flex;
		gap: 10rpx;
		margin-bottom: 20rpx;
	}

	.item-tag {
		font-size: 20rpx;
		color: #ff2155;
		background-color: rgba(255, 33, 85, 0.1);
		padding: 4rpx 10rpx;
		border-radius: 4rpx;
	}

	.item-content {
		font-size: 24rpx;
		line-height: 36rpx;
		color: #666666;
		// margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.item-duration {
		font-size: 24rpx;
		color: #999999;
	}

	.item-delete {
		font-size: 36rpx;
		margin-left: 15rpx;
	}

	.bottom-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		background-color: #ffffff;
		border-top: 1rpx solid #ffffff;
	}

	.bar-info text {
		font-size: 26rpx;
		color: #999999;
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
		color: #999999;
	}
</style>
