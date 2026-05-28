<template>
	<view class="page">
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">下载管理</view>
			<view class="nav-edit" @click="toggleEdit">
				<text>{{ isEdit ? '完成' : '编辑' }}</text>
			</view>
		</view>

		<view class="download-stats">
			<view class="stat-item">
				<text class="stat-value">{{ downloadingList.length }}</text>
				<text class="stat-label">下载中</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ completedList.length }}</text>
				<text class="stat-label">已完成</text>
			</view>
			<view class="stat-item">
				<text class="stat-value">{{ totalSize }}</text>
				<text class="stat-label">总大小</text>
			</view>
		</view>

		<view v-if="downloads.length === 0" class="empty-state">
			<text class="empty-icon">📥</text>
			<text class="empty-text">暂无下载内容</text>
		</view>

		<scroll-view scroll-y v-else class="download-list">
			<view v-for="(item, index) in downloads" :key="index" class="download-item" @click="playVideo(item)">
				<view v-if="isEdit" class="item-checkbox" @click.stop="toggleSelect(index)">
					<text>{{ item.selected ? '✓' : '' }}</text>
				</view>
				<image :src="item.cover" mode="aspectFill" class="item-cover" />
				<view class="item-info">
					<text class="item-title">{{ item.title }}</text>
					<view class="item-progress" v-if="item.status === 'downloading'">
						<view class="progress-bar">
							<view class="progress-fill" :style="{ width: item.progress + '%' }"></view>
						</view>
						<text class="progress-text">{{ item.progress }}%</text>
					</view>
					<text class="item-size" v-else>{{ item.size }}</text>
					<text class="item-status" :class="item.status">{{ item.statusText }}</text>
				</view>
				<view class="item-actions">
					<view v-if="item.status === 'downloading'" class="action-btn pause" @click.stop="pauseDownload(index)">
						<text>⏸</text>
					</view>
					<view v-if="item.status === 'paused'" class="action-btn resume" @click.stop="resumeDownload(index)">
						<text>▶</text>
					</view>
					<view v-if="isEdit" class="action-btn delete" @click.stop="deleteItem(index)">
						<text>🗑️</text>
					</view>
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
				downloads: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20video%20cover&image_size=portrait_4_3',
						title: '高颜值美女私房写真',
						progress: 75,
						size: '256MB',
						status: 'downloading',
						statusText: '下载中',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20fashion%20video%20cover&image_size=portrait_4_3',
						title: '性感模特内衣秀',
						progress: 45,
						size: '189MB',
						status: 'downloading',
						statusText: '下载中',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20bedroom%20video%20cover&image_size=portrait_4_3',
						title: '美女主播热舞直播精选',
						progress: 0,
						size: '1.2GB',
						status: 'paused',
						statusText: '已暂停',
						selected: false
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20asian%20woman%20portrait%20soft%20lighting&image_size=portrait_4_3',
						title: '【秦雄全国探花】大神回复',
						progress: 100,
						size: '856MB',
						status: 'completed',
						statusText: '已完成',
						selected: false
					}
				]
			}
		},
		computed: {
			downloadingList() {
				return this.downloads.filter(item => item.status === 'downloading')
			},
			completedList() {
				return this.downloads.filter(item => item.status === 'completed')
			},
			totalSize() {
				const total = this.downloads.reduce((sum, item) => {
					const size = parseFloat(item.size)
					return sum + (isNaN(size) ? 0 : size)
				}, 0)
				return total.toFixed(1) + 'GB'
			},
			selectedCount() {
				return this.downloads.filter(item => item.selected).length
			}
		},
		methods: {
			goBack() {
				uni.navigateBack()
			},
			toggleEdit() {
				this.isEdit = !this.isEdit
				if (!this.isEdit) {
					this.downloads.forEach(item => item.selected = false)
				}
			},
			toggleSelect(index) {
				this.downloads[index].selected = !this.downloads[index].selected
			},
			playVideo(item) {
				if (!this.isEdit && item.status === 'completed') {
					uni.showToast({ title: item.title, icon: 'none' })
				}
			},
			pauseDownload(index) {
				this.downloads[index].status = 'paused'
				this.downloads[index].statusText = '已暂停'
			},
			resumeDownload(index) {
				this.downloads[index].status = 'downloading'
				this.downloads[index].statusText = '下载中'
			},
			deleteItem(index) {
				this.downloads.splice(index, 1)
			},
			deleteSelected() {
				this.downloads = this.downloads.filter(item => !item.selected)
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

	.download-stats {
		display: flex;
		background-color: #16213e;
		padding: 30rpx 20rpx;
		margin-bottom: 20rpx;
	}

	.stat-item {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
	}

	.stat-value {
		font-size: 36rpx;
		color: #ffd700;
		font-weight: bold;
	}

	.stat-label {
		font-size: 24rpx;
		color: #999;
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

	.download-list {
		flex: 1;
		padding: 0 20rpx;
		box-sizing: border-box;
	}

	.download-item {
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
		width: 120rpx;
		height: 150rpx;
		border-radius: 8rpx;
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
		font-size: 26rpx;
		color: #fff;
		font-weight: 500;
		margin-bottom: 8rpx;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.item-progress {
		display: flex;
		align-items: center;
		gap: 15rpx;
		margin-bottom: 8rpx;
	}

	.progress-bar {
		flex: 1;
		height: 8rpx;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 4rpx;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background: linear-gradient(90deg, #ffd700 0%, #ff8c00 100%);
		border-radius: 4rpx;
	}

	.progress-text {
		font-size: 22rpx;
		color: #ffd700;
		min-width: 60rpx;
	}

	.item-size {
		font-size: 22rpx;
		color: #999;
		margin-bottom: 8rpx;
	}

	.item-status {
		font-size: 22rpx;
	}

	.item-status.downloading {
		color: #ffd700;
	}

	.item-status.paused {
		color: #999;
	}

	.item-status.completed {
		color: #2ecc71;
	}

	.item-actions {
		display: flex;
		gap: 15rpx;
	}

	.action-btn {
		width: 60rpx;
		height: 60rpx;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.action-btn.pause {
		background-color: rgba(255, 215, 0, 0.2);
	}

	.action-btn.resume {
		background-color: rgba(46, 204, 113, 0.2);
	}

	.action-btn.delete {
		background-color: rgba(231, 76, 60, 0.2);
	}

	.action-btn text {
		font-size: 28rpx;
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
