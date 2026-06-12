<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="top-header">
			<u-status-bar bgColor="#16213e"></u-status-bar>
			<view class="top-nav-view">
				<view style="width: 100rpx;"></view>
				<view class="nav-title">VIP充值中心</view>
				<view class="nav-order" style="width: 100rpx;text-align: center;" @click="goToOrder">订单</view>
			</view>
		</view>

		<!-- 用户信息 -->
		<u-status-bar></u-status-bar>
		<view class="user-section">
			<view class="user-info">
				<image :src="userAvatar" mode="aspectFill" class="user-avatar" />
				<view class="user-detail">
					<text class="user-name">{{ userName }}</text>
					<text class="user-status">（{{ isVisitor ? '游客' : '已绑定' }}）</text>
				</view>
			</view>
			<view class="vip-badge">
				<text class="vip-text">{{ isMember ? 'VIP会员' : '普通用户' }}</text>
			</view>
			<view class="vip-hint">
				<text>购买会员享受无限次数观影体验</text>
			</view>
		</view>

		<!-- VIP套餐 -->
		<scroll-view scroll-x class="vip-packages">
			<view class="packages-container">
				<view 
					v-for="(pkg, index) in vipPackages" 
					:key="pkg.id"
					:class="['package-card', { active: selectedPackage === index }]"
					@click="selectPackage(index)"
				>
					<view v-if="pkg.days === 365" class="recommend-tag">
						<text class="recommend-text">推荐</text>
					</view>
					<view class="package-price">
						<text class="price-symbol">¥</text>
						<text class="price-value">{{ pkg.price }}</text>
						<text class="price-unit">/{{ pkg.days }}天</text>
					</view>
					<view v-if="pkg.original_price" class="package-original">
						<text>原价¥{{ pkg.original_price }}</text>
					</view>
					<view class="package-card-bg">
						<view class="card-icon">
							<view class="card-chip"></view>
							<view class="card-signal"></view>
						</view>
						<view class="package-name">{{ pkg.title }}</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- VIP权益 -->
		<view class="benefits-section">
			<view class="benefits-header">
				<text class="benefits-title">VIP会员享价值</text>
				<view class="benefits-value">
					<text class="value-symbol">¥</text>
					<text class="value-number">988元</text>
				</view>
				<text class="benefits-text">的增值套餐</text>
			</view>
			<view class="benefits-tag">
				<text>会员专享</text>
			</view>
			<view class="benefits-list">
				<view 
					v-for="(benefit, index) in benefits" 
					:key="index"
					class="benefit-item"
				>
					<view class="benefit-icon">{{ benefit.icon }}</view>
					<text class="benefit-name">{{ benefit.name }}</text>
				</view>
			</view>
		</view>

		<!-- 推荐内容 -->
		<!-- <view class="recommend-section">
			<view class="section-header">
				<text class="section-title">午夜電台·有聲小說</text>
				<view class="section-tag">
					<text>季度卡特權</text>
				</view>
			</view>
			<view class="recommend-content">
				<text class="recommend-desc">午夜說出來的情話讓你的耳朵達到高潮</text>
				<view class="recommend-arrows">
					<text class="arrow-icon">◀</text>
					<text class="arrow-icon">▶</text>
				</view>
			</view>
		</view> -->

		<!-- VIP广告位 -->
		<view v-if="vipAdvertise" class="vip-advertise" @click="openVipAdvertiseUrl">
			<image :src="vipAdvertise.image || vipAdvertise.cover_image" mode="aspectFill" class="advertise-image" />
		</view>

		<!-- 底部支付栏 -->
		<view class="bottom-bar">
			<view class="bar-left">
				<view class="service-icon">
					<text class="service-text">客服</text>
				</view>
				<view class="price-info">
					<text class="price-label">合計：</text>
					<text class="price-total-symbol">¥</text>
					<text class="price-total">{{ currentPrice }}</text>
				</view>
			</view>
			<view class="pay-btn" @click="handlePay">
				<text class="pay-text">立即支付</text>
			</view>
		</view>

		<!-- 支付弹窗 -->
		<view v-if="payModalVisible" class="pay-modal" @click="closePayModal">
			<view class="pay-modal-content" @click.stop>
				<view class="pay-modal-header">
					<text class="pay-modal-title">支付订单</text>
					<view class="pay-modal-close" @click="closePayModal">
						<text>✕</text>
					</view>
				</view>

				<view class="pay-modal-notice">
					<text>{{ marquee || '⚠️ 近期微信充值渠道波动较大，请您尽量使用支付宝支付！' }}</text>
				</view>

				<view class="pay-modal-amount">
					<view class="amount-main">
						<text class="amount-symbol">¥</text>
						<text class="amount-value">{{ currentPrice }}</text>
					</view>
					<text class="amount-label">（在线充值）</text>
				</view>

				<view class="pay-channels">
					<view 
						v-for="channel in paymentChannels" 
						:key="channel.id"
						:class="['channel-item', { active: selectedChannel === channel.id }]"
						@click="selectChannel(channel.id)"
					>
						<view class="channel-icon">
							<text>支</text>
						</view>
						<view class="channel-info">
							<view class="channel-name-wrap">
								<text class="channel-name">{{ channel.name }}</text>
								<view v-if="channel.is_hot === 1" class="recommend-tag">
									推荐
								</view>
							</view>
						</view>
						<view :class="['channel-check', { checked: selectedChannel === channel.id }]">
							<text v-if="selectedChannel === channel.id">✓</text>
						</view>
					</view>
				</view>

				<view class="pay-modal-footer">
					<view class="pay-submit-btn" @click="goToPay">
						<text>去支付</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { VipApiData, UserApi_get_user_info, VipApi_vip_order_add, VipApi_pay_passage, AdvertiseApi_advertise_list } from '@/api/home.js'
	export default {
		data() {
			return {
				selectedPackage: 0,
				vipPackages: [],
				benefits: [
					{ name: '无限观影', icon: '🎬' },
					{ name: '无限下载', icon: '⬇️' },
					{ name: '专属客服', icon: '🎧' },
					{ name: '官方推荐', icon: '📌' },
					{ name: '午夜电台', icon: '📖' },
					{ name: '槐凰免打赏', icon: '🎁' },
					{ name: '发布打赏帖', icon: '💰' }
				],
				userAvatar: '',
				userName: '游客用户',
				isMember: false,
				isVisitor: true,
				payModalVisible: false,
				currentOrder: null,
				paymentChannels: [],
				selectedChannel: '',
				orderId: '',
				marquee: '',
				vipAdvertise: null
			}
		},
		computed: {
			currentPrice() {
				return this.vipPackages[this.selectedPackage] && this.vipPackages[this.selectedPackage].price ? this.vipPackages[this.selectedPackage].price : 0
			}
		},
		onLoad() {
			this.loadVipData()
			this.loadUserInfo()
			this.loadVipAdvertise()
		},
		onShow() {
			this.loadUserInfo()
		},
		methods: {
			loadVipAdvertise() {
				AdvertiseApi_advertise_list({ name: 'VIP广告位' }).then(res => {
					if (res && res.code === 1 && res.data && res.data.length > 0) {
						this.vipAdvertise = res.data[0]
					}
				}).catch(err => {
					console.error('VIP广告加载失败', err)
				})
			},
			openVipAdvertiseUrl() {
				if (this.vipAdvertise && this.vipAdvertise.url) {
					this.openExternalURL(this.vipAdvertise.url)
				}
			},
			loadVipData() {
				VipApiData().then(res => {
					if (res && res.code === 1 && res.data) {
						this.vipPackages = res.data
					}
				}).catch(err => {
					console.error('VIP数据加载失败', err)
					this.vipPackages = [
						{
							id: 1,
							title: '周卡',
							content: '一周时间',
							icon: '',
							original_price: '20.00',
							price: '10.00',
							days: 7
						},
						{
							id: 2,
							title: '月卡',
							content: '一个月时间',
							icon: '',
							original_price: '60.00',
							price: '30.00',
							days: 30
						},
						{
							id: 3,
							title: '季卡',
							content: '一季度时间',
							icon: '',
							original_price: '180.00',
							price: '90.00',
							days: 90
						},
						{
							id: 4,
							title: '年卡',
							content: '一年时间',
							icon: '',
							original_price: '500.00',
							price: '220.00',
							days: 365
						}
					]
				})
			},
			loadUserInfo() {
				UserApi_get_user_info({}).then(res => {
					if (res && res.code === 1 && res.data && res.data.userinfo) {
						const userinfo = res.data.userinfo
						uni.setStorageSync('userinfo', JSON.stringify(userinfo))
						this.userAvatar = userinfo.avatar || userinfo.icon || ''
						this.userName = userinfo.nickname || userinfo.username || '游客用户'
						this.isMember = userinfo.is_member === 1
						this.isVisitor = userinfo.is_visitor === 1
					}
				}).catch(err => {
					console.error('获取用户信息失败', err)
					let userinfo = uni.getStorageSync('userinfo')
					if (userinfo) {
						try {
							let info = JSON.parse(userinfo)
							this.userAvatar = info.icon || info.avatar || ''
							this.userName = info.nickname || info.username || '游客用户'
							this.isMember = info.is_member === 1
							this.isVisitor = info.is_visitor === 1
						} catch (e) {
							console.error('解析用户信息失败', e)
						}
					}
				})
			},
			goToOrder() {
				uni.navigateTo({
					url: '/pages/vip/orders'
				})
			},
			selectPackage(index) {
				this.selectedPackage = index
			},
			handlePay() {
				var that = this
				var selectedVip = that.vipPackages[that.selectedPackage]
				if (!selectedVip || !selectedVip.id) {
					uni.showToast({ title: '请选择套餐', icon: 'none' })
					return
				}

				uni.showLoading({ title: '创建订单中...' })
				VipApi_vip_order_add({ vip_id: selectedVip.id }).then(function(res) {
					uni.hideLoading()
					if (res && res.code === 1 && res.data) {
						that.currentOrder = res.data
						that.orderId = res.data.order_id
						// 获取支付通道
						that.loadPaymentChannels()
					} else {
						uni.showToast({ title: res && res.msg || '创建订单失败', icon: 'none' })
					}
				}).catch(function(err) {
					uni.hideLoading()
					console.error('创建订单失败', err)
					uni.showToast({ title: '创建订单失败', icon: 'none' })
				})
			},
			closePayModal() {
				this.payModalVisible = false
			},
			loadPaymentChannels() {
				var that = this
				uni.showLoading({ title: '加载支付通道...' })
				VipApi_pay_passage({ order_id: this.orderId }).then(function(res) {
					uni.hideLoading()
					if (res && res.code === 1 && res.data) {
						that.paymentChannels = res.data.list || []
						that.marquee = res.data.marquee || ''
						// 默认选择推荐的支付通道
						var recommendedChannel = that.paymentChannels.find(function(ch) { return ch.is_hot === 1 })
						that.selectedChannel = recommendedChannel ? recommendedChannel.id : (that.paymentChannels[0] ? that.paymentChannels[0].id : '')
						that.payModalVisible = true
					} else {
						uni.showToast({ title: '获取支付通道失败', icon: 'none' })
					}
				}).catch(function(err) {
					uni.hideLoading()
					console.error('获取支付通道失败', err)
					uni.showToast({ title: '获取支付通道失败', icon: 'none' })
				})
			},
			selectChannel(channelId) {
				this.selectedChannel = channelId
			},
			goToPay() {
				var that = this
				if (!this.selectedChannel) {
					uni.showToast({ title: '请选择支付通道', icon: 'none' })
					return
				}
				var selectedChannel = that.paymentChannels.find(function(ch) { return ch.id === that.selectedChannel })
				if (!selectedChannel || !selectedChannel.url) {
					uni.showToast({ title: '支付通道信息异常', icon: 'none' })
					return
				}
				
				uni.showLoading({ title: '跳转支付中...' })
				uni.request({
					url: selectedChannel.url,
					method: 'POST',
					data: { order_id: that.orderId },
					timeout: 10000,
					success: function(res) {
						uni.hideLoading()
						if (res && res.data && res.data.code === 1 && res.data.data && res.data.data.pay_url) {
							that.openExternalURL(res.data.data.pay_url)
						} else {
							uni.showToast({ title: res.data.msg || '获取支付链接失败', icon: 'none' })
						}
					},
					fail: function(err) {
						uni.hideLoading()
						console.error('获取支付链接失败', err)
						uni.showToast({ title: '获取支付链接失败', icon: 'none' })
					}
				})
			},
			openExternalURL(url) {
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
				// 其他平台（微信小程序等）
				uni.setClipboardData({
					data: url,
					success: function() {
						uni.showToast({ title: '链接已复制，请到浏览器打开', icon: 'none' })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
		padding-bottom: calc(160rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
		padding-top: 120rpx;
	}

	/* 顶部导航 */
	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 30rpx 20rpx;
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

	.nav-title {
		font-size: 34rpx;
		color: #ffd700;
		font-weight: 600;
	}

	.nav-order {
		font-size: 26rpx;
		color: #ffd700;
		padding: 10rpx 20rpx;
	}

	/* 用户信息 */
	.user-section {
		background: linear-gradient(90deg, rgba(255, 215, 0, 0.2) 0%, rgba(255, 165, 0, 0.1) 100%);
		padding: 30rpx 20rpx;
		position: relative;
		overflow: hidden;
	}

	.user-section::after {
		content: '遊客';
		position: absolute;
		right: 30rpx;
		top: 50%;
		transform: translateY(-50%);
		font-size: 80rpx;
		color: rgba(255, 255, 255, 0.1);
		font-weight: bold;
	}

	.user-info {
		display: flex;
		align-items: center;
		gap: 20rpx;
		margin-bottom: 20rpx;
	}

	.user-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		border: 3rpx solid #ffd700;
	}

	.user-detail {
		display: flex;
		flex-direction: column;
		gap: 5rpx;
	}

	.user-name {
		font-size: 30rpx;
		color: #fff;
		font-weight: 500;
	}

	.user-status {
		font-size: 22rpx;
		color: #999;
	}

	.vip-badge {
		display: inline-flex;
		align-items: center;
		background: linear-gradient(90deg, rgba(255, 215, 0, 0.3) 0%, rgba(255, 165, 0, 0.2) 100%);
		padding: 8rpx 20rpx;
		border-radius: 30rpx;
		margin-bottom: 15rpx;
	}

	.vip-badge::before {
		content: '💰';
		margin-right: 8rpx;
	}

	.vip-text {
		font-size: 24rpx;
		color: #ffd700;
		font-weight: 500;
	}

	.vip-hint {
		font-size: 24rpx;
		color: #ccc;
	}

	/* VIP套餐 */
	.vip-packages {
		padding: 30rpx 0;
		white-space: nowrap;
	}

	.packages-container {
		display: inline-flex;
		gap: 20rpx;
		padding: 0 20rpx;
	}

	.package-card {
		position: relative;
		width: 280rpx;
		flex-shrink: 0;
		border-radius: 20rpx;
		overflow: hidden;
		border: 3rpx solid transparent;
		transition: all 0.3s;
		background: linear-gradient(135deg, #8B0000 0%, #4A0000 100%);
	}

	.package-card.active {
		border-color: #ffd700;
	}

	.package-card:nth-child(2) {
		background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
	}

	.package-card:nth-child(3) {
		background: linear-gradient(135deg, #4169E1 0%, #1E90FF 100%);
	}

	.package-card:nth-child(4) {
		background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
	}

	.vip-packages .recommend-tag {
		position: absolute;
		top: 0;
		right: 0;
		background: linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%);
		padding: 8rpx 20rpx;
		border-radius: 0 20rpx 0 20rpx;
		z-index: 1;
		box-shadow: 0 4rpx 12rpx rgba(255, 71, 87, 0.4);
	}

	.recommend-text {
		font-size: 20rpx;
		color: #fff;
		font-weight: 600;
		text-shadow: 0 1rpx 2rpx rgba(0, 0, 0, 0.2);
	}

	.package-price {
		padding: 30rpx 20rpx 10rpx;
		text-align: center;
	}

	.price-symbol {
		font-size: 24rpx;
		color: #fff;
	}

	.price-value {
		font-size: 56rpx;
		color: #fff;
		font-weight: bold;
	}

	.price-unit {
		font-size: 24rpx;
		color: #fff;
	}

	.package-original {
		text-align: center;
		padding-bottom: 15rpx;
	}

	.package-original text {
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.6);
		text-decoration: line-through;
	}

	.package-card-bg {
		padding: 20rpx;
		background-color: rgba(255, 255, 255, 0.1);
	}

	.card-icon {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 10rpx;
		margin-bottom: 15rpx;
	}

	.card-chip {
		width: 40rpx;
		height: 30rpx;
		background-color: rgba(255, 255, 255, 0.3);
		border-radius: 6rpx;
	}

	.card-signal {
		width: 30rpx;
		height: 30rpx;
		background: conic-gradient(from 0deg, rgba(255, 255, 255, 0.3) 0deg 180deg, transparent 180deg 360deg);
		border-radius: 50%;
	}

	.package-name {
		text-align: center;
		font-size: 30rpx;
		color: #fff;
		font-weight: 600;
	}

	/* VIP权益 */
	.benefits-section {
		background-color: #16213e;
		margin: 20rpx;
		border-radius: 16rpx;
		padding: 30rpx 20rpx;
		position: relative;
	}

	.benefits-header {
		display: flex;
		align-items: center;
		gap: 8rpx;
		margin-bottom: 20rpx;
	}

	.benefits-title {
		font-size: 26rpx;
		color: #999;
	}

	.benefits-value {
		display: flex;
		align-items: baseline;
		gap: 3rpx;
	}

	.value-symbol {
		font-size: 22rpx;
		color: #ffd700;
	}

	.value-number {
		font-size: 34rpx;
		color: #ffd700;
		font-weight: bold;
	}

	.benefits-text {
		font-size: 26rpx;
		color: #999;
	}

	.benefits-tag {
		position: absolute;
		right: 20rpx;
		top: 20rpx;
		background-color: #ffd700;
		color: #000;
		font-size: 18rpx;
		padding: 6rpx 15rpx;
		border-radius: 20rpx;
		transform: rotate(15deg);
	}

	.benefits-list {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 20rpx;
	}

	.benefit-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}

	.benefit-icon {
		font-size: 40rpx;
	}

	.benefit-name {
		font-size: 22rpx;
		color: #ccc;
		text-align: center;
	}

	/* 推荐内容 */
	.recommend-section {
		background: linear-gradient(90deg, rgba(255, 192, 203, 0.2) 0%, rgba(255, 228, 181, 0.2) 100%);
		margin: 0 20rpx;
		border-radius: 16rpx;
		padding: 30rpx 20rpx;
		position: relative;
		overflow: hidden;
	}

	.section-header {
		display: flex;
		align-items: center;
		gap: 15rpx;
		margin-bottom: 20rpx;
	}

	.section-title {
		font-size: 36rpx;
		color: #fff;
		font-weight: 600;
	}

	.section-tag {
		background-color: #ff69b4;
		color: #fff;
		font-size: 20rpx;
		padding: 6rpx 15rpx;
		border-radius: 20rpx;
	}

	.recommend-content {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.recommend-desc {
		font-size: 28rpx;
		color: #fff;
		flex: 1;
	}

	.recommend-arrows {
		display: flex;
		gap: 15rpx;
	}

	.arrow-icon {
		font-size: 32rpx;
		color: rgba(255, 255, 255, 0.5);
	}

	/* 底部支付栏 */
	.bottom-bar {
		position: fixed;
		// #ifdef H5
		bottom: calc(98rpx + constant(safe-area-inset-bottom));
		bottom: calc(98rpx + env(safe-area-inset-bottom));
		// #endif
		// #ifndef H5
		bottom: 0;
		// #endif
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #1a1a1a;
		padding: 20rpx 30rpx;
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
		z-index: 99;
	}

	.bar-left {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}

	.service-icon {
		width: 80rpx;
		height: 80rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.service-text {
		font-size: 22rpx;
		color: #000;
		font-weight: 500;
	}

	.price-info {
		display: flex;
		align-items: baseline;
	}

	.price-label {
		font-size: 26rpx;
		color: #fff;
	}

	.price-total-symbol {
		font-size: 28rpx;
		color: #ffd700;
	}

	.price-total {
		font-size: 48rpx;
		color: #ffd700;
		font-weight: bold;
	}

	.pay-btn {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 20rpx 50rpx;
		border-radius: 40rpx;
	}

	.pay-text {
		font-size: 30rpx;
		color: #000;
		font-weight: 600;
	}

	/* 支付弹窗 */
	.pay-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: flex-end;
		z-index: 1000;
	}

	.pay-modal-content {
		width: 100%;
		background-color: #1a1a2e;
		border-radius: 30rpx 30rpx 0 0;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
	}

	.pay-modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.pay-modal-title {
		font-size: 34rpx;
		color: #fff;
		font-weight: 600;
	}

	.pay-modal-close {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.pay-modal-close text {
		font-size: 36rpx;
		color: #999;
	}

	.pay-modal-notice {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 20rpx 30rpx;
	}

	.pay-modal-notice text {
		font-size: 24rpx;
		color: #333;
	}

	.pay-modal-amount {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 40rpx 30rpx;
	}

	.amount-main {
		display: flex;
		align-items: baseline;
	}

	.amount-symbol {
		font-size: 36rpx;
		color: #ffd700;
		margin-right: 8rpx;
	}

	.amount-value {
		font-size: 72rpx;
		color: #fff;
		font-weight: bold;
	}

	.amount-label {
		font-size: 26rpx;
		color: #999;
		margin-top: 10rpx;
	}

	.pay-channels {
		padding: 0 30rpx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		gap: 15rpx;
	}

	.channel-item {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #252540;
		border-radius: 12rpx;
		width: calc(50% - 12rpx);
		border: 2rpx solid transparent;
		position: relative;
	}

	.channel-item.active {
		border-color: #ffd700;
		background-color: rgba(255, 215, 0, 0.1);
	}

	.channel-icon {
		width: 50rpx;
		height: 50rpx;
		background: linear-gradient(135deg, #1677ff 0%, #0958d9 100%);
		border-radius: 10rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 15rpx;
		flex-shrink: 0;
	}

	.channel-icon text {
		font-size: 24rpx;
		color: #fff;
		font-weight: 600;
	}

	.channel-info {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.channel-name-wrap {
		display: flex;
		align-items: center;
		gap: 6rpx;
	}

	.channel-name {
		font-size: 24rpx;
		color: #fff;
	}

	.pay-channels .recommend-tag {
		background: linear-gradient(135deg, #ff4757 0%, #ff6b6b 100%);
		padding: 10rpx 20rpx;
		border-radius: 6rpx;
		box-shadow: 0 2rpx 8rpx rgba(255, 71, 87, 0.3);
		position: absolute;
		right: 0;
		top: 0;
		font-size: 16rpx;
		color: #fff;
		font-weight: 600;
		line-height: 16rpx;
		display: block;
	}

	.pay-channels .recommend-tag text {
	}

	.channel-desc {
		font-size: 18rpx;
		color: #999;
		margin-top: 2rpx;
	}

	.channel-check {
		width: 32rpx;
		height: 32rpx;
		border: 2rpx solid #666;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-shrink: 0;
	}

	.channel-check.checked {
		background-color: #ffd700;
		border-color: #ffd700;
	}

	.channel-check.checked text {
		font-size: 24rpx;
		color: #333;
	}

	.pay-modal-footer {
		padding: 30rpx;
	}

	.pay-submit-btn {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 24rpx;
		border-radius: 12rpx;
		text-align: center;
	}

	.pay-submit-btn text {
		font-size: 32rpx;
		color: #000;
		font-weight: 600;
	}

	/* VIP广告位 */
	.vip-advertise {
		margin: 20rpx;
		border-radius: 16rpx;
		overflow: hidden;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
	}

	.vip-advertise .advertise-image {
		width: 100%;
		height: 240rpx;
		display: block;
	}
</style>
