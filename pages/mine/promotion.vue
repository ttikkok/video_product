<template>
	<view class="page">
		<canvas canvas-id="promotionCanvas" class="promotion-canvas"></canvas>
		<view class="top-header">
			<u-status-bar bg-color="#ffffff"></u-status-bar>
			<view class="top-nav-view">
				<view class="nav-back" @click="goBack">
					<image src="../../static/images/back_black.png" mode="widthFix" class="back-icon" />
				</view>
				<view class="nav-title">推广中心</view>
				<view class="nav-right" @click="goToMyPromotion">
					<text class="right-text">我的推广</text>
				</view>
			</view>
		</view>

		<scroll-view scroll-y class="content-scroll">
			<view v-if="showSaveSuccess" class="save-success-modal" @click="closeModal">
				<view class="modal-content" @click.stop>
					<view class="modal-close" @click="closeModal">✕</view>
					<image v-if="generatedImagePath" :src="generatedImagePath" mode="widthFix" class="modal-image" />
				</view>
			</view>

			<view class="banner-section">
				<view class="banner-bg">
					<view class="banner-title">邀者有礼 荐者有份</view>
					<view class="banner-desc">邀请好友可获得更多观影次数和缓存量</view>
					<view class="banner-people">
						<view class="person person-left">👩</view>
						<view class="person person-right">👨</view>
					</view>
				</view>
			</view>

			<view class="invite-section">
				<view class="invite-card">
					<image :src="userAvatar" mode="aspectFill" class="invite-avatar" />
					<view class="invite-info">
						<text class="invite-label">推广码:</text>
						<text class="invite-code">{{ promotionalCode }}</text>
					</view>
					<view class="invite-link-wrap">
						<text class="invite-link-label">推广链接:</text>
						<text class="invite-link-text">{{ promotionalLink }}</text>
					</view>
					<view class="invite-tip">扫码即可邀请下载(邀请码自动上报，无需手动填写)</view>
				</view>
			</view>

			<view class="qr-section">
				<view class="qr-card">
					<view class="qr-frame">
						<image :src="qrCode" mode="aspectFit" class="qr-image" />
					</view>
					<view class="qr-link-wrap">
						<text class="qr-link-label">您的邀请链接为:</text>
						<text class="qr-link-text">{{ inviteLink }}</text>
					</view>
					<view class="qr-actions">
						<view class="action-btn action-save" @click="saveQrCode">
							<text>保存图片</text>
						</view>
						<view class="action-btn action-copy" @click="copyLink">
							<text>复制推广链接</text>
						</view>
					</view>
				</view>
			</view>

			<view class="stats-section">
				<view class="stat-item">
					<view class="stat-value">
						<text class="stat-number">{{ todayViews }}</text>
						<text class="stat-unit">/1</text>
					</view>
					<text class="stat-label">今日可观影次数</text>
				</view>
				<view class="stat-divider"></view>
				<view class="stat-item">
					<view class="stat-value">
						<text class="stat-number">{{ cacheCount }}</text>
					</view>
					<text class="stat-label">缓存影片数量</text>
				</view>
			</view>

			<view class="level-section">
				<view class="level-item level-current">
					<view class="level-icon">🏆</view>
					<text class="level-label">已推广{{ currentNum }}人</text>
				</view>
				<view class="level-progress">
					<text class="progress-text">还差 <text class="progress-highlight">{{ needMore }}</text> 人升级</text>
				</view>
				<view class="level-item level-next">
					<view class="level-icon">🥇</view>
					<text class="level-label">{{ nextLevel ? nextLevel.title : '下一档次' }}</text>
				</view>
			</view>

			<view class="level-desc">
				<text v-if="nextLevel">{{ nextLevel.content }}</text>
				<text v-else>推广好友可获得更多观影次数和缓存量</text>
			</view>

			<view class="plan-section">
				<view class="section-header">
					<text class="section-title">推廣計劃</text>
				</view>
				<view class="plan-desc">
					<text>规则说明: 推广给好友成功下载APP并打开或者注册时好友填写您的邀请码，可以永久增加每日观影次数和缓存数量，以及获得额外香蕉奖励。</text>
				</view>
				<view class="plan-table">
					<view class="table-header">
						<text class="th">等級</text>
						<text class="th">推廣人數</text>
						<text class="th">每日觀影</text>
						<text class="th">獎勵内容</text>
					</view>
					<view class="table-body">
						<view v-for="rule in rules" :key="rule.id" :class="['table-row', { active: currentNum >= rule.num }]">
							<text class="td">{{ rule.title }}</text>
							<text class="td">{{ rule.num }}人</text>
							<text class="td">{{ rule.days }}次</text>
							<text class="td">{{ rule.content }}</text>
						</view>
					</view>
				</view>
				<view class="plan-note">
					<text>推廣檔次贈送的緩存數、每日觀影次數等，可與其他功能贈送的次數疊加使用。</text>
				</view>
			</view>

			<view v-if="promotionRules.length > 0" class="rules-section">
				<!-- <view class="section-header">
					<text class="section-title">{{ rule.title }}</text>
				</view> -->
				<view v-for="rule in promotionRules" :key="rule.id" class="rule-item">
					<view class="rule-title">{{ rule.title }}</view>
					<view class="rule-content" v-html="rule.content"></view>
				</view>
			</view>

			<view class="task-section" @click="goToRecharge">
				<view class="task-left">
					<text class="task-title">充值VIP</text>
					<view class="task-desc">
						<text>1、充值VIP，可以獲得無限觀影次數、緩存數，以及保存圖片至手機相冊等諸多功能。</text>
						<text>2、綁定帳號，防止權限丟失。</text>
					</view>
				</view>
				<view class="task-arrow">›</view>
			</view>

			<view class="task-section" @click="goToTasks">
				<view class="task-left">
					<text class="task-title">完成任务</text>
					<view class="task-desc">
						<text>1、完成簽到任務，可獲得額外香蕉幣獎勵!</text>
						<text>2、香蕉幣可用於香蕉圈打賞或解鎖資源。</text>
					</view>
				</view>
				<view class="task-arrow">›</view>
			</view>

			<view class="promote-btn" @click="handlePromote">
				<text class="promote-text">立即推廣</text>
			</view>

			<view class="bottom-space"></view>
		</scroll-view>
	</view>
