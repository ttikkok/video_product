<template>
	<view class="page">
		<!-- 顶部导航 -->
		<view class="top-nav">
			<view class="nav-back" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="nav-title">
				<text class="title-text">{{ currentChapter.title }}</text>
			</view>
			<view class="nav-placeholder"></view>
		</view>

		<!-- 章节信息 -->
		<view class="chapter-info">
			<text class="chapter-number">第{{ currentChapter.number }}章</text>
		</view>

		<!-- 阅读内容 -->
		<scroll-view 
			scroll-y 
			class="content-area"
			@scrolltolower="onScrollToLower"
		>
			<view class="content-container">
				<text class="content-text">{{ currentChapter.content }}</text>
			</view>
		</scroll-view>

		<!-- 底部导航栏 -->
		<view class="bottom-bar">
			<view class="bar-btn prev" :class="{ disabled: !hasPrevChapter }" @click="prevChapter">
				<text class="btn-icon">◀</text>
				<text class="btn-text">上一章</text>
			</view>
			<view class="bar-center">
				<text class="progress-text">{{ currentIndex + 1 }} / {{ chapters.length }}</text>
				<view class="progress-bar">
					<view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
				</view>
			</view>
			<view class="bar-btn next" :class="{ disabled: !hasNextChapter }" @click="nextChapter">
				<text class="btn-text">下一章</text>
				<text class="btn-icon">▶</text>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				novelId: null,
				currentIndex: 0,
				chapters: [],
				currentChapter: {}
			}
		},
		computed: {
			hasPrevChapter() {
				return this.currentIndex > 0;
			},
			hasNextChapter() {
				return this.currentIndex < this.chapters.length - 1;
			},
			progressPercent() {
				return ((this.currentIndex + 1) / this.chapters.length) * 100;
			}
		},
		onLoad(options) {
			this.novelId = options.novelId;
			this.currentIndex = parseInt(options.chapterIndex) || 0;
			this.loadNovel();
		},
		methods: {
			goBack() {
				uni.navigateBack();
			},
			loadNovel() {
				const novelData = this.getNovelData(this.novelId);
				this.chapters = novelData.chapters;
				this.currentChapter = this.chapters[this.currentIndex];
			},
			getNovelData(id) {
				return {
					chapters: [
						{
							number: 1,
							title: '初遇美女老师',
							content: '九月的阳光透过窗户洒进教室，大四学生林峰坐在靠窗的位置，手里拿着实习报告，心中有些紧张。\n\n这是他第一次来到市第一中学实习，作为一名师范专业的学生，能够进入这所全市最好的中学实习，对他来说是莫大的荣幸。\n\n"大家安静一下，我来介绍一下，这位是林峰同学，从今天开始将在我们班实习。"班主任王老师站在讲台上说道。\n\n林峰站起身来，向同学们微微鞠躬："大家好，我叫林峰，希望在接下来的时间里能够和大家好好相处。"\n\n就在这时，教室门口传来一阵脚步声，一个穿着职业套装的美女走了进来。她大约二十五六岁的样子，身材高挑，面容姣好，气质优雅。\n\n"萧老师，你来了。"王老师笑着打招呼。\n\n林峰的目光瞬间被吸引住了，这个女人太美了，简直就像是从画里走出来的一样。\n\n"这位是我们班的实习老师林峰，这位是萧雅老师，我们班的数学老师。"王老师介绍道。\n\n萧雅看向林峰，微微一笑："你好，我是萧雅。"\n\n"你...你好..."林峰有些结巴地说道，心跳不由自主地加速了。\n\n他感觉这个女人有些眼熟，但一时又想不起来在哪里见过。\n\n"林老师，以后有什么不懂的可以问萧老师，她可是我们学校的优秀教师。"王老师说道。\n\n"谢谢王老师，我会的。"林峰说道，目光却一直停留在萧雅身上。\n\n萧雅似乎察觉到了他的目光，微微皱了皱眉，但并没有说什么。\n\n接下来的日子里，林峰渐渐熟悉了学校的环境，也和萧雅老师有了更多的接触。\n\n他发现萧雅不仅长得漂亮，而且教学水平很高，深受学生们的喜爱。\n\n更让他惊讶的是，他终于想起来了，萧雅竟然是他高中时期的班主任！'
						},
						{
							number: 2,
							title: '意外的重逢',
							content: '"萧老师，你还记得我吗？"在一次课后，林峰鼓起勇气问道。\n\n萧雅正在整理教案，听到他的话抬起头来，有些疑惑地看着他："你是？"\n\n"我是林峰啊，您高中时候的学生，高三二班的。"林峰有些激动地说道。\n\n萧雅仔细打量了他一番，眼中闪过一丝惊讶："原来是你！都长这么大了，我都认不出来了。"\n\n"没想到能在这里遇到您，真是太巧了。"林峰说道。\n\n"是啊，缘分真是奇妙。"萧雅笑着说道，眼中闪过一丝复杂的情绪。\n\n自从认出萧雅后，林峰对她的感觉变得更加复杂了。\n\n他想起了高中时候，萧雅刚刚大学毕业来到他们学校任教，年轻漂亮的她很快就成为了学校里的风云人物。\n\n那时候的林峰只是一个普通的高中生，虽然也很喜欢这位年轻漂亮的老师，但也只是远远地看着。\n\n没想到多年后，他们竟然以这样的方式重逢了。\n\n"对了，你怎么会来这里实习？"萧雅问道。\n\n"我是师范大学毕业的，听说这里实习机会很好，就过来了。"林峰说道。\n\n"原来是这样，好好努力，你会成为一名优秀的老师的。"萧雅鼓励道。\n\n"谢谢老师。"林峰说道，看着萧雅的眼睛，心中涌起一股莫名的情愫。\n\n从那以后，林峰总是找各种理由接近萧雅，有时候是请教教学问题，有时候是帮她搬东西。\n\n萧雅似乎也察觉到了他的意图，但并没有拒绝，只是保持着适当的距离。\n\n这种微妙的关系持续了一段时间，直到那天晚上。'
						},
						{
							number: 3,
							title: '雨夜的告白',
							content: '那天晚上下着大雨，林峰加班批改作业到很晚。\n\n当他走出教学楼的时候，发现萧雅也在门口等车。\n\n"萧老师，这么晚了还没回去？"林峰问道。\n\n"嗯，刚忙完。"萧雅说道，看着外面的雨有些发愁。\n\n"我送您回去吧。"林峰说道。\n\n"不用了，太麻烦你了。"萧雅说道。\n\n"不麻烦，正好顺路。"林峰说道，不由分说地把伞撑到了萧雅头上。\n\n两人共撑一把伞，在雨中慢慢走着。\n\n雨水打湿了地面，空气中弥漫着泥土的气息。\n\n"萧老师，我有件事想告诉你。"林峰突然停下脚步说道。\n\n萧雅看着他，眼中有些疑惑："什么事？"\n\n"我...我喜欢你。"林峰鼓起勇气说道，心跳加速。\n\n萧雅愣住了，显然没有想到他会这么说。\n\n"林峰，你..."萧雅有些不知所措。\n\n"我知道这样说很唐突，但我真的很喜欢你。从高中时候就开始了，这么多年一直没有忘记。"林峰说道。\n\n萧雅沉默了一会儿，说道："林峰，你还年轻，有些事情你还不懂。"\n\n"我懂，我知道我们之间的差距，但感情是没有年龄界限的。"林峰说道。\n\n"可是我是你的老师，这样不合适。"萧雅说道。\n\n"现在不是了，我们都是老师。"林峰说道。\n\n萧雅看着林峰真挚的眼神，心中也有些动摇。\n\n她承认，这段时间的相处，她对林峰也产生了一些好感。\n\n但理智告诉她，他们之间是不可能的。\n\n"让我想想，好吗？"萧雅说道。\n\n"好，我等你。"林峰说道，眼中充满了期待。'
						},
						{
							number: 4,
							title: '感情的升温',
							content: '从那天晚上之后，两人之间的关系变得更加微妙了。\n\n萧雅没有明确拒绝林峰，但也没有接受他。\n\n林峰并没有放弃，依然默默地关心着萧雅。\n\n他会在早上给她带一份早餐，会在她需要帮助的时候及时出现，会在她心情不好的时候陪在她身边。\n\n萧雅的心渐渐被融化了。\n\n她发现自己越来越期待看到林峰，越来越喜欢和他在一起的感觉。\n\n终于，在一个周末，萧雅答应了林峰的约会请求。\n\n两人一起去看了一场电影，然后在公园里散步。\n\n月光洒在两人身上，营造出一种浪漫的氛围。\n\n"林峰，我想清楚了。"萧雅停下脚步说道。\n\n林峰紧张地看着她，等待着她的回答。\n\n"我...我也喜欢你。"萧雅红着脸说道。\n\n林峰激动地一把将她搂进怀里："太好了！"\n\n萧雅没有挣扎，反而紧紧地抱住了他。\n\n从那以后，两人正式确立了恋爱关系。\n\n他们的恋情是秘密的，毕竟在同一个学校工作，师生恋还是不太合适。\n\n但这并没有影响他们的感情，反而让他们更加珍惜在一起的时光。\n\n每天一起上下班，一起吃饭，一起备课，日子过得甜蜜而幸福。\n\n然而，他们的秘密恋情终究还是被发现了。'
						},
						{
							number: 5,
							title: '风波乍起',
							content: '那天下午，林峰和萧雅在办公室里讨论教学问题，气氛有些暧昧。\n\n没想到这一幕被路过的教导主任看到了。\n\n教导主任是一个古板的老教师，对这种事情非常反感。\n\n"你们在干什么？"教导主任严厉地说道。\n\n林峰和萧雅连忙分开，有些尴尬。\n\n"张主任，我们在讨论教学问题。"萧雅说道。\n\n"讨论教学问题需要靠这么近吗？"张主任说道，眼中充满了怀疑。\n\n这件事情很快就在学校里传开了，各种流言蜚语满天飞。\n\n校长找他们谈话，明确表示学校不允许这种事情发生。\n\n"要么你们其中一个离开学校，要么就结束这段关系。"校长说道。\n\n林峰和萧雅陷入了两难的境地。\n\n他们深爱着彼此，但也都热爱着教师这份职业。\n\n"要不我走吧。"林峰说道，"你在这里发展得很好，不能因为我影响了你的前途。"\n\n"不行，要走一起走。"萧雅说道，眼中含着泪水。\n\n"傻丫头，"林峰心疼地擦去她的眼泪，"你是这里的骨干教师，校长很器重你。而我只是一个实习生，去哪里都一样。"\n\n"可是..."萧雅还想说什么。\n\n"别可是了，就这么决定了。"林峰说道，"等我找到工作，我们就结婚。"\n\n萧雅含着眼泪点了点头。\n\n最终，林峰离开了学校，去了另一所学校任教。\n\n虽然不在同一个学校了，但他们的感情并没有因此而变淡。\n\n每天晚上，他们都会视频通话，分享一天的见闻。\n\n周末的时候，他们会一起出去玩，享受二人世界。\n\n一年后，林峰向萧雅求婚了。\n\n在一个浪漫的夜晚，林峰单膝跪地，拿出了戒指。\n\n"萧雅，嫁给我好吗？"林峰深情地说道。\n\n萧雅激动地点了点头，泪水再次流了下来。\n\n"我愿意。"\n\n就这样，他们走进了婚姻的殿堂，开始了新的人生旅程。'
						}
					]
				};
			},
			prevChapter() {
				if (this.hasPrevChapter) {
					this.currentIndex--;
					this.currentChapter = this.chapters[this.currentIndex];
					uni.showToast({
						title: `第${this.currentChapter.number}章`,
						icon: 'none'
					});
				}
			},
			nextChapter() {
				if (this.hasNextChapter) {
					this.currentIndex++;
					this.currentChapter = this.chapters[this.currentIndex];
					uni.showToast({
						title: `第${this.currentChapter.number}章`,
						icon: 'none'
					});
				}
			},
			onScrollToLower() {
				if (this.hasNextChapter) {
					uni.showModal({
						title: '提示',
						content: '已经阅读到本章末尾，是否继续阅读下一章？',
						success: (res) => {
							if (res.confirm) {
								this.nextChapter();
							}
						}
					});
				}
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: #0f1629;
		min-height: 100vh;
	}

	.page {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}

	.top-nav {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 20rpx;
		height: 88rpx;
		background-color: #16213e;
		padding-top: var(--status-bar-height, 44px);
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
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
		text-align: center;
	}

	.title-text {
		font-size: 32rpx;
		color: #fff;
		font-weight: 500;
	}

	.nav-placeholder {
		width: 60rpx;
	}

	.chapter-info {
		padding: 20rpx;
		background-color: #16213e;
		text-align: center;
		padding-top: calc(88rpx + var(--status-bar-height, 44px));
	}

	.chapter-number {
		font-size: 28rpx;
		color: #ffd700;
	}

	.content-area {
		flex: 1;
		background-color: #0f1629;
		padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
	}

	.content-container {
		padding: 30rpx;
	}

	.content-text {
		font-size: 30rpx;
		color: #ccc;
		line-height: 2;
		text-indent: 2em;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 20rpx 30rpx;
		background-color: #16213e;
		padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
		z-index: 100;
	}

	.bar-btn {
		display: flex;
		align-items: center;
		gap: 8rpx;
		padding: 15rpx 30rpx;
		background-color: rgba(255, 215, 0, 0.15);
		border-radius: 30rpx;
	}

	.bar-btn.disabled {
		opacity: 0.4;
		pointer-events: none;
	}

	.btn-icon {
		font-size: 28rpx;
		color: #ffd700;
	}

	.btn-text {
		font-size: 28rpx;
		color: #ffd700;
	}

	.bar-center {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10rpx;
		margin: 0 30rpx;
	}

	.progress-text {
		font-size: 24rpx;
		color: #999;
	}

	.progress-bar {
		width: 100%;
		height: 6rpx;
		background-color: rgba(255, 255, 255, 0.2);
		border-radius: 3rpx;
		overflow: hidden;
	}

	.progress-fill {
		height: 100%;
		background-color: #ffd700;
		border-radius: 3rpx;
		transition: width 0.3s ease;
	}
</style>