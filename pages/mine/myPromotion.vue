<template>
	<view class="page">
		<view class="top-header">
			<u-status-bar bg-color="#ffffff"></u-status-bar>
			<view class="top-nav-view">
				<view class="nav-back" @click="goBack">
					<image src="../../static/images/back_black.png" mode="widthFix" class="back-icon" />
				</view>
				<view class="nav-title">我的推广</view>
				<view class="nav-right"></view>
			</view>
		</view>

		<view class="stats-bar">
			<view class="stat-item">
				<text class="stat-value">{{ total }}</text>
				<text class="stat-label">推广总人数</text>
			</view>
		</view>

		<scroll-view 
			scroll-y 
			class="content-scroll" 
			@scrolltolower="loadMore"
		>
			<view class="list-container">
				<view v-if="promotionList.length === 0" class="empty-state">
					<view class="empty-icon">
						<text>空</text>
					</view>
					<text class="empty-text">暂无推广记录</text>
				</view>
				<view v-for="(item, index) in promotionList" :key="item.id" class="list-item">
					<view class="item-avatar">
						<text class="avatar-text">{{ getAvatarText(item) }}</text>
					</view>
					<view class="item-info">
						<view class="item-name">{{ getNickname(item) }}</view>
						<view class="item-detail">
							<text class="detail-item">ID: {{ item.user_id }}</text>
							<text class="detail-item">{{ formatTime(item.createtime) }}</text>
						</view>
					</view>
					<view class="item-mobile">{{ getMobile(item) }}</view>
				</view>
			</view>

			<view class="load-more">
				<text v-if="isLoading" class="loading-text">加载中...</text>
				<text v-else-if="hasMore" class="load-text">点击加载更多</text>
				<text v-else class="no-more">— 已加载全部 —</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	const { UserApi_get_promotion_records } = require('../../api/home.js')

	export default {
		data() {
			return {
				promotionList: [],
				currentPage: 1,
				pageSize: 10,
				total: 0,
				isLoading: false,
				hasMore: true
			}
		},
		onLoad() {
			this.loadPromotionList()
		},
		methods: {
			loadPromotionList(isRefresh) {
				var that = this
				if (that.isLoading) return

				that.isLoading = true

				var params = {
					page: isRefresh ? 1 : that.currentPage,
					limit: that.pageSize
				}

				UserApi_get_promotion_records(params).then(function(res) {
					if (res.code === 1 && res.data) {
						if (isRefresh) {
							that.promotionList = []
							that.currentPage = 1
						}

						var data = res.data
						that.total = data.total || 0

						if (data.rows && data.rows.length > 0) {
							for (var i = 0; i < data.rows.length; i++) {
								that.promotionList.push(data.rows[i])
							}
							that.currentPage++
							that.hasMore = data.rows.length >= that.pageSize
						} else {
							that.hasMore = false
						}
					} else {
						that.hasMore = false
						if (that.promotionList.length === 0) {
							uni.showToast({ title: '暂无数据', icon: 'none' })
						}
					}
					that.isLoading = false
				}).catch(function(error) {
					console.error('加载推广记录失败', error)
					uni.showToast({ title: '加载失败', icon: 'none' })
					that.isLoading = false
				})
			},
			loadMore() {
				if (this.hasMore && !this.isLoading) {
					this.loadPromotionList()
				}
			},
			refresh() {
				this.hasMore = true
				this.loadPromotionList(true)
			},
			formatTime(timestamp) {
				if (!timestamp) return '-'
				var date = new Date(timestamp * 1000)
				var year = date.getFullYear()
				var month = String(date.getMonth() + 1)
				if (month.length === 1) month = '0' + month
				var day = String(date.getDate())
				if (day.length === 1) day = '0' + day
				var hour = String(date.getHours())
				if (hour.length === 1) hour = '0' + hour
				var minute = String(date.getMinutes())
				if (minute.length === 1) minute = '0' + minute
				return year + '-' + month + '-' + day + ' ' + hour + ':' + minute
			},
			goBack() {
				uni.navigateBack()
			},
			getAvatarText(item) {
				if (item.user_info && item.user_info.nickname && item.user_info.nickname.length > 0) {
					return item.user_info.nickname.charAt(0)
				}
				return '?'
			},
			getNickname(item) {
				if (item.user_info && item.user_info.nickname && item.user_info.nickname.length > 0) {
					return item.user_info.nickname
				}
				return '未知用户'
			},
			getMobile(item) {
				if (item.user_info && item.user_info.mobile && item.user_info.mobile.length > 0) {
					return item.user_info.mobile
				}
				return '未绑定'
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-top: 120rpx;
	}

	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 30rpx 30rpx;
		background-color: #fff;
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
		align-items: center;
		padding: 30rpx;
		background-color: #fff;
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
		color: #333;
		font-weight: 600;
		text-align: center;
	}

	.nav-right {
		width: 60rpx;
	}

	.stats-bar {
		background: linear-gradient(135deg, #ff8a00 0%, #ff2d55 100%);
		padding: 40rpx 30rpx;
		display: flex;
		justify-content: center;
	}

	.stat-item {
		text-align: center;
	}

	.stat-value {
		display: block;
		font-size: 48rpx;
		font-weight: bold;
		color: #fff;
		margin-bottom: 10rpx;
	}

	.stat-label {
		font-size: 24rpx;
		color: rgba(255, 255, 255, 0.8);
	}

	.content-scroll {
		height: calc(100vh - 320rpx);
	}

	.list-container {
		padding: 20rpx;
	}

	.list-item {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.item-avatar {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #ff8a00 0%, #ff2d55 100%);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}

	.avatar-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}

	.item-info {
		flex: 1;
	}

	.item-name {
		font-size: 30rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 10rpx;
	}

	.item-detail {
		display: flex;
		gap: 20rpx;
	}

	.detail-item {
		font-size: 24rpx;
		color: #999;
	}

	.item-mobile {
		font-size: 24rpx;
		color: #666;
		padding: 8rpx 16rpx;
		background: #f5f5f5;
		border-radius: 8rpx;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.empty-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background: #f0f0f0;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 20rpx;

		text {
			font-size: 48rpx;
			color: #ccc;
		}
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.load-more {
		padding: 30rpx;
		text-align: center;
	}

	.loading-text {
		font-size: 26rpx;
		color: #999;
	}

	.load-text {
		font-size: 26rpx;
		color: #ff8a00;
	}

	.no-more {
		font-size: 24rpx;
		color: #ccc;
	}
</style>