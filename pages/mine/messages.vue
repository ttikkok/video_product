<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">消息通知</view>
			<view class="nav-right">
				<view class="nav-all" @click="markAllRead">
					<text>全部已读</text>
				</view>
			</view>
		</view>

		<!-- 分类标签 -->
		<scroll-view scroll-x class="category-tabs">
			<view class="tabs">
				<view 
					v-for="(category, index) in categoryList" 
					:key="category.id || index"
					:class="['tab-item', { active: activeCategory === index }]"
					@click="switchCategory(index)"
				>
					{{ category.name }}
				</view>
			</view>
		</scroll-view>

		<!-- 消息列表 -->
		<scroll-view scroll-y class="message-list" @scrolltolower="loadMore">
			<u-empty v-if="!loading && messages.length === 0" :text="'暂无消息'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

			<template v-if="messages.length > 0">
				<view v-for="(msg, index) in messages" :key="msg.id || index" :class="['message-item', { unread: msg.is_read !== 1 }]" @click="openMessage(msg)">
					<view class="msg-icon">{{ getCategoryIcon(msg.category_id) }}</view>
					<view class="msg-content">
						<view class="msg-header">
							<text class="msg-title">{{ msg.title }}</text>
							<text class="msg-time">{{ formatTime(msg.createtime) }}</text>
						</view>
						<text class="msg-desc">{{ msg.content || '点击查看详情' }}</text>
					</view>
					<view v-if="msg.is_read !== 1" class="unread-dot"></view>
				</view>
				<u-loadmore 
					v-if="messages.length > 0" 
					:status="loading ? 'loading' : (hasMore ? 'loadmore' : 'nomore')" 
					loading-text="加载中" 
					loadmore-text="加载中" 
					nomore-text="暂无更多数据" 
					class="py-3" 
				/>
			</template>
		</scroll-view>
	</view>
</template>

