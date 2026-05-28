<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">线路设置</view>
			<view class="nav-placeholder"></view>
		</view>

		<view class="line-list">
			<view 
				v-for="(line, index) in lines" 
				:key="index"
				:class="['line-item', { active: activeLine === index }]"
				@click="selectLine(index)"
			>
				<text class="line-name">{{ line.name }}</text>
				<text class="line-ping">{{ line.ping }}ms</text>
			</view>
		</view>

		<view class="tips">
			<text>如果遇到图片无法正常加载、视频无法正常播放</text>
			<text>请选择PING值最低的线路，更改后自动保存</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeLine: 0,
				lines: [
					{ name: '线路 re***04', ping: 355 },
					{ name: '线路 re***05', ping: 343 },
					{ name: '线路 gr***ch', ping: 248 },
					{ name: '线路 re***06', ping: 322 }
				]
			}
		},
		onLoad() {
			const savedIndex = uni.getStorageSync('selectedLineIndex')
			if (savedIndex !== '') {
				this.activeLine = parseInt(savedIndex)
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			selectLine(index) {
				this.activeLine = index
				uni.setStorageSync('selectedLineIndex', index.toString())
				uni.showToast({ title: '已切换线路', icon: 'success' })
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #fff;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
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

	.line-list {
		padding: 30rpx;
	}

	.line-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 30rpx;
		margin-bottom: 15rpx;
		border-radius: 10rpx;
		background-color: #f5f5f5;
		border: 2rpx solid transparent;
	}

	.line-item.active {
		border-color: #ff9800;
		background-color: #fff;
	}

	.line-name {
		font-size: 28rpx;
		color: #333;
	}

	.line-ping {
		font-size: 28rpx;
		color: #4caf50;
		font-weight: 600;
	}

	.tips {
		padding: 40rpx 30rpx;
		text-align: center;
	}

	.tips text {
		display: block;
		font-size: 24rpx;
		color: #999;
		line-height: 1.8;
	}
</style>
