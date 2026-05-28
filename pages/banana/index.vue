<template>
	<view class="page">
		<view class="content">
			<text class="title">香蕉圈</text>
			<text class="desc">这里是香蕉圈页面</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
		display: flex;
		align-items: center;
		justify-content: center;
		padding-bottom: 98rpx;
	}
	
	.content {
		text-align: center;
	}
	
	.title {
		display: block;
		font-size: 40rpx;
		color: #fff;
		font-weight: 600;
		margin-bottom: 20rpx;
	}
	
	.desc {
		font-size: 28rpx;
		color: #999;
	}
</style>