</template>

<script>
	import { UserApi_get_promotion_rules } from '../../api/home.js'

	export default {
		data() {
			return {
				userAvatar: '',
				inviteCode: 'C1VE2D',
				qrCode: '',
				inviteLink: 'https://hao09.tv/invite/C1VE2D',
				promotionalLink: '',
				promotionalCode: '',
				todayViews: 1,
				cacheCount: 0,
				showSaveSuccess: false,
				generatedImagePath: '',
				currentNum: 0,
				nextLevel: null,
				needMore: 0,
				rules: [],
				promotionRules: []
			}
		},
		onLoad() {
			this.loadUserInfo()
			this.loadPromotionData()
		},
		onReady() {
			this.generateQRCode()
		},
		methods: {
			loadUserInfo() {
				let userinfo = uni.getStorageSync('userinfo')
				if (userinfo) {
					try {
						let info = JSON.parse(userinfo)
						this.userAvatar = info.avatar || info.icon || ''
					} catch (e) {
						console.error('解析用户信息失败', e)
					}
				}
			},
			loadPromotionData() {
				UserApi_get_promotion_rules({}).then(res => {
					if (res && res.code === 1 && res.data) {
						let data = res.data
						this.currentNum = data.promotion_num.current_num || 0
						this.nextLevel = data.promotion_num.next_level || null
						this.needMore = data.promotion_num.need_more || 0
						this.rules = data.promotion_num.rules || []
						this.promotionRules = data.promotion_rules || []
						// 更新推广链接和推广码
						this.promotionalLink = data.promotional_link || ''
						this.promotionalCode = data.promotional_code || ''
						// 更新邀请链接和邀请码
						this.inviteLink = this.promotionalLink || this.inviteLink
						this.inviteCode = this.promotionalCode || this.inviteCode
					}
				}).catch(err => {
					console.error('获取推广规则失败', err)
				})
			},
			generateQRCode() {
				const encodedLink = encodeURIComponent(this.inviteLink)
				this.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodedLink}`
			},
			goBack() {
				uni.navigateBack()
			},
			goToMyPromotion() {
				uni.navigateTo({ url: '/pages/mine/myPromotion' })
			},
			saveQrCode() {
				if (!this.qrCode) {
					uni.showToast({ title: '二维码生成中', icon: 'loading' })
					return
				}
				uni.showLoading({ title: '生成图片中...' })
				uni.downloadFile({
					url: this.qrCode,
					success: (res) => {
						if (res.statusCode === 200) {
							this.generatePromotionImage(res.tempFilePath)
						} else {
							uni.hideLoading()
							uni.showToast({ title: '下载失败', icon: 'none' })
						}
					},
					fail: (err) => {
						uni.hideLoading()
						uni.showToast({ title: '下载失败', icon: 'none' })
					}
				})
			},
			generatePromotionImage(qrPath) {
				const ctx = uni.createCanvasContext('promotionCanvas')
				const width = 360
				const height = 480
				const radius = 15

				const gradient = ctx.createLinearGradient(0, 0, width, height)
				gradient.addColorStop(0, '#ff8a00')
				gradient.addColorStop(1, '#ff2d55')
				ctx.setFillStyle(gradient)
				ctx.beginPath()
				ctx.moveTo(radius, 0)
				ctx.lineTo(width - radius, 0)
				ctx.quadraticCurveTo(width, 0, width, radius)
				ctx.lineTo(width, height - radius)
				ctx.quadraticCurveTo(width, height, width - radius, height)
				ctx.lineTo(radius, height)
				ctx.quadraticCurveTo(0, height, 0, height - radius)
				ctx.lineTo(0, radius)
				ctx.quadraticCurveTo(0, 0, radius, 0)
				ctx.closePath()
				ctx.fill()

				ctx.setFillStyle('#ffffff')
				ctx.font = 'bold 22px sans-serif'
				ctx.setTextAlign('center')
				ctx.fillText('扫码下载好色先生TV', width / 2, 45)

				ctx.drawImage(qrPath, 55, 65, 250, 250)

				ctx.setFillStyle('#ffffff')
				ctx.font = '16px sans-serif'
				ctx.setTextAlign('center')
				ctx.fillText('我的邀请码:', width / 2, 345)

				ctx.setFillStyle('#ffffff')
				ctx.font = 'bold 28px sans-serif'
				ctx.fillText(this.inviteCode, width / 2, 380)

				ctx.setFillStyle('rgba(255, 255, 255, 0.8)')
				ctx.font = '14px sans-serif'
				ctx.setTextAlign('center')
				ctx.fillText('✓ 安全无毒 放心下载', width / 2, 420)

				ctx.setFillStyle('rgba(255, 255, 255, 0.6)')
				ctx.font = '12px sans-serif'
				ctx.fillText('邀请码自动上报，无需手动填写', width / 2, 445)

				ctx.setFillStyle('#ffd700')
				ctx.font = 'bold 18px sans-serif'
				ctx.fillText('好色先生TV', width / 2, 470)

				ctx.draw(false, () => {
					setTimeout(() => {
						uni.canvasToTempFilePath({
							canvasId: 'promotionCanvas',
							success: (res) => {
								this.saveImageToAlbum(res.tempFilePath)
							},
							fail: (err) => {
								uni.hideLoading()
								uni.showToast({ title: '生成失败', icon: 'none' })
							}
						})
					}, 300)
				})
			},
			saveImageToAlbum(filePath) {
				uni.hideLoading()
				this.generatedImagePath = filePath
				this.showSaveSuccess = true
				this.downloadImageH5(filePath)
			},
			downloadImageH5(filePath) {
				try {
					const link = document.createElement('a')
					link.href = filePath
					link.download = 'promotion_' + Date.now() + '.png'
					document.body.appendChild(link)
					link.click()
					document.body.removeChild(link)
					uni.showToast({ title: '图片已下载', icon: 'success' })
				} catch (e) {
					console.error('下载失败', e)
					uni.showToast({ title: '下载失败，请长按图片保存', icon: 'none' })
				}
			},
			closeModal() {
				this.showSaveSuccess = false
			},
			copyLink() {
				uni.setClipboardData({
					data: this.inviteLink,
					success: () => {
						uni.showToast({ title: '链接已复制', icon: 'success' })
					}
				})
			},
			goToRecharge() {
				uni.switchTab({ url: '/pages/vip/index' })
			},
			goToTasks() {
				uni.showToast({ title: '任务中心开发中', icon: 'none' })
			},
			handlePromote() {
				if (!this.promotionalLink) {
					uni.showToast({ title: '推广链接未获取', icon: 'none' })
					return
				}
				this.openExternalURL(this.promotionalLink)
			},
			openExternalURL(url) {
				if (!url) return
				// #ifdef APP-PLUS
				if (typeof plus !== 'undefined' && plus.runtime && plus.runtime.openURL) {
					plus.runtime.openURL(url)
					return
				}
				// #endif
				// #ifdef H5
				if (typeof window !== 'undefined' && window.open) {
					window.open(url, '_blank')
					return
				}
				// #endif
				// 其他平台（微信小程序等）
				uni.setClipboardData({
					data: url,
					success: () => {
						uni.showToast({ title: '链接已复制，请到浏览器打开', icon: 'none' })
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #f5f5f5;
		padding-top: 120rpx;
	}

	.promotion-canvas {
		position: fixed;
		top: -9999rpx;
		left: -9999rpx;
		width: 360px;
		height: 480px;
	}

	.save-success-modal {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.8);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 40rpx;
	}

	.modal-content {
		position: relative;
		width: 100%;
		max-width: 600rpx;
		border-radius: 16rpx;
		overflow: hidden;
	}

	.modal-close {
		position: absolute;
		top: 15rpx;
		right: 15rpx;
		width: 50rpx;
		height: 50rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		color: #fff;
		font-size: 28rpx;
		z-index: 10;
	}

	.modal-image {
		width: 100%;
	}

	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 30rpx 30rpx;
		background-color: #fff;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}

	.top-nav-view {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
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
		background-color: #fff;
	}

	.nav-back {
		width: 120rpx;
		display: flex;
		align-items: center;
		justify-content: left;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.nav-title {
		flex: 1;
		font-size: 32rpx;
		color: #333;
		font-weight: 600;
		text-align: center;
	}

	.nav-right {
		width: 120rpx;
		text-align: right;
	}

	.right-text {
		font-size: 26rpx;
		color: #ff6b6b;
	}

	.content-scroll {
		height: calc(100vh - 120rpx);
	}

	.banner-section {
		background: linear-gradient(135deg, #ff8a00 0%, #ff2d55 100%);
		padding: 40rpx 30rpx;
		position: relative;
		overflow: hidden;
	}

	.banner-bg {
		text-align: center;
	}

	.banner-title {
		font-size: 48rpx;
		font-weight: bold;
		color: #fff;
		text-shadow: 2rpx 2rpx 4rpx rgba(0, 0, 0, 0.3);
		
	}

	.banner-desc {
		font-size: 26rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-bottom: 20rpx;
	}

	.banner-people {
		position: absolute;
		top: 20rpx;
		left: 30rpx;
		right: 30rpx;
		display: flex;
		justify-content: space-between;
	}

	.person {
		font-size: 80rpx;
	}

	.person-left {
		transform: scaleX(-1);
	}

	.invite-section {
		padding: 0 30rpx;
		margin-top: -40rpx;
	}

	.invite-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
		position: relative;
		z-index: 10;
	}

	.invite-avatar {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		margin-bottom: 20rpx;
		border: 4rpx solid #ff8a00;
	}

	.invite-info {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.invite-label {
		font-size: 26rpx;
		color: #999;
		margin-right: 10rpx;
	}

	.invite-code {
		font-size: 36rpx;
		font-weight: bold;
		color: #ff6b6b;
		font-family: 'Courier New', monospace;
	}

	.invite-link-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-top: 10rpx;
		padding: 15rpx 20rpx;
		background-color: #f8f9fa;
		border-radius: 10rpx;
		width: 100%;
	}

	.invite-link-label {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 8rpx;
	}

	.invite-link-text {
		font-size: 26rpx;
		color: #333;
		word-break: break-all;
		text-align: center;
		line-height: 1.4;
	}

	.invite-tip {
		font-size: 22rpx;
		color: #999;
	}

	.qr-section {
		padding: 30rpx;
	}

	.qr-card {
		background: #fff;
		border-radius: 20rpx;
		padding: 40rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
	}

	.qr-frame {
		border: 4rpx solid #ff8a00;
		border-radius: 20rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
		position: relative;
	}

	.qr-image {
		width: 300rpx;
		height: 300rpx;
	}

	.qr-link-wrap {
		width: 100%;
		margin-bottom: 30rpx;
	}

	.qr-link-label {
		font-size: 22rpx;
		color: #999;
		display: block;
		margin-bottom: 8rpx;
	}

	.qr-link-text {
		font-size: 24rpx;
		color: #666;
		word-break: break-all;
		word-wrap: break-word;
		display: block;
		line-height: 1.5;
	}

	.qr-actions {
		display: flex;
		gap: 30rpx;
	}

	.action-btn {
		padding: 20rpx 40rpx;
		border-radius: 40rpx;
	}

	.action-save {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.action-save text {
		color: #fff;
		font-size: 26rpx;
	}

	.action-copy {
		background: linear-gradient(135deg, #ff6b6b 0%, #ffa07a 100%);
	}

	.action-copy text {
		color: #fff;
		font-size: 26rpx;
	}

	.stats-section {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #fff;
		margin: 0 30rpx;
		border-radius: 20rpx;
		padding: 40rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		flex: 1;
	}

	.stat-value {
		display: flex;
		align-items: baseline;
		margin-bottom: 10rpx;
	}

	.stat-number {
		font-size: 48rpx;
		font-weight: bold;
		color: #333;
	}

	.stat-unit {
		font-size: 28rpx;
		color: #999;
		margin-left: 5rpx;
	}

	.stat-label {
		font-size: 24rpx;
		color: #999;
	}

	.stat-divider {
		width: 2rpx;
		height: 60rpx;
		background: #eee;
	}

	.level-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		margin: 30rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.level-item {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.level-icon {
		font-size: 40rpx;
		margin-bottom: 10rpx;
	}

	.level-label {
		font-size: 24rpx;
		color: #666;
	}

	.level-progress {
		text-align: center;
	}

	.progress-text {
		font-size: 26rpx;
		color: #666;
	}

	.progress-highlight {
		color: #ff6b6b;
		font-weight: bold;
	}

	.level-desc {
		background: #fff;
		margin: 0 30rpx;
		padding: 20rpx 30rpx;
		border-radius: 0 0 20rpx 20rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.level-desc text {
		font-size: 24rpx;
		color: #999;
	}

	.plan-section {
		background: #fff;
		margin: 30rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.section-header {
		margin-bottom: 20rpx;
	}

	.section-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
	}

	.plan-desc {
		font-size: 24rpx;
		color: #666;
		line-height: 1.6;
		margin-bottom: 20rpx;
	}

	.plan-table {
		border-radius: 16rpx;
		overflow: hidden;
		border: none;
		box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
	}

	.table-header {
		display: flex;
		background: linear-gradient(135deg, #ff8a00 0%, #ff2d55 100%);
	}

	.th {
		flex: 1;
		padding: 28rpx 15rpx;
		text-align: center;
		font-size: 26rpx;
		color: #fff;
		font-weight: 600;
		border-right: 2rpx solid rgba(255, 255, 255, 0.2);

		&:last-child {
			border-right: none;
		}
	}

	.table-body {
		background: #fff;
	}

	.table-row {
		display: flex;
		border-bottom: 2rpx solid #f5f5f5;
		min-height: 120rpx;
		align-items: center;

		&:last-child {
			border-bottom: none;
		}

		&.active {
			background: linear-gradient(135deg, #fff8f0 0%, #fff0e6 100%);
		}

		&:active {
			background: #f9f9f9;
		}
	}

	.td {
		flex: 1;
		padding: 28rpx 15rpx;
		text-align: center;
		font-size: 26rpx;
		color: #333;
		border-right: 2rpx solid #f5f5f5;
		word-break: break-all;
		line-height: 1.5;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 100rpx;

		&:last-child {
			border-right: none;
		}
	}

	.plan-note {
		margin-top: 20rpx;
		padding: 20rpx;
		background: #fff8f0;
		border-radius: 10rpx;
	}

	.plan-note text {
		font-size: 22rpx;
		color: #ff8a00;
	}

	.rules-section {
		background: #fff;
		margin: 30rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.rule-item {
		margin-top: 20rpx;
		padding-top: 20rpx;
		border-top: 2rpx solid #f0f0f0;

		&:first-child {
			margin-top: 0;
			padding-top: 0;
			border-top: none;
		}
	}

	.rule-title {
		font-size: 28rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 15rpx;
	}

	.rule-content {
		font-size: 24rpx;
		color: #666;
		line-height: 1.8;
	}

	.task-section {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background: #fff;
		margin: 0 30rpx 20rpx;
		border-radius: 20rpx;
		padding: 30rpx;
		box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.05);
	}

	.task-left {
		flex: 1;
	}

	.task-title {
		font-size: 30rpx;
		font-weight: bold;
		color: #333;
		margin-bottom: 15rpx;
		display: block;
	}

	.task-desc {
		display: flex;
		flex-direction: column;
		gap: 5rpx;
	}

	.task-desc text {
		font-size: 24rpx;
		color: #999;
	}

	.task-arrow {
		font-size: 40rpx;
		color: #ccc;
	}

	.promote-btn {
		background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
		margin: 40rpx 30rpx;
		padding: 30rpx;
		border-radius: 40rpx;
		text-align: center;
		box-shadow: 0 8rpx 25rpx rgba(255, 140, 0, 0.4);
	}

	.promote-text {
		font-size: 32rpx;
		font-weight: bold;
		color: #fff;
	}

	.bottom-space {
		height: 60rpx;
	}
</style>