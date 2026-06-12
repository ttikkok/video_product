<template>
	<view class="page">
		<u-status-bar bg-color="#16213e"></u-status-bar>
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">线路设置</view>
			<view class="nav-action" @click="refreshLines">
				<text class="action-text">刷新</text>
			</view>
		</view>

		<view v-if="loading" class="loading-container">
			<view class="loading-content">
				<view class="loading-spinner"></view>
				<text class="loading-text">加载线路中...</text>
			</view>
		</view>

		<view v-else class="line-list">
			<view 
				v-for="line in lines" 
				:key="line.id"
				:class="['line-item', { active: currentLineId === line.id }]"
				@click="selectLine(line)"
			>
				<view class="line-main">
					<view class="line-icon">
						<image src="../../static/images/wangluo.png" mode="aspectFit"style="width: 60%;"></image>
						<!-- <text class="icon-text">{{ line.name.charAt(line.name.length - 1) }}</text> -->
					</view>
					<view class="line-info">
						<text class="line-name">{{ line.name }}</text>
						<text v-if="currentLineId === line.id" class="current-tag">当前线路</text>
					</view>
				</view>
				<view class="line-right">
					<view :class="['ping-badge', line.pingStatus]">
						<text v-if="line.pingStatus === 'loading'">测速中</text>
						<text v-else-if="line.pingStatus === 'error'">失败</text>
						<text v-else-if="line.ping">{{ line.ping }}ms</text>
						<text v-else>-</text>
					</view>
					<view class="check-icon">
						<view v-if="currentLineId === line.id" class="check-active">
							<text class="check-text">✓</text>
						</view>
						<view v-else class="check-inactive"></view>
					</view>
				</view>
			</view>
		</view>

		<view v-if="!loading && lines.length === 0" class="empty-state">
			<text class="empty-icon">🔌</text>
			<text class="empty-text">暂无可用线路</text>
		</view>

		<view v-if="!loading && lines.length > 0" class="bottom-area">
			<view class="current-info">
				<text class="info-label">当前线路：</text>
				<text class="info-value">{{ currentLine && currentLine.name || '未知' }}</text>
			</view>
			<view class="tips">
				<text>切换线路后需要重启应用生效</text>
			</view>
		</view>
	</view>
</template>

