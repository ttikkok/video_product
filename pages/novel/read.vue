<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">
				<text class="title-text">{{ novelTitle }}</text>
			</view>
			<view class="nav-actions">
				<!-- <text class="action-icon">📚</text> -->
			</view>
		</view>

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
			</view>
		</view>

		<!-- 简介 -->
		<view class="novel-intro">
			<view class="intro-header" @click="toggleIntro">
				<text class="intro-title">简介</text>
				<text class="intro-toggle">{{ showFullIntro ? '收起' : '展开' }}</text>
			</view>
			<view :class="['intro-content', { expanded: showFullIntro }]">
				<text>{{ currentNovel.intro }}</text>
			</view>
		</view>

		<!-- 章节列表 -->
		<view class="chapter-section">
			<view class="section-header">
				<text class="section-title">目录</text>
				<text class="chapter-count">共{{ chapters.length }}章</text>
			</view>
			<scroll-view scroll-y class="chapter-list">
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
			</scroll-view>
		</view>

		<!-- 阅读内容弹窗 -->
		<view v-if="showContent" class="content-overlay" @click="closeContent">
			<view class="content-popup" @click.stop>
				<view class="popup-header">
					<text class="popup-title">第{{ currentChapter.number }}章</text>
					<text class="popup-subtitle">{{ currentChapter.title }}</text>
				</view>
				<scroll-view scroll-y class="popup-content">
					<text class="content-text">{{ currentChapter.content }}</text>
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
	export default {
		data() {
			return {
				novelTitle: '',
				novelId: null,
				showFullIntro: false,
				showContent: false,
				currentChapterIndex: 0,
				novels: [
					{
						id: 1,
						title: '极品尤物老师',
						author: '色即是空',
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20teacher%20portrait%20novel%20cover&image_size=portrait_4_3',
						tags: ['都市', '师生', '暧昧'],
						intro: '大四学生林峰在实习期间，遇到了自己高中时期的美女班主任萧雅，从此开启了不一样的人生。萧雅，一个集美貌与智慧于一身的女强人，在学校是学生们心中的女神。林峰本是抱着学习的态度去实习，却没想到会遇到自己的高中班主任。\n\n命运的齿轮就此转动，一场师生之间的禁忌之恋悄然萌芽。从最初的相遇到逐渐了解，从暗生情愫到表白心意，两人的关系在一次次的接触中悄然改变...',
						views: '125.6萬',
						chapters: 328,
						likes: '8562',
						isVip: true,
						isFinished: false,
						category: '都市'
					},
					{
						id: 2,
						title: '绝色老板娘',
						author: '寂寞高手',
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20business%20woman%20portrait%20novel%20cover&image_size=portrait_4_3',
						tags: ['都市', '职场', '情感'],
						intro: '普通的打工仔李明，无意间发现自己的老板娘竟然是自己的梦中情人，从此走上人生巅峰...',
						views: '98.3萬',
						chapters: 256,
						likes: '7234',
						isVip: true,
						isFinished: true,
						category: '都市'
					},
					{
						id: 3,
						title: '我的美女总裁',
						author: '冰火未融',
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20female%20CEO%20portrait%20novel%20cover&image_size=portrait_4_3',
						tags: ['都市', '总裁', '甜宠'],
						intro: '一纸婚约，将两个毫不相关的人绑在了一起，冷面女总裁与废物赘婿的爆笑日常...',
						views: '156.2萬',
						chapters: 412,
						likes: '12453',
						isVip: false,
						isFinished: false,
						category: '总裁'
					}
				],
				chapters: []
			}
		},
		computed: {
			currentNovel() {
				return this.novels.find(n => n.id === this.novelId) || this.novels[0]
			},
			currentChapter() {
				return this.chapters[this.currentChapterIndex] || {}
			}
		},
		onLoad(options) {
			if (options.id) {
				this.novelId = parseInt(options.id)
			}
			if (options.title) {
				this.novelTitle = decodeURIComponent(options.title)
			}
			this.generateChapters()
		},
		methods: {
			generateChapters() {
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
			toggleIntro() {
				this.showFullIntro = !this.showFullIntro
			},
			selectChapter(index) {
				this.currentChapterIndex = index
				uni.navigateTo({
					url: `/pages/novel/reader?novelId=${this.novelId}&chapterIndex=${index}`
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
		padding-bottom: 120rpx;
	}

	/* 顶部导航 */
	.top-nav {
		display: flex;
		align-items: center;
		background-color: #16213e;
		padding: 20rpx;
		gap: 20rpx;
	}

	.nav-back {
		width: 60rpx;
		height: 60rpx;
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
		text-align: center;
	}

	.title-text {
		font-size: 32rpx;
		color: #fff;
		font-weight: 500;
	}

	.nav-actions {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.action-icon {
		font-size: 32rpx;
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

	/* 简介 */
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

	.intro-toggle {
		font-size: 26rpx;
		color: #6BA3E0;
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

	.intro-content.expanded {
		display: block;
		overflow: visible;
		-webkit-line-clamp: unset;
	}

	/* 章节列表 */
	.chapter-section {
		background-color: #16213e;
		margin: 0 20rpx;
		border-radius: 12rpx;
		overflow: hidden;
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
		height: calc(100vh - 450rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 450rpx - env(safe-area-inset-bottom));
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

	/* 底部阅读栏 */
	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: #16213e;
		padding: 20rpx 30rpx;
		padding-bottom: calc(20rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		border-top: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.bar-item {
		display: flex;
		align-items: center;
		gap: 10rpx;
		padding: 15rpx 25rpx;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
	}

	.bar-icon {
		font-size: 28rpx;
		color: #fff;
	}

	.bar-text {
		font-size: 26rpx;
		color: #fff;
	}

	.bar-progress {
		flex: 1;
		text-align: center;
	}

	.progress-text {
		font-size: 26rpx;
		color: #999;
	}

	/* 阅读内容弹窗 */
	.content-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		z-index: 1000;
		display: flex;
		align-items: flex-end;
	}

	.content-popup {
		width: 100%;
		height: 85vh;
		background-color: #1a1a2e;
		border-radius: 30rpx 30rpx 0 0;
		display: flex;
		flex-direction: column;
	}

	.popup-header {
		padding: 30rpx;
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
	}

	.content-text {
		font-size: 30rpx;
		color: #ddd;
		line-height: 2;
		text-align: justify;
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
</style>
