<template>
	<view class="page">
		<u-status-bar bgColor="#16213e"></u-status-bar>
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back_black.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">訂單記錄</view>
			<view class="nav-right"></view>
		</view>

		<scroll-view 
			scroll-y 
			class="content-scroll"
			@scrolltolower="loadMore"
		>
			<view class="orders-container">
				<view v-if="orderList.length === 0 && !loading" class="empty-state">
					<view class="empty-icon">
						<text>空</text>
					</view>
					<text class="empty-text">人家是有底線的~~</text>
				</view>

				<view v-for="(order, index) in orderList" :key="order.id" class="order-item">
					<view class="order-header">
						<view class="order-info">
							<text class="order-label">訂單號</text>
							<text class="order-no">{{ order.order_no }}</text>
							<view class="copy-btn" @click="copyOrderNo(order.order_no)">
								<text>複製</text>
							</view>
						</view>
						<view class="order-actions">
							<text :class="['order-status', getStatusClass(order.status)]">{{ order.status_text }}</text>
						</view>
					</view>

					<view class="order-content">
						<view class="order-icon">
							<view class="vip-icon">
								<text>♦</text>
							</view>
						</view>
						<view class="order-detail">
							<text class="order-title">{{ order.title }}</text>
							<text class="order-time">{{ formatTime(order.createtime) }}</text>
						</view>
						<view class="order-price">
							<text class="price-value">{{ order.price }}元</text>
						</view>
					</view>

					<view class="order-footer">
						<view class="contact-btn" @click="contactService">
							<text>聯繫客服</text>
						</view>
					</view>
				</view>

				<view v-if="loading" class="loading-more">
					<text>加载中...</text>
				</view>

				<view v-if="!loading && hasMore && orderList.length > 0" class="loading-more">
					<text>上拉加载更多</text>
				</view>

				<view v-if="!loading && !hasMore && orderList.length > 0" class="loading-more">
					<text>已加载全部</text>
				</view>
			</view>

			<view class="footer-hint">
				<text>僅展示最近7天的充值數據</text>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	const { VipApi_vip_order_list, UserApi_get_customer_service } = require('../../api/home.js')

	export default {
		data() {
			return {
				orderList: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				hasMore: true
			}
		},
		onLoad() {
			this.loadOrderList()
		},
		methods: {
			loadOrderList(isRefresh = false) {
				var that = this
				if (that.loading) return

				that.loading = true
				var params = {
					page: that.page,
					pageSize: that.pageSize
				}

				VipApi_vip_order_list(params).then(function(res) {
					that.loading = false
					if (res.code === 1 && res.data) {
						var data = res.data
						that.total = data.total || 0
						
						if (isRefresh) {
							that.orderList = data.rows || []
						} else {
							that.orderList = that.orderList.concat(data.rows || [])
						}

						that.hasMore = that.orderList.length < that.total
					} else {
						if (!isRefresh && that.orderList.length === 0) {
							that.orderList = []
						}
						that.hasMore = false
					}
				}).catch(function(error) {
					console.error('加载订单失败', error)
					that.loading = false
					if (that.orderList.length === 0) {
						that.orderList = []
					}
					that.hasMore = false
				})
			},
			refresh() {
				this.page = 1
				this.total = 0
				this.hasMore = true
				this.loadOrderList(true)
			},
			loadMore() {
				if (this.hasMore && !this.loading) {
					this.page++
					this.loadOrderList()
				}
			},
			getStatusClass(status) {
				var statusMap = {
					0: 'unpaid',
					1: 'paid',
					2: 'completed',
					3: 'timeout',
					4: 'cancelled'
				}
				return statusMap[status] || 'unpaid'
			},
			formatTime(timestamp) {
				if (!timestamp) return ''
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
			copyOrderNo(orderNo) {
				uni.setClipboardData({
					data: orderNo,
					success: function() {
						uni.showToast({ title: '複製成功', icon: 'success' })
					},
					fail: function() {
						uni.showToast({ title: '複製失敗', icon: 'none' })
					}
				})
			},
			contactService() {
				var that = this
				uni.showLoading({ title: '加载中...' })
				UserApi_get_customer_service({}).then(function(res) {
					uni.hideLoading()
					if (res.code === 1 && res.data && res.data.customer_service_url) {
						that.openCustomerService(res.data.customer_service_url)
					} else {
						uni.showToast({ title: '获取客服链接失败', icon: 'none' })
					}
				}).catch(function(error) {
					console.error('获取客服链接失败', error)
					uni.hideLoading()
					uni.showToast({ title: '获取客服链接失败', icon: 'none' })
				})
			},
			openCustomerService(url) {
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
					success: function() {
						uni.showToast({ title: '链接已复制，请在浏览器打开', icon: 'none' })
					}
				})
			},
			goBack() {
				uni.navigateBack()
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

	.content-scroll {
		height: calc(100vh - 120rpx);
	}

	.orders-container {
		padding: 20rpx;
	}

	.order-item {
		background: #fff;
		border-radius: 16rpx;
		padding: 24rpx;
		margin-bottom: 20rpx;
	}

	.order-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
		padding-bottom: 16rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}

	.order-info {
		display: flex;
		align-items: center;
		gap: 10rpx;
	}

	.order-label {
		font-size: 24rpx;
		color: #999;
	}

	.order-no {
		font-size: 24rpx;
		color: #333;
		font-family: 'Courier New', monospace;
	}

	.order-actions {
		display: flex;
		align-items: center;
		gap: 16rpx;
	}

	.copy-btn {
		padding: 8rpx 16rpx;
		background: linear-gradient(135deg, #ff8a00 0%, #ff2d55 100%);
		border-radius: 8rpx;

		text {
			font-size: 22rpx;
			color: #fff;
		}
	}

	.order-status {
		font-size: 24rpx;
		font-weight: 600;

		&.unpaid {
			color: #ff6b6b;
		}

		&.timeout {
			color: #999;
		}

		&.paid {
			color: #07c160;
		}

		&.completed {
			color: #07c160;
		}

		&.cancelled {
			color: #999;
		}
	}

	.order-content {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.order-icon {
		margin-right: 20rpx;
	}

	.vip-icon {
		width: 60rpx;
		height: 60rpx;
		background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
		border-radius: 12rpx;
		display: flex;
		align-items: center;
		justify-content: center;

		text {
			font-size: 32rpx;
			color: #fff;
		}
	}

	.order-detail {
		flex: 1;
	}

	.order-title {
		display: block;
		font-size: 28rpx;
		font-weight: 600;
		color: #333;
		margin-bottom: 8rpx;
	}

	.order-time {
		font-size: 22rpx;
		color: #999;
	}

	.order-price {
		text-align: right;
	}

	.price-value {
		font-size: 32rpx;
		font-weight: bold;
		color: #ff2d55;
	}

	.order-footer {
		display: flex;
		justify-content: flex-end;
	}

	.contact-btn {
		padding: 10rpx 24rpx;
		border: 1rpx solid #ddd;
		border-radius: 20rpx;

		text {
			font-size: 24rpx;
			color: #666;
		}
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 120rpx 0;
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

	.loading-more {
		text-align: center;
		padding: 20rpx;

		text {
			font-size: 24rpx;
			color: #999;
		}
	}

	.footer-hint {
		text-align: center;
		padding: 30rpx;

		text {
			font-size: 22rpx;
			color: #ccc;
		}
	}
</style>