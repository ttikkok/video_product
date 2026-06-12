<template>
	<view class="page">
		<!-- 顶部导航 - 固定 -->
		<view class="top-header">
			<u-status-bar bg-color="#16213e"></u-status-bar>
			<view class="top-nav-view">
				<view class="nav-back" @click="goBack">
					<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
				</view>
				<view class="nav-title">
					<text class="title-text">{{ novelTitle }}</text>
				</view>
				<view class="nav-actions">
				</view>
			</view>
		</view>

		<!-- 内容区域 -->
		<scroll-view scroll-y class="content-scroll">
			<u-status-bar></u-status-bar>
			<!-- 小说信息 -->
			<view class="novel-header">
				<image :src="currentNovel.cover" mode="aspectFill" class="novel-cover" />
				<view class="novel-details">
					<text class="detail-title">{{ currentNovel.title }}</text>
					<text class="detail-author">作者：{{ currentNovel.author }}</text>
					<view class="detail-tags">
						<text v-for="(tag, index) in currentNovel.tags" :key="index" class="detail-tag">{{ tag }}</text>
					</view>
					<view class="detail-stats">
						<view class="detail-stat"><image src="../../static/images/look.png" mode="widthFix" class="stat-icon" />{{ currentNovel.views }}</view>
						<view class="detail-stat"><image src="../../static/images/shu.png" mode="widthFix" class="stat-icon" />{{ currentNovel.chapters }}章</view>
					</view>
					<view class="detail-actions">
						<view :class="['action-item', { active: isLiked }]" @click="toggleLike">
							<image :src="isLiked ? '../../static/images/goods_active.png' : '../../static/images/goods.png'" mode="widthFix" class="action-icon" />
							<text class="action-text">{{ likes }}</text>
						</view>
						<view :class="['action-item', { active: isCollected }]" @click="toggleCollect">
							<image :src="isCollected ? '../../static/images/collect_active.png' : '../../static/images/collect.png'" mode="widthFix" class="action-icon" />
							<text class="action-text">{{ isCollected ? '已收藏' : '收藏' }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 简介 - 固定三行省略 -->
			<view class="novel-intro">
				<view class="intro-header">
					<text class="intro-title">简介</text>
				</view>
				<view class="intro-content">
					<text>{{ currentNovel.intro }}</text>
				</view>
			</view>

			<!-- 章节列表 -->
			<view class="chapter-section">
				<view class="section-header">
					<text class="section-title">目录</text>
					<text class="chapter-count">共{{ chapters.length }}章</text>
				</view>
				<view v-if="!loading && chapters.length === 0" class="empty-state">
					<text class="empty-icon">📚</text>
					<text class="empty-text">暂无章节</text>
				</view>
				<view v-else class="chapter-list">
					<view 
						v-for="(chapter, index) in chapters" 
						:key="index"
						class="chapter-item"
						@click="selectChapter(index)"
					>
						<view class="chapter-info">
							<text class="chapter-number">第{{ chapter.number }}章</text>
							<text class="chapter-title">{{ chapter.title }}</text>
						</view>
						<view v-if="chapter.isVip" class="chapter-vip">VIP</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 阅读内容弹窗 -->
		<view v-if="showContent" class="content-overlay" @click="closeContent">
			<view class="content-popup" @click.stop>
				<view class="popup-header">
					<text class="popup-title">第{{ currentChapter && currentChapter.number || 1 }}章</text>
					<text class="popup-subtitle">{{ currentChapter && currentChapter.title || '' }}</text>
				</view>
				<scroll-view scroll-y class="popup-content" :scroll-top="scrollTop">
					<text class="content-text">{{ currentChapter && currentChapter.content || '' }}</text>
				</scroll-view>
				<view class="popup-bottom">
					<view class="popup-btn" @click="prevChapter">
						<text>◀ 上一章</text>
					</view>
					<view class="popup-btn" @click="closeContent">
						<text>关闭</text>
					</view>
					<view class="popup-btn primary" @click="nextChapter">
						<text>下一章 ▶</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { NovelApi_novel_chapter_list_search, NovelApi_novel_collect_add, NovelApi_novel_like_add, NovelApi_novel_details } from '@/api/home.js'
	export default {
		data() {
			return {
				novelTitle: '',
				novelId: null,
				currentChapterIndex: 0,
				showContent: false,
				scrollTop: 0,
				isLiked: false,
				isCollected: false,
				likes: 0,
				currentNovel: {
					id: 0,
					title: '',
					author: '',
					cover: '',
					tags: [],
					intro: '',
					views: '0',
					chapters: 0,
					likes: '0',
					isVip: false,
					isFinished: false,
					category: ''
				},
				chapters: [],
				loading: false
			}
		},
		computed: {
			currentChapter() {
				return this.chapters[this.currentChapterIndex] || {}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.novelId = parseInt(options.id)
				this.loadNovelDetail()
			}
			this.loadChapters()
		},
		methods: {
			loadNovelDetail() {
				uni.showLoading({
					title: '加载中...'
				})
				NovelApi_novel_details({ novel_id: this.novelId }).then(res => {
					uni.hideLoading()
					if (res && res.code === 1 && res.data) {
						const data = res.data
						this.novelTitle = data.title || ''
						this.currentNovel.id = data.id || 0
						this.currentNovel.title = data.title || ''
						this.currentNovel.author = data.author || ''
						this.currentNovel.cover = data.cover_image || ''
						this.currentNovel.tags = data.tags ? (Array.isArray(data.tags) ? data.tags.filter(t => t && t.trim()) : (typeof data.tags === 'string' ? data.tags.split(',').filter(t => t.trim()) : [])) : []
						this.currentNovel.intro = data.content || ''
						this.currentNovel.views = data.look_number ? (parseInt(data.look_number) >= 10000 ? (parseInt(data.look_number) / 10000).toFixed(1) + '萬' : data.look_number) : '0'
						this.currentNovel.likes = data.like_number || '0'
						this.likes = parseInt(this.currentNovel.likes) || 0
						this.currentNovel.isVip = data.is_vip === 1
						this.currentNovel.isFinished = data.is_finished === 1
						this.currentNovel.category = data.type_name || ''
						this.isLiked = data.is_like === 1
						this.isCollected = data.is_collect === 1
					}
				}).catch(err => {
					uni.hideLoading()
					console.error('加载小说详情失败:', err)
				})
			},
			loadChapters() {
				this.loading = true
				uni.showLoading({
					title: '加载中...'
				})
				NovelApi_novel_chapter_list_search({ novel_id: this.novelId }).then(res => {
					this.loading = false
					uni.hideLoading()
					if (res && res.code === 1 && res.data) {
						const list = Array.isArray(res.data) ? res.data : (res.data.rows || [])
						const chapterNumbers = {}
						this.chapters = list.map((item, index) => {
							let number = index + 1
							const match = item.title.match(/第(\d+)章/)
							if (match) {
								number = parseInt(match[1])
							}
							if (chapterNumbers[number]) {
								number = Object.keys(chapterNumbers).length + 1
							}
							chapterNumbers[number] = true
							return {
								id: item.id,
								number: number,
								title: item.title.replace(/第\d+章\s*/, '') || '章节',
								content: item.content || '',
								isVip: item.is_vip === 1
							}
						})
						this.currentNovel.chapters = this.chapters.length
					} else {
						this.generateMockChapters()
					}
				}).catch(err => {
					this.loading = false
					uni.hideLoading()
					console.error('加载章节失败:', err)
					this.generateMockChapters()
				})
			},
			generateMockChapters() {
				const chapterCount = this.currentNovel.chapters || 50
				const chapterTitles = [
					'命运的邂逅', '意外的相遇', '心动的瞬间', '暧昧的开始', '情感的升温',
					'甜蜜的约会', '意外的惊喜', '浪漫的晚餐', '深夜的对话', '难眠的夜晚',
					'真情的告白', '幸福的相拥', '热恋的日子', '甜蜜的时光', '难忘的记忆',
					'误会与争吵', '冷战的日子', '思念的煎熬', '和好的拥抱', '更加珍惜'
				]
				
				const baseContent = `林峰轻轻推开门，走进房间。\n\n"你来了。"萧雅的声音从窗边传来，她转过身，月光洒在她身上，显得格外美丽动人。\n\n"老师，我..."林峰有些紧张，不知道该说什么。\n\n萧雅走到他面前，抬起头看着他，眼神中充满了柔情。\n\n"傻瓜，都这个时候了，还叫我老师吗？"她轻声说道。\n\n林峰心跳加速，他鼓起勇气，伸出手握住了萧雅的手。\n\n"雅雅，我喜欢你。从很久以前就喜欢你了。"他的声音有些颤抖。\n\n萧雅微微一笑，靠在了他的怀里。\n\n"我知道，其实我也一直在等你这句话。"她的声音很轻很柔。\n\n两人相拥而立，月光洒在他们身上，见证着这一刻的美好。\n\n这一刻，所有的禁忌都被抛在脑后，只剩下两颗心紧紧相连。\n\n"以后不要再叫我老师了。"萧雅抬起头，看着林峰的眼睛说道。\n\n"那叫什么？"林峰问。\n\n萧雅脸颊微红，轻声说道："叫我的名字..."\n\n夜深了，两人的身影在月光下交织在一起，绘成一幅美好的画面。\n\n从这一天起，他们的关系发生了质的变化。不再是师生，而是恋人。\n\n虽然前路还有很多困难，但他们愿意一起面对，因为有彼此在身边，就是最大的幸福。\n\n萧雅靠在林峰怀里，轻声说道："谢谢你，愿意等我这么久。"\n\n"傻瓜，为了你，等多久都值得。"林峰低头亲吻了她的额头。\n\n月光如水，洒满了整个房间，照亮了他们幸福的笑容。\n\n这一夜，注定是一个难忘的夜晚...`

				this.chapters = []
				for (let i = 0; i < chapterCount; i++) {
					this.chapters.push({
						id: i + 1,
						number: i + 1,
						title: chapterTitles[i % chapterTitles.length] + (i >= chapterTitles.length ? `（续${Math.floor(i / chapterTitles.length) + 1}）` : ''),
						content: `第${i + 1}章 ${chapterTitles[i % chapterTitles.length]}\n\n${baseContent}\n\n（未完待续...）`,
						isVip: i >= 50
					})
				}
			},
			goBack() {
				uni.navigateBack()
			},
			selectChapter(index) {
				this.currentChapterIndex = index
				this.showContent = true
			},
			closeContent() {
				this.showContent = false
			},
			prevChapter() {
				if (this.currentChapterIndex > 0) {
					this.currentChapterIndex--
					this.scrollTop = 0
				} else {
					uni.showToast({ title: '已经是第一章', icon: 'none' })
				}
			},
			nextChapter() {
				if (this.currentChapterIndex < this.chapters.length - 1) {
					this.currentChapterIndex++
					this.scrollTop = 0
				} else {
					uni.showToast({ title: '已经是最后一章', icon: 'none' })
				}
			},
			toggleLike() {
				NovelApi_novel_like_add({ novel_id: this.novelId }).then(res => {
					if (res && res.code === 1) {
						this.isLiked = !this.isLiked
						this.likes += this.isLiked ? 1 : -1
						uni.showToast({ 
							title: this.isLiked ? '点赞成功' : '取消点赞', 
							icon: 'none' 
						})
					} else {
						uni.showToast({ title: '操作失败', icon: 'none' })
					}
				}).catch(err => {
					console.error('点赞失败:', err)
					uni.showToast({ title: '操作失败', icon: 'none' })
				})
			},
			toggleCollect() {
				NovelApi_novel_collect_add({ novel_id: this.novelId }).then(res => {
					if (res && res.code === 1) {
						this.isCollected = !this.isCollected
						uni.showToast({ 
							title: this.isCollected ? '收藏成功' : '取消收藏', 
							icon: 'none' 
						})
					} else {
						uni.showToast({ title: '操作失败', icon: 'none' })
					}
				}).catch(err => {
					console.error('收藏失败:', err)
					uni.showToast({ title: '操作失败', icon: 'none' })
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
	}

	/* 顶部导航 - 固定 */
	.top-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		padding: 30rpx 30rpx;
		background-color: #16213e;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}

	.top-nav-view {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.nav-title {
		font-size: 34rpx;
		font-weight: 600;
	}

	.title-text {
		font-size: 34rpx;
		color: #fff;
		font-weight: 600;
	}

	.nav-actions {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	/* 内容区域 */
	.content-scroll {
		height: 100vh;
		padding-top: 100rpx;
	}

	/* 小说信息 */
	.novel-header {
		display: flex;
		padding: 30rpx 20rpx;
		background-color: #16213e;
		margin-bottom: 20rpx;
	}

	.novel-cover {
		width: 180rpx;
		height: 240rpx;
		border-radius: 12rpx;
		flex-shrink: 0;
		margin-right: 25rpx;
	}

	.novel-details {
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.detail-title {
		font-size: 34rpx;
		color: #fff;
		font-weight: 600;
		margin-bottom: 10rpx;
	}

	.detail-author {
		font-size: 26rpx;
		color: #999;
		margin-bottom: 15rpx;
	}

	.detail-tags {
		display: flex;
		gap: 10rpx;
		flex-wrap: wrap;
		margin-bottom: 15rpx;
	}

	.detail-tag {
		font-size: 22rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.15);
		padding: 5rpx 15rpx;
		border-radius: 6rpx;
	}

	.detail-stats {
		display: flex;
		gap: 20rpx;
		flex-wrap: nowrap;
	}

	.detail-stat {
		font-size: 24rpx;
		color: #999;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}

	.detail-stat .stat-icon {
		width: 36rpx;
		height: 36rpx;
		margin-right: 8rpx;
		flex-shrink: 0;
	}

	.detail-actions {
		display: flex;
		gap: 30rpx;
		margin-top: 15rpx;
	}

	.action-item {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 10rpx 20rpx;
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 30rpx;
		transition: all 0.2s ease;
	}

	.action-item.active {
		background-color: rgba(107, 163, 224, 0.2);
	}

	.action-icon {
		width: 32rpx;
		height: 32rpx;
	}

	.action-text {
		font-size: 24rpx;
		color: #999;
	}

	.action-item.active .action-text {
		color: #6BA3E0;
	}

	/* 简介 - 固定三行省略 */
	.novel-intro {
		background-color: #16213e;
		margin: 0 20rpx 20rpx;
		border-radius: 12rpx;
		padding: 20rpx;
	}

	.intro-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 15rpx;
	}

	.intro-title {
		font-size: 30rpx;
		color: #fff;
		font-weight: 500;
	}

	.intro-content {
		font-size: 26rpx;
		color: #ccc;
		line-height: 1.8;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	/* 章节列表 */
	.chapter-section {
		background-color: #16213e;
		margin: 0 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
		margin-bottom: 30rpx;
	}

	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.section-title {
		font-size: 30rpx;
		color: #fff;
		font-weight: 500;
	}

	.chapter-count {
		font-size: 24rpx;
		color: #999;
	}

	.chapter-list {
	}

	.chapter-item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 28rpx 20rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.05);
		transition: background-color 0.2s ease;
	}

	.chapter-item:active {
		background-color: rgba(255, 255, 255, 0.05);
	}

	.chapter-info {
		display: flex;
		flex-direction: column;
		gap: 8rpx;
	}

	.chapter-number {
		font-size: 24rpx;
		color: #999;
	}

	.chapter-title {
		font-size: 28rpx;
		color: #fff;
	}

	.chapter-vip {
		font-size: 20rpx;
		color: #ffd700;
		background-color: rgba(255, 215, 0, 0.2);
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
	}

	/* 阅读内容弹窗 */
	.content-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.9);
		z-index: 1000;
		display: flex;
		align-items: flex-start;
		justify-content: center;
	}

	.content-popup {
		width: 100%;
		height: 100%;
		background-color: #1a1a2e;
		display: flex;
		flex-direction: column;
	}

	.popup-header {
		padding: 80rpx 30rpx 30rpx;
		text-align: center;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.popup-title {
		display: block;
		font-size: 34rpx;
		color: #fff;
		font-weight: 600;
		margin-bottom: 8rpx;
	}

	.popup-subtitle {
		display: block;
		font-size: 26rpx;
		color: #999;
	}

	.popup-content {
		flex: 1;
		padding: 30rpx;
		height: 0;
	}

	.content-text {
		font-size: 30rpx;
		color: #ddd;
		line-height: 2;
		text-align: justify;
		white-space: pre-wrap;
	}

	.popup-bottom {
		display: flex;
		gap: 15rpx;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.popup-btn {
		flex: 1;
		text-align: center;
		padding: 20rpx;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 12rpx;
		font-size: 26rpx;
		color: #fff;
	}

	.popup-btn.primary {
		background-color: #ffd700;
		color: #000;
	}

	.loading-overlay {
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 60rpx 0;
	}

	.loading-content {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 20rpx;
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
		to {
			transform: rotate(360deg);
		}
	}

	.loading-text {
		font-size: 28rpx;
		color: #999;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 80rpx 40rpx;
	}

	.empty-icon {
		font-size: 100rpx;
		margin-bottom: 20rpx;
	}

	.empty-text {
		font-size: 28rpx;
		color: #999;
	}
</style>