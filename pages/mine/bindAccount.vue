<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">绑定手机号</view>
			<view class="nav-placeholder"></view>
		</view>

		<view v-if="!hasBound" class="form-section">
			<view class="phone-input-wrap">
				<view class="country-code">
					<text>+86</text>
				</view>
				<input 
					v-model="phone" 
					class="phone-input" 
					type="number" 
					placeholder="请输入手机号码"
					maxlength="11"
				/>
			</view>

			<view 
				:class="['bind-btn', { disabled: !phone || phone.length !== 11 }]" 
				@click="bindPhone"
			>
				<text>确认绑定</text>
			</view>
		</view>

		<view v-else class="bound-success">
			<view class="success-icon">✓</view>
			<text class="success-title">绑定成功</text>
			<text class="success-phone">已绑定手机号：{{ userMobile }}</text>
			<text class="success-tip">手机号绑定后不支持修改</text>
		</view>

		<view v-if="promotionRules.length > 0" class="rules-section">
			<view class="rules-header">
				<text class="rules-title">绑定规则</text>
			</view>
			<view v-for="rule in promotionRules" :key="rule.id" class="rule-item">
				<text class="rule-title">{{ rule.title }}</text>
				<text class="rule-content" v-html="rule.content"></text>
			</view>
		</view>

	</view>
</template>

<script>
	import { UserApi_bind_mobile, UserApi_get_customer_service } from '@/api/home.js'
	export default {
		data() {
			return {
				phone: '',
				hasBound: false,
				userMobile: '',
				promotionRules: []
			}
		},
		onLoad() {
			this.checkBindStatus()
			this.loadPromotionRules()
		},
		methods: {
			checkBindStatus() {
				const userinfo = uni.getStorageSync('userinfo')
				if (userinfo) {
					try {
						const info = JSON.parse(userinfo)
						if (info.mobile) {
							this.hasBound = true
							this.userMobile = info.mobile
						}
					} catch (e) {
						console.error('解析userinfo失败', e)
					}
				}
			},
			loadPromotionRules() {
				var that = this
				UserApi_get_customer_service({}).then(function(res) {
					if (res.code === 1 && res.data && res.data.promotion_rules) {
						that.promotionRules = res.data.promotion_rules
					}
				}).catch(function(error) {
					console.error('获取规则失败', error)
				})
			},
			goBack() {
				uni.navigateBack()
			},
			bindPhone() {
				if (!this.phone || this.phone.length !== 11) {
					uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
					return
				}

				uni.showLoading({ title: '绑定中...' })
				UserApi_bind_mobile({ mobile: this.phone }).then(res => {
					uni.hideLoading()
					if (res && res.code === 1) {
						uni.showToast({ title: '绑定成功', icon: 'success' })
						this.hasBound = true
						this.userMobile = this.phone
						uni.setStorageSync('isBound', 'true')
						const userinfo = uni.getStorageSync('userinfo')
						if (userinfo) {
							try {
								const info = JSON.parse(userinfo)
								info.mobile = this.phone
								uni.setStorageSync('userinfo', JSON.stringify(info))
							} catch (e) {
								console.error('更新userinfo失败', e)
							}
						}
					} else {
						uni.showToast({ title: res && res.msg || '绑定失败', icon: 'none' })
					}
				}).catch(err => {
					uni.hideLoading()
					console.error('绑定失败', err)
					uni.showToast({ title: '绑定失败', icon: 'none' })
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #0f1629;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
		box-sizing: border-box;
	}

	.top-nav {
		display: flex;
		align-items: center;
		padding: 30rpx;
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

	.nav-placeholder {
		width: 60rpx;
	}

	.form-section {
		padding: 40rpx 30rpx;
	}

	.phone-input-wrap {
		display: flex;
		align-items: center;
		background-color: #1a2744;
		border: 1rpx solid rgba(255, 255, 255, 0.1);
		border-radius: 10rpx;
		padding: 0 20rpx;
		margin-bottom: 40rpx;
	}

	.country-code {
		padding: 0 20rpx 0 0;
		border-right: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.country-code text {
		font-size: 28rpx;
		color: #999;
	}

	.phone-input {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #fff;
		background: transparent;
	}

	.phone-input::placeholder {
		color: #666;
	}

	.bind-btn {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 16rpx;
		border-radius: 10rpx;
		text-align: center;
	}

	.bind-btn.disabled {
		background: rgba(255, 255, 255, 0.2);
	}

	.bind-btn text {
		font-size: 30rpx;
		color: #000;
		font-weight: 600;
	}

	.bind-btn.disabled text {
		color: #666;
	}

	.bound-success {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 30rpx;
	}

	.success-icon {
		width: 120rpx;
		height: 120rpx;
		border-radius: 50%;
		background-color: #27ae60;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 60rpx;
		color: #fff;
		margin-bottom: 30rpx;
	}

	.success-title {
		font-size: 36rpx;
		color: #fff;
		font-weight: 600;
		margin-bottom: 20rpx;
	}

	.success-phone {
		font-size: 28rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.success-tip {
		font-size: 24rpx;
		color: #666;
	}

	.login-link {
		text-align: center;
	}

	.login-link text {
		font-size: 26rpx;
		color: #6BA3E0;
	}

	.note {
		padding: 0 30rpx;
		text-align: center;
	}

	.note text {
		font-size: 24rpx;
		color: #e74c3c;
	}

	.rules-section {
		padding: 30rpx;
	}

	.rules-header {
		margin-bottom: 20rpx;
	}

	.rules-title {
		font-size: 30rpx;
		color: #fff;
		font-weight: 600;
	}

	.rule-item {
		background-color: #1a2744;
		border-radius: 10rpx;
		padding: 20rpx;
		margin-bottom: 15rpx;
	}

	.rule-item .rule-title {
		display: block;
		font-size: 26rpx;
		color: #ffd700;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.rule-item .rule-content {
		font-size: 24rpx;
		color: #999;
		line-height: 1.6;
	}
</style>