<script>
	import configService from "@/http/config.js";
	
	export default {
		data() {
			return {
				lines: [],
				currentLineId: '',
				loading: true,
				isTesting: false
			}
		},
		computed: {
			currentLine() {
				if (!this.lines || !this.lines.length) return null
				var that = this
				return this.lines.find(function(l) { return l.id === that.currentLineId })
			}
		},
		onLoad() {
			this.loadLines()
		},
		methods: {
			async loadLines() {
				this.loading = true
				try {
					const [err, res] = await uni.request({
						url: configService.baseApiOrg + 'DomainApi/advertise_list',
						method: 'GET',
						timeout: 10000
					})
					
					if (err || !res || res.statusCode !== 200) {
						console.error('获取线路列表失败:', err)
						this.lines = []
					} else {
						const data = res.data
						if (data && data.code === 1 && data.data && Array.isArray(data.data)) {
							this.lines = data.data.map(line => ({
								id: String(line.id),
								name: line.name || '未命名线路',
								domain: line.domain || '',
								ping: '--',
								pingStatus: 'idle'
							}))
							configService.setLines(this.lines)
						} else {
							this.lines = []
						}
					}
					
					const currentLine = configService.getCurrentLine()
					this.currentLineId = currentLine.id
					
					this.testAllLines()
				} catch (e) {
					console.error('加载线路异常:', e)
					this.lines = []
				} finally {
					this.loading = false
				}
			},
			async refreshLines() {
				uni.showToast({ title: '刷新中...', icon: 'loading', duration: 1000 })
				this.loadLines()
			},
			selectLine(line) {
				if (this.currentLineId === line.id) return
				configService.setCurrentLine(line.id)
				this.currentLineId = line.id
				uni.showToast({ title: '已切换线路', icon: 'success' })
			},
			async testAllLines() {
				if (this.isTesting) return
				this.isTesting = true
				
				for (let i = 0; i < this.lines.length; i++) {
					this.lines[i].pingStatus = 'loading'
					await this.testPing(this.lines[i])
				}
				
				this.isTesting = false
			},
			async testPing(line) {
				const startTime = Date.now()
				try {
					const testUrl = line.domain.replace(/\/$/, '') + '/api/Index/channel'
					const [err, res] = await uni.request({
						url: testUrl,
						method: 'GET',
						timeout: 5000
					})
					const ping = Date.now() - startTime
					if (err || (res && res.statusCode !== 200)) {
						line.ping = '--'
						line.pingStatus = 'error'
					} else {
						line.ping = ping
						line.pingStatus = 'success'
					}
				} catch (e) {
					line.ping = '--'
					line.pingStatus = 'error'
				}
			},
			goBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	.top-nav {
		position: fixed;
		top: var(--status-bar-height, 44px);
		left: 0;
		right: 0;
		z-index: 100;
		display: flex;
		align-items: center;
		padding: 30rpx;
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

	.nav-action {
		width: 80rpx;
		text-align: right;
	}

	.action-text {
		font-size: 26rpx;
		color: #ffd700;
	}

	.loading-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding-top: calc(120rpx + constant(safe-area-inset-top));
		padding-top: calc(120rpx + env(safe-area-inset-top));
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.loading-spinner {
		width: 60rpx;
		height: 60rpx;
		border: 4rpx solid rgba(255, 255, 255, 0.2);
		border-top-color: #ffd700;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		to { transform: rotate(360deg); }
	}

	.loading-text {
		margin-top: 20rpx;
		font-size: 26rpx;
		color: #888;
	}

	.line-list {
		padding: 30rpx;
		padding-top: calc(140rpx + constant(safe-area-inset-top));
		padding-top: calc(140rpx + env(safe-area-inset-top));
		padding-bottom: 180rpx;
	}

	.line-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 30rpx;
		margin-bottom: 20rpx;
		border-radius: 16rpx;
		background: linear-gradient(145deg, #1e2842, #16213e);
		border: 2rpx solid transparent;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.3);
		transition: all 0.3s ease;
	}

	.line-item.active {
		border-color: #ffd700;
		background: linear-gradient(145deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
	}

	.line-main {
		display: flex;
		align-items: center;
		flex: 1;
	}

	.line-icon {
		width: 70rpx;
		height: 70rpx;
		border-radius: 14rpx;
		background: linear-gradient(135deg, #ffd700, #ffaa00);
		display: flex;
		align-items: center;
		justify-content: center;
		margin-right: 24rpx;
	}

	.icon-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #1a1a2e;
	}

	.line-info {
		display: flex;
		flex-direction: column;
	}

	.line-name {
		font-size: 30rpx;
		color: #fff;
		font-weight: 500;
	}

	.current-tag {
		font-size: 20rpx;
		color: #ffd700;
		margin-top: 4rpx;
	}

	.line-right {
		display: flex;
		align-items: center;
	}

	.ping-badge {
		padding: 8rpx 18rpx;
		border-radius: 20rpx;
		font-size: 22rpx;
		margin-right: 20rpx;
		
		&.loading {
			background-color: rgba(255, 215, 0, 0.2);
			color: #ffd700;
		}
		
		&.success {
			background-color: rgba(0, 255, 0, 0.2);
			color: #0f0;
		}
		
		&.error {
			background-color: rgba(255, 0, 0, 0.2);
			color: #f00;
		}
		
		&.idle {
			background-color: rgba(255, 255, 255, 0.1);
			color: #888;
		}
	}

	.check-icon {
		width: 44rpx;
		height: 44rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.check-active {
		width: 44rpx;
		height: 44rpx;
		border-radius: 50%;
		background: linear-gradient(135deg, #ffd700, #ffaa00);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.check-text {
		font-size: 24rpx;
		color: #1a1a2e;
		font-weight: bold;
	}

	.check-inactive {
		width: 40rpx;
		height: 40rpx;
		border-radius: 50%;
		border: 2rpx solid #444;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		padding-top: calc(120rpx + constant(safe-area-inset-top));
		padding-top: calc(120rpx + env(safe-area-inset-top));
	}

	.empty-icon {
		font-size: 100rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #888;
	}

	.bottom-area {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 30rpx;
		padding-bottom: calc(30rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
		background: linear-gradient(transparent, #1a1a2e 20%);
	}

	.current-info {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 20rpx;
		background-color: rgba(255, 215, 0, 0.1);
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.info-label {
		font-size: 26rpx;
		color: #888;
	}

	.info-value {
		font-size: 26rpx;
		color: #ffd700;
		font-weight: 500;
		margin-left: 8rpx;
	}

	.tips {
		text-align: center;
	}

	.tips text {
		font-size: 24rpx;
		color: #666;
	}
</style>
