<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">登录</view>
			<view class="nav-placeholder"></view>
		</view>

		<view class="form-section">
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

			<view class="password-input-wrap">
				<input 
					v-model="password" 
					class="password-input" 
					:type="showPassword ? 'text' : 'password'" 
					placeholder="请输入密码"
				/>
				<view class="password-toggle" @click="showPassword = !showPassword">
					<text>{{ showPassword ? '●●●' : '👁' }}</text>
				</view>
			</view>

			<!-- <view class="remember-wrap">
				<view 
					:class="['remember-checkbox', { checked: rememberPassword }]" 
					@click="rememberPassword = !rememberPassword"
				>
					<text v-if="rememberPassword">✓</text>
				</view>
				<text class="remember-text">记住密码</text>
			</view> -->

			<view 
				:class="['login-btn', { disabled: !phone || !password }]" 
				@click="login"
			>
				<text>登录</text>
			</view>

			<!-- <view class="links">
				<view class="link-item" @click="goToForgot">
					<text>忘记密码</text>
				</view>
				<view class="link-item" @click="goToRegister">
					<text>注册账号</text>
				</view>
			</view>

			<view class="note">
				<text>备注：如您不方便使用手机号码注册绑定，可选择用户名绑定</text>
			</view> -->
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				phone: '',
				password: '',
				showPassword: false,
				rememberPassword: false
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			login() {
				if (!this.phone || this.phone.length !== 11) {
					uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
					return
				}
				if (!this.password || this.password.length < 6) {
					uni.showToast({ title: '密码至少6位', icon: 'none' })
					return
				}

				uni.showLoading({ title: '登录中...' })
				setTimeout(() => {
					uni.hideLoading()
					uni.setStorageSync('isLogin', 'true')
					uni.showToast({ title: '登录成功', icon: 'success' })
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}, 1000)
			},
			goToForgot() {
				uni.showToast({ title: '忘记密码功能开发中', icon: 'none' })
			},
			goToRegister() {
				uni.navigateTo({
					url: '/pages/mine/bindAccount'
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
		margin-bottom: 25rpx;
	}

	.country-code {
		padding: 0 20rpx 0 0;
		height: 80rpx;
		line-height: 80rpx;
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

	.password-input-wrap {
		display: flex;
		align-items: center;
		background-color: #1a2744;
		border: 1rpx solid rgba(255, 255, 255, 0.1);
		border-radius: 10rpx;
		padding: 0 20rpx;
		margin-bottom: 25rpx;
		height: 80rpx;
	}

	.password-input {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #fff;
		background: transparent;
		border: none;
		outline: none;
	}

	.password-input::placeholder {
		color: #666;
	}

	.password-toggle {
		padding: 0 10rpx;
		height: 80rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.password-toggle text {
		font-size: 32rpx;
		color: #999;
	}

	.remember-wrap {
		display: flex;
		align-items: center;
		margin-bottom: 40rpx;
	}

	.remember-checkbox {
		width: 40rpx;
		height: 40rpx;
		border: 2rpx solid #666;
		border-radius: 6rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 15rpx;
	}

	.remember-checkbox.checked {
		background-color: #ffd700;
		border-color: #ffd700;
	}

	.remember-checkbox text {
		font-size: 24rpx;
		color: #16213e;
		font-weight: bold;
	}

	.remember-text {
		font-size: 26rpx;
		color: #999;
	}

	.login-btn {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 16rpx 28rpx;
		border-radius: 10rpx;
		text-align: center;
		margin-bottom: 30rpx;
	}

	.login-btn.disabled {
		background: rgba(255, 255, 255, 0.1);
	}

	.login-btn text {
		font-size: 30rpx;
		color: #16213e;
		font-weight: 600;
	}

	.login-btn.disabled text {
		color: #666;
	}

	.links {
		display: flex;
		justify-content: space-between;
		margin-bottom: 40rpx;
	}

	.link-item text {
		font-size: 26rpx;
		color: #ffd700;
	}

	.note {
		text-align: center;
	}

	.note text {
		font-size: 22rpx;
		color: #ff4444;
	}
</style>