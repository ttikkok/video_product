<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">绑定账号</view>
			<view class="nav-placeholder"></view>
		</view>

		<view class="tabs">
			<view 
				:class="['tab-item', { active: activeTab === 0 }]" 
				@click="activeTab = 0"
			>
				<text>手机号码绑定</text>
				<view v-if="activeTab === 0" class="tab-indicator"></view>
			</view>
			<view 
				:class="['tab-item', { active: activeTab === 1 }]" 
				@click="activeTab = 1"
			>
				<text>用户名绑定</text>
				<view v-if="activeTab === 1" class="tab-indicator"></view>
			</view>
		</view>

		<view v-if="activeTab === 0" class="form-section">
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

			<view class="code-input-wrap">
				<input 
					v-model="code" 
					class="code-input" 
					type="number" 
					placeholder="请输入验证码"
					maxlength="6"
				/>
				<view 
					:class="['get-code-btn', { disabled: !phone || countdown > 0 }]" 
					@click="getCode"
				>
					<text>{{ countdown > 0 ? countdown + '秒' : '获取验证码' }}</text>
				</view>
			</view>

			<view 
				:class="['bind-btn', { disabled: !phone || !code }]" 
				@click="bindPhone"
			>
				<text>绑定手机号</text>
			</view>

			<view class="login-link" @click="goToLogin">
				<text>已有账号？直接登录</text>
			</view>
		</view>

		<view v-else class="form-section">
			<input 
				v-model="username" 
				class="form-input" 
				placeholder="请输入用户名"
			/>
			<input 
				v-model="password" 
				class="form-input" 
				type="password" 
				placeholder="请输入密码"
			/>
			<input 
				v-model="confirmPassword" 
				class="form-input" 
				type="password" 
				placeholder="请确认密码"
			/>

			<view 
				:class="['bind-btn', { disabled: !username || !password || !confirmPassword }]" 
				@click="bindUsername"
			>
				<text>绑定用户名</text>
			</view>

			<view class="login-link" @click="goToLogin">
				<text>已有账号？直接登录</text>
			</view>
		</view>

		<view class="note">
			<text>备注：如您不方便使用手机号码注册绑定，可选择用户名绑定</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 0,
				phone: '',
				code: '',
				countdown: 0,
				username: '',
				password: '',
				confirmPassword: ''
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			getCode() {
				if (!this.phone || this.phone.length !== 11) {
					uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
					return
				}
				if (this.countdown > 0) return

				this.countdown = 60
				uni.showToast({ title: '验证码已发送', icon: 'success' })

				const timer = setInterval(() => {
					this.countdown--
					if (this.countdown <= 0) {
						clearInterval(timer)
					}
				}, 1000)
			},
			bindPhone() {
				if (!this.phone || this.phone.length !== 11) {
					uni.showToast({ title: '请输入正确的手机号', icon: 'none' })
					return
				}
				if (!this.code || this.code.length !== 6) {
					uni.showToast({ title: '请输入6位验证码', icon: 'none' })
					return
				}

				uni.showLoading({ title: '绑定中...' })
				setTimeout(() => {
					uni.hideLoading()
					uni.setStorageSync('isBound', 'true')
					uni.showToast({ title: '绑定成功', icon: 'success' })
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}, 1000)
			},
			bindUsername() {
				if (!this.username) {
					uni.showToast({ title: '请输入用户名', icon: 'none' })
					return
				}
				if (!this.password || this.password.length < 6) {
					uni.showToast({ title: '密码至少6位', icon: 'none' })
					return
				}
				if (this.password !== this.confirmPassword) {
					uni.showToast({ title: '两次输入密码不一致', icon: 'none' })
					return
				}

				uni.showLoading({ title: '绑定中...' })
				setTimeout(() => {
					uni.hideLoading()
					uni.setStorageSync('isBound', 'true')
					uni.showToast({ title: '绑定成功', icon: 'success' })
					setTimeout(() => {
						uni.navigateBack()
					}, 1500)
				}, 1000)
			},
			goToLogin() {
				uni.navigateTo({
					url: '/pages/mine/login'
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

	.tabs {
		display: flex;
		background-color: #16213e;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.tab-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 0;
		position: relative;
	}

	.tab-item text {
		font-size: 28rpx;
		color: #999;
	}

	.tab-item.active text {
		color: #ffd700;
	}

	.tab-indicator {
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 80rpx;
		height: 4rpx;
		background-color: #ffd700;
		border-radius: 2rpx;
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

	.code-input-wrap {
		display: flex;
		gap: 20rpx;
		margin-bottom: 40rpx;
	}

	.code-input {
		flex: 1;
		height: 80rpx;
		line-height: 80rpx;
		background-color: #1a2744;
		border: 1rpx solid rgba(255, 255, 255, 0.1);
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #fff;
	}

	.code-input::placeholder {
		color: #888;
	}

	.get-code-btn {
		background-color: rgba(255, 215, 0, 0.2);
		padding: 16rpx 30rpx;
		border-radius: 10rpx;
	}

	.get-code-btn.disabled {
		background-color: rgba(255, 255, 255, 0.1);
	}

	.get-code-btn text {
		font-size: 26rpx;
		color: #ffd700;
	}

	.get-code-btn.disabled text {
		color: #666;
	}

	.form-input {
		height: 80rpx;
		line-height: 80rpx;
		background-color: #1a2744;
		border: 1rpx solid rgba(255, 255, 255, 0.1);
		border-radius: 10rpx;
		padding: 0 20rpx;
		font-size: 28rpx;
		color: #fff;
		margin-bottom: 25rpx;
	}

	.form-input::placeholder {
		color: #888;
	}

	.bind-btn {
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		padding: 16rpx;
		border-radius: 10rpx;
		text-align: center;
		margin-bottom: 30rpx;
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
</style>
