<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="top-nav">
			<view class="nav-title">VIP充值中心</view>
			<view class="nav-order" @click="goToOrder">订单</view>
		</view>

		<!-- 用户信息 -->
		<view class="user-section">
			<view class="user-info">
				<image src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=avatar%20portrait%20icon&image_size=square" mode="aspectFill" class="user-avatar" />
				<view class="user-detail">
					<text class="user-name">丢三丢四、不丢你￥</text>
					<text class="user-status">（未绑定帐号）</text>
				</view>
			</view>
			<view class="vip-badge">
				<text class="vip-text">好色先生财富用户</text>
			</view>
			<view class="vip-hint">
				<text>遊客用戶，購買會員享受無限次數觀影體驗</text>
			</view>
		</view>

		<!-- VIP套餐 -->
		<scroll-view scroll-x class="vip-packages">
			<view class="packages-container">
				<view 
					v-for="(pkg, index) in packages" 
					:key="index"
					:class="['package-card', { active: selectedPackage === index }]"
					@click="selectPackage(index)"
				>
					<view v-if="pkg.recommend" class="recommend-tag">
						<text class="recommend-text">{{ pkg.recommendText }}</text>
					</view>
					<view class="package-price">
						<text class="price-symbol">¥</text>
						<text class="price-value">{{ pkg.price }}</text>
						<text class="price-unit">/{{ pkg.duration }}</text>
					</view>
					<view v-if="pkg.originalPrice" class="package-original">
						<text>原價{{ pkg.originalPrice }}元</text>
					</view>
					<view class="package-card-bg">
						<view class="card-icon">
							<view class="card-chip"></view>
							<view class="card-signal"></view>
						</view>
						<view class="package-name">{{ pkg.name }}</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- VIP权益 -->
		<view class="benefits-section">
			<view class="benefits-header">
				<text class="benefits-title">年卡會員享價值</text>
				<view class="benefits-value">
					<text class="value-symbol">¥</text>
					<text class="value-number">988元</text>
				</view>
				<text class="benefits-text">的增值套餐</text>
			</view>
			<view class="benefits-tag">
				<text>會員專享</text>
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
		<view class="recommend-section">
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				selectedPackage: 1,
				packages: [
					{
						name: '半年卡',
						price: 188,
						originalPrice: 588,
						duration: '183天',
						recommend: false,
						recommendText: ''
					},
					{
						name: '年卡',
						price: 300,
						originalPrice: 988,
						duration: '365天',
						recommend: true,
						recommendText: '所有VIP特權'
					},
					{
						name: '終身',
						price: 500,
						originalPrice: 1688,
						duration: '永久',
						recommend: true,
						recommendText: '至尊VIP特權'
					}
				],
				benefits: [
					{ name: '無限觀影', icon: '🎬' },
					{ name: '無限下載', icon: '⬇️' },
					{ name: '專屬客服', icon: '🎧' },
					{ name: '官方推薦', icon: '📌' },
					{ name: '午夜電臺', icon: '📖' },
					{ name: '槐凰免打賞', icon: '🎁' },
					{ name: '發布打賞帖', icon: '💰' }
				]
			}
		},
		computed: {
			currentPrice() {
				return this.packages[this.selectedPackage]?.price || 0
			}
		},
		methods: {
			goToOrder() {
				uni.showToast({
					title: '查看订单',
					icon: 'none'
				})
			},
			selectPackage(index) {
				this.selectedPackage = index
			},
			handlePay() {
				uni.showToast({
					title: '支付功能开发中',
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background: linear-gradient(180deg, #1a1a2e 0%, #0f0f1a 100%);
		padding-bottom: 266rpx;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	/* 顶部导航 */
	.top-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx 20rpx;
		padding-top: calc(30rpx + constant(safe-area-inset-top));
		padding-top: calc(30rpx + env(safe-area-inset-top));
		background-color: #16213e;
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
	}

	.package-card.active {
		border-color: #ffd700;
	}

	.package-card:nth-child(1) {
		background: linear-gradient(135deg, #8B0000 0%, #4A0000 100%);
	}

	.package-card:nth-child(2) {
		background: linear-gradient(135deg, #FFA500 0%, #FF8C00 100%);
	}

	.package-card:nth-child(3) {
		background: linear-gradient(135deg, #1a1a1a 0%, #000 100%);
	}

	.recommend-tag {
		position: absolute;
		top: 0;
		right: 0;
		background-color: #ffd700;
		padding: 8rpx 20rpx;
		border-radius: 0 20rpx 0 20rpx;
		z-index: 1;
	}

	.recommend-text {
		font-size: 20rpx;
		color: #000;
		font-weight: 500;
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
		bottom: 110rpx;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #1a1a1a;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
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
</style>