<script>
	import { MessageApi_message_type_list, MessageApi_message_data_list_search, MessageApi_message_read_all } from '@/api/home.js'
	export default {
		data() {
			return {
				categoryList: [],
				activeCategory: 0,
				currentCategoryId: null,
				messages: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				hasMore: true
			}
		},
		onLoad() {
			this.loadCategoryList()
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			loadCategoryList() {
				MessageApi_message_type_list().then(res => {
					if (res && res.code === 1 && res.data && res.data.length > 0) {
						this.categoryList = res.data
					} else {
						this.categoryList = [
							{ id: 30, name: '系统消息', nickname: '系统消息' },
							{ id: 31, name: '订单消息', nickname: '订单消息' }
						]
					}
					if (this.categoryList.length > 0) {
						this.currentCategoryId = this.categoryList[0].id
					}
					this.loadMessageList()
				}).catch(err => {
					console.error('加载分类失败', err)
					this.categoryList = [
						{ id: 30, name: '系统消息', nickname: '系统消息' },
						{ id: 31, name: '订单消息', nickname: '订单消息' }
					]
					this.currentCategoryId = this.categoryList[0].id
					this.loadMessageList()
				})
			},
			switchCategory(index) {
				this.activeCategory = index
				this.currentCategoryId = this.categoryList[index] && this.categoryList[index].id !== undefined ? this.categoryList[index].id : null
				this.page = 1
				this.messages = []
				this.hasMore = true
				this.loadMessageList()
			},
			loadMore() {
				if (this.loading) return
				if (!this.hasMore) return
				if (this.messages.length >= this.total && this.total > 0) {
					this.hasMore = false
					return
				}
				this.page++
				this.loadMessageList()
			},
			loadMessageList() {
				this.loading = true
				let params = { 
					page: this.page, 
					pagesize: this.pageSize 
				}
				if (this.currentCategoryId !== null && this.currentCategoryId !== undefined) {
					params.category_id = this.currentCategoryId
				}
				MessageApi_message_data_list_search(params).then(res => {
					this.loading = false
					if (res && res.code === 1 && res.data) {
						this.total = res.data.total || 0
						const list = res.data.rows || []
						if (list.length > 0) {
							if (this.page === 1) {
								this.messages = list
							} else {
								this.messages = [...this.messages, ...list]
							}
						}
						if (list.length < this.pageSize) {
							this.hasMore = false
						}
					} else {
						if (this.page === 1) {
							this.messages = []
						}
					}
				}).catch(err => {
					this.loading = false
					console.error('加载消息列表失败', err)
					if (this.page === 1) {
						this.loadMockData()
					}
				})
			},
			loadMockData() {
				this.messages = [
					{
						id: 1,
						category_id: 30,
						title: '系统消息1',
						content: '平台新增午夜电台功能，快去体验吧',
						is_read: 0,
						createtime: Date.now() - 600000
					},
					{
						id: 2,
						category_id: 30,
						title: '系统消息2',
						content: '恭喜您成为VIP会员，享受无限观影特权',
						is_read: 0,
						createtime: Date.now() - 1800000
					},
					{
						id: 3,
						category_id: 31,
						title: '订单消息1',
						content: '您的订单已支付成功',
						is_read: 1,
						createtime: Date.now() - 3600000
					},
					{
						id: 4,
						category_id: 31,
						title: '订单消息2',
						content: '您的订单正在处理中',
						is_read: 1,
						createtime: Date.now() - 7200000
					}
				]
				this.total = 4
			},
			getCategoryIcon(categoryId) {
				const icons = {
					30: '📢',
					31: '📋'
				}
				return icons[categoryId] || '🔔'
			},
			formatTime(timestamp) {
				if (!timestamp) return ''
				const now = Date.now()
				const diff = now - timestamp
				const minute = 60 * 1000
				const hour = 60 * minute
				const day = 24 * hour

				if (diff < minute) {
					return '刚刚'
				} else if (diff < hour) {
					return Math.floor(diff / minute) + '分钟前'
				} else if (diff < day) {
					return Math.floor(diff / hour) + '小时前'
				} else {
					return Math.floor(diff / day) + '天前'
				}
			},
			markAllRead() {
				MessageApi_message_read_all().then(res => {
					if (res && res.code === 1) {
						this.messages.forEach(msg => msg.is_read = 1)
						uni.showToast({ title: '全部已读', icon: 'success' })
					} else {
						uni.showToast({ title: res.msg || '操作失败', icon: 'none' })
					}
				}).catch(err => {
					console.error('全部已读失败', err)
					uni.showToast({ title: '操作失败', icon: 'none' })
				})
			},
			openMessage(msg) {
				if (msg.is_read !== 1) {
					msg.is_read = 1
				}
				uni.navigateTo({
					url: `/pages/mine/messageDetail?id=${msg.id}`
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

	.top-nav {
		display: flex;
		align-items: center;
		padding: 0 20rpx;
		height: 88rpx;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
		background-color: #16213e;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
	}

	.nav-back {
		width: 100rpx;
		display: flex;
		align-items: center;
		justify-content: flex-start;
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

	.nav-right {
		width: 100rpx;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	.nav-all {
		font-size: 26rpx;
		color: #6BA3E0;
	}

	/* 分类标签 */
	.category-tabs {
		background-color: #16213e;
		white-space: nowrap;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
		position: fixed;
		top: calc(88rpx + constant(safe-area-inset-top));
		top: calc(88rpx + env(safe-area-inset-top));
		left: 0;
		right: 0;
		z-index: 99;
	}

	.tabs {
		display: inline-flex;
		gap: 40rpx;
		padding: 0 20rpx;
	}

	.tab-item {
		padding: 20rpx 10rpx;
		font-size: 28rpx;
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

	.message-list {
		height: calc(100vh - constant(safe-area-inset-bottom));
		height: calc(100vh - env(safe-area-inset-bottom));
		padding: 20rpx;
		padding-top: calc(200rpx + constant(safe-area-inset-top));
		padding-top: calc(200rpx + env(safe-area-inset-top));
		box-sizing: border-box;
	}

	.message-item {
		display: flex;
		align-items: flex-start;
		background-color: #16213e;
		border-radius: 12rpx;
		padding: 25rpx;
		margin-bottom: 20rpx;
		position: relative;
	}

	.message-item.unread {
		background-color: rgba(107, 163, 224, 0.1);
	}

	.msg-icon {
		font-size: 48rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}

	.msg-content {
		flex: 1;
		overflow: hidden;
	}

	.msg-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.msg-title {
		font-size: 28rpx;
		color: #fff;
		font-weight: 600;
	}

	.msg-time {
		font-size: 22rpx;
		color: #999;
	}

	.msg-desc {
		font-size: 24rpx;
		color: #ccc;
		line-height: 1.5;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.unread-dot {
		position: absolute;
		top: 30rpx;
		right: 30rpx;
		width: 16rpx;
		height: 16rpx;
		background-color: #e74c3c;
		border-radius: 50%;
	}
</style>