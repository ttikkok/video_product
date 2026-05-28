<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">我的收藏</view>
			<view class="nav-edit" @click="toggleEdit">
				<text>{{ isEdit ? '完成' : '编辑' }}</text>
			</view>
		</view>

		<view v-if="favorites.length === 0" class="empty-state">
			<text class="empty-icon">⭐</text>
			<text class="empty-text">暂无收藏内容</text>
		</view>

		<scroll-view scroll-y v-else class="content-list">
			<view v-for="(item, index) in favorites" :key="index" class="content-item" @click="playVideo(item)">
				<view v-if="isEdit" class="item-checkbox" @click.stop="toggleSelect(index)">
					<text>{{ item.selected ? '✓' : '' }}</text>
				</view>
				<image :src="item.cover" mode="aspectFill" class="item-cover" />
				<view class="item-info">
					<text class="item-title">{{ item.title }}</text>
					<view class="item-tags">
						<text v-for="(tag, tagIndex) in item.tags" :key="tagIndex" class="item-tag">{{ tag }}</text>
					</view>
					<text class="item-duration">{{ item.duration }}</text>
				</view>
				<view class="item-delete" v-if="isEdit" @click.stop="deleteItem(index)">
					<text>🗑️</text>
				</view>
			</view>
		</scroll-view>

		<view v-if="isEdit && selectedCount > 0" class="bottom-bar">
			<view class="bar-info">
				<text>已选择 {{ selectedCount }} 项</text>
			</view>
			<view class="bar-delete" @click="deleteSelected">
				<text>删除</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isEdit: false,
				favorites: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20video%20cover&image_size=portrait_4_3',
						title: '高颜值美女私房写真',
						tags: ['HD', '超清'],
						duration: '06:32',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20fashion%20video%20cover&image_size=portrait_4_3',
						title: '性感模特内衣秀',
						tags: ['模特', '高清'],
						duration: '08:15',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20bedroom%20video%20cover&image_size=portrait_4_3',
						title: '美女主播热舞直播精选',
						tags: ['热舞', '直播'],
						duration: '00:35:20',
						selected: false
					}
				]
			}
		},
		computed: {
			selectedCount() {
				return this.favorites.filter(item => item.selected).length
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			toggleEdit() {
				this.isEdit = !this.isEdit
				if (!this.isEdit) {
					this.favorites.forEach(item => item.selected = false)
				}
			},
			toggleSelect(index) {
				this.favorites[index].selected = !this.favorites[index].selected
			},
			playVideo(item) {
				if (!this.isEdit) {
					uni.showToast({ title: item.title, icon: 'none' })
				}
			},
			deleteItem(index) {
				this.favorites.splice(index, 1)
			},
			deleteSelected() {
				this.favorites = this.favorites.filter(item => !item.selected)
				this.isEdit = false
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
		display: flex;
		flex-direction: column;
	}

	.top-nav {
		display: flex;
		align-items: center;
		padding: 30rpx 20rpx;
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

	.nav-edit {
		font-size: 28rpx;
		color: #6BA3E0;
	}

	.empty-state {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 0;
	}

	.empty-icon {
		font-size: 100rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}

	.content-list {
		flex: 1;
		padding: 20rpx;
		box-sizing: border-box;
	}

	.content-item {
		display: flex;
		align-items: center;
		background-color: #16213e;
		border-radius: 12rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.item-checkbox {
		width: 44rpx;
		height: 44rpx;
		border: 2rpx solid #666;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 20rpx;
	}

	.item-checkbox text {
		font-size: 24rpx;
		color: #ffd700;
	}

	.item-cover {
		width: 160rpx;
		height: 200rpx;
		border-radius: 10rpx;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.item-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.item-title {
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.item-tags {
		display: flex;
		gap: 10rpx;
		margin-bottom: 10rpx;
	}

	.item-tag {
		font-size: 20rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.15);
		padding: 4rpx 10rpx;
		border-radius: 4rpx;
	}

	.item-duration {
		font-size: 24rpx;
		color: #999;
	}

	.item-delete {
		font-size: 36rpx;
		margin-left: 15rpx;
	}

	.bottom-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		background-color: #16213e;
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.bar-info text {
		font-size: 26rpx;
		color: #999;
	}

	.bar-delete {
		background-color: #e74c3c;
		padding: 15rpx 40rpx;
		border-radius: 30rpx;
	}

	.bar-delete text {
		font-size: 28rpx;
		color: #fff;
		font-weight: 600;
	}
</style>
