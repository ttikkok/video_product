<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">观看历史</view>
			<view class="nav-edit" @click="toggleEdit">
				<text>{{ isEdit ? '完成' : '编辑' }}</text>
			</view>
		</view>

		<view class="time-filter">
			<view 
				v-for="(filter, index) in filters" 
				:key="index"
				:class="['filter-item', { active: activeFilter === index }]"
				@click="switchFilter(index)"
			>
				{{ filter }}
			</view>
		</view>

		<view v-if="history.length === 0" class="empty-state">
			<text class="empty-icon">📺</text>
			<text class="empty-text">暂无观看历史</text>
		</view>

		<scroll-view scroll-y v-else class="content-list">
			<view v-for="(item, index) in filteredHistory" :key="index" class="content-item" @click="playVideo(item)">
				<view v-if="isEdit" class="item-checkbox" @click.stop="toggleSelect(index)">
					<text>{{ item.selected ? '✓' : '' }}</text>
				</view>
				<view class="item-cover-wrap">
					<image :src="item.cover" mode="aspectFill" class="item-cover" />
					<view class="item-progress" v-if="item.progress > 0">
						<view class="progress-bar" :style="{ width: item.progress + '%' }"></view>
					</view>
					<text class="item-duration">{{ item.duration }}</text>
				</view>
				<view class="item-info">
					<text class="item-title">{{ item.title }}</text>
					<text class="item-time">{{ item.watchTime }}</text>
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
				activeFilter: 0,
				filters: ['全部', '今天', '昨天', '本周'],
				history: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20video%20cover&image_size=portrait_4_3',
						title: '高颜值美女私房写真',
						duration: '06:32',
						progress: 80,
						watchTime: '10分钟前',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20fashion%20video%20cover&image_size=portrait_4_3',
						title: '性感模特内衣秀',
						duration: '08:15',
						progress: 45,
						watchTime: '30分钟前',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20bedroom%20video%20cover&image_size=portrait_4_3',
						title: '美女主播热舞直播精选',
						duration: '00:35:20',
						progress: 100,
						watchTime: '昨天',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20asian%20woman%20portrait%20soft%20lighting&image_size=portrait_4_3',
						title: '【秦雄全国探花】大神回复',
						duration: '01:33:36',
						progress: 20,
						watchTime: '昨天',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=couple%20sofa%20intimate%20video%20cover&image_size=portrait_4_3',
						title: '素人打野精彩片段',
						duration: '01:16:05',
						progress: 0,
						watchTime: '本周',
						selected: false
					}
				]
			}
		},
		computed: {
			filteredHistory() {
				if (this.activeFilter === 0) return this.history
				const now = new Date()
				return this.history.filter(item => {
					if (this.activeFilter === 1) return item.watchTime.includes('分钟')
					if (this.activeFilter === 2) return item.watchTime === '昨天'
					if (this.activeFilter === 3) return item.watchTime === '本周'
					return true
				})
			},
			selectedCount() {
				return this.filteredHistory.filter(item => item.selected).length
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			switchFilter(index) {
				this.activeFilter = index
			},
			toggleEdit() {
				this.isEdit = !this.isEdit
				if (!this.isEdit) {
					this.filteredHistory.forEach(item => item.selected = false)
				}
			},
			toggleSelect(index) {
				this.filteredHistory[index].selected = !this.filteredHistory[index].selected
			},
			playVideo(item) {
				if (!this.isEdit) {
					uni.showToast({ title: item.title, icon: 'none' })
				}
			},
			deleteSelected() {
				this.history = this.history.filter(item => !item.selected)
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

	.time-filter {
		display: flex;
		gap: 20rpx;
		padding: 20rpx;
		background-color: #16213e;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.filter-item {
		font-size: 26rpx;
		color: #999;
		padding: 10rpx 20rpx;
		border-radius: 20rpx;
		background-color: rgba(255, 255, 255, 0.1);
	}

	.filter-item.active {
		color: #ffd700;
		background-color: rgba(255, 215, 0, 0.2);
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

	.item-cover-wrap {
		position: relative;
		width: 160rpx;
		height: 200rpx;
		border-radius: 10rpx;
		overflow: hidden;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.item-cover {
		width: 100%;
		height: 100%;
	}

	.item-progress {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 6rpx;
		background-color: rgba(0, 0, 0, 0.5);
	}

	.progress-bar {
		height: 100%;
		background-color: #ffd700;
	}

	.item-duration {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		font-size: 20rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 3rpx 8rpx;
		border-radius: 4rpx;
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

	.item-time {
		font-size: 24rpx;
		color: #999;
	}

	.bottom-bar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 30rpx;
		background-color: #16213e;
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
		position: fixed;
    width: 100%;
    left: 0;
    bottom: 0;
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
