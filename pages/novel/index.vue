<template>
	<view class="page">
		<!-- 固定顶部 -->
		<view class="fixed-header">
			<!-- 顶部搜索栏 -->
			<view class="search-header">
				<view class="search-bar">
					<image src="../../static/images/search.png" mode="widthFix" style="width:32rpx;" class="search-icon" />
					<input class="search-input" placeholder="搜索小说" />
				</view>
			</view>

			<!-- 分类标签 -->
			<scroll-view scroll-x class="category-tabs">
				<view class="tabs">
					<view 
						v-for="(category, index) in categories" 
						:key="index"
						:class="['tab-item', { active: activeCategory === index }]"
						@click="switchCategory(index)"
					>
						{{ category.name }}
					</view>
				</view>
			</scroll-view>
		</view>

		<!-- 小说列表 -->
		<scroll-view scroll-y class="novel-list" @scrolltolower="loadMore">
			<!-- 空状态 -->
			<u-empty v-if="!loading && novels.length === 0" :text="'暂无数据'" marginTop="50" icon="/static/images/empty-image-default.png"></u-empty>

			<view v-if="novels.length > 0" class="list-container">
				<view 
					v-for="(novel, index) in filteredNovels" 
					:key="index"
					class="novel-card"
					@click="goToRead(novel)"
				>
					<view class="novel-cover">
						<image :src="novel.cover" mode="aspectFill" class="cover-image" />
						<view v-if="novel.isVip" class="vip-badge">VIP</view>
						<view v-if="novel.isFinished" class="finish-badge">已完结</view>
					</view>
					<view class="novel-info">
						<text class="novel-title">{{ novel.title }}</text>
						<text class="novel-author">{{ novel.author }}</text>
						<view class="novel-tags">
							<text 
								v-for="(tag, tagIndex) in novel.tags" 
								:key="tagIndex"
								class="novel-tag"
							>{{ tag }}</text>
						</view>
						<text class="novel-intro">{{ novel.intro }}</text>
						<view class="novel-stats">
							<view class="stat-text"><image src="../../static/images/look.png" mode="widthFix" class="stat-icon" />{{ novel.views }}</view>
							<view class="stat-text"><image src="../../static/images/shu.png" mode="widthFix" class="stat-icon" />{{ novel.chapters }}章</view>
							<view class="stat-text"><image src="../../static/images/dianzan.png" mode="widthFix" class="stat-icon" />{{ novel.likes }}</view>
						</view>
					</view>
				</view>
				<!-- 加载更多 -->
				<u-loadmore 
					v-if="novels.length > 0" 
					:status="loading ? 'loading' : (hasMore ? 'loadmore' : 'nomore')" 
					loading-text="加载中" 
					loadmore-text="加载中" 
					nomore-text="暂无更多数据" 
					class="py-3" 
				/>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeCategory: 0,
				categories: [
					{ id: 0, name: '全部' },
					{ id: 1, name: '都市' },
					{ id: 2, name: '玄幻' },
					{ id: 3, name: '武侠' },
					{ id: 4, name: '仙侠' },
					{ id: 5, name: '穿越' },
					{ id: 6, name: '总裁' },
					{ id: 7, name: '校园' },
					{ id: 8, name: '恐怖' },
					{ id: 9, name: '科幻' }
				],
				novels: [],
				page: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				hasMore: true
			}
		},
		computed: {
			filteredNovels() {
				if (this.activeCategory === 0) {
					return this.novels
				}
				return this.novels.filter(novel => novel.category === this.categories[this.activeCategory].name)
			}
		},
		onLoad() {
			this.loadNovelList()
		},
		methods: {
			loadMore() {
				if (this.loading) return
				if (!this.hasMore) return
				if (this.novels.length >= this.total && this.total > 0) {
					this.hasMore = false
					return
				}
				this.page++
				this.loadNovelList()
			},
			loadNovelList(callback) {
				this.loading = true
				// TODO: 替换为实际的小说列表接口
				// NovelApi.novel_list({ page: this.page, pagesize: this.pageSize, category_id: this.categories[this.activeCategory].id }).then(res => {
				// 这里使用模拟数据演示
				setTimeout(() => {
					this.loading = false
					const mockData = [
						{
							id: 1,
							title: '极品尤物老师',
							author: '色即是空',
							cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20teacher%20portrait%20novel%20cover&image_size=portrait_4_3',
							tags: ['都市', '师生', '暧昧'],
							intro: '大四学生林峰在实习期间，遇到了自己高中时期的美女班主任萧雅，从此开启了不一样的人生...',
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
						},
						{
							id: 4,
							title: '玄幻：开局捡到女神',
							author: '剑神天下',
							cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fantasy%20magic%20world%20novel%20cover&image_size=portrait_4_3',
							tags: ['玄幻', '穿越', '系统'],
							intro: '林逸穿越到玄幻世界，开局就捡到了一个身受重伤的女神，从此开启修仙之路...',
							views: '203.5萬',
							chapters: 589,
							likes: '18562',
							isVip: true,
							isFinished: false,
							category: '玄幻'
						},
						{
							id: 5,
							title: '校花的贴身高手',
							author: '鱼人二代',
							cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20school%20girl%20portrait%20novel%20cover&image_size=portrait_4_3',
							tags: ['都市', '校园', '高手'],
							intro: '雇佣军界的王者回归都市，成为校花的贴身保镖，从此过上了没羞没臊的生活...',
							views: '456.8萬',
							chapters: 1024,
							likes: '45623',
							isVip: false,
							isFinished: true,
							category: '校园'
						},
						{
							id: 6,
							title: '穿越之绝色王妃',
							author: '琉璃心',
							cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20ancient%20chinese%20princess%20novel%20cover&image_size=portrait_4_3',
							tags: ['穿越', '古言', '宫斗'],
							intro: '现代女强人穿越成古代不受宠的王妃，且看她如何在后宫翻云覆雨...',
							views: '178.9萬',
							chapters: 365,
							likes: '15632',
							isVip: true,
							isFinished: false,
							category: '穿越'
						}
					]
					this.total = mockData.length
					if (this.page === 1) {
						this.novels = mockData
					} else {
						this.novels = [...this.novels, ...mockData]
					}
					if (mockData.length < this.pageSize) {
						this.hasMore = false
					}
					if (typeof callback === 'function') {
						callback()
					}
				}, 500)
			},
			switchCategory(index) {
				this.activeCategory = index
				this.page = 1
				this.total = 0
				this.novels = []
				this.loadNovelList()
			},
			goToRead(novel) {
				uni.navigateTo({
					url: `/pages/novel/read?id=${novel.id}&title=${encodeURIComponent(novel.title)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		// min-height: 100vh;
		background-color: #1a1a2e;
		// padding-bottom: 98rpx;
	}

	/* 固定头部 */
	.fixed-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 100;
		background-color: #16213e;
		padding-top: var(--status-bar-height, 44px);
	}

	/* 搜索头部 */
	.search-header {
		padding: 20rpx;
	}

	.search-bar {
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
		padding: 15rpx 25rpx;
	}

	.search-icon {
		margin-right: 15rpx;
	}

	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		color: #fff;
		font-size: 28rpx;
	}

	/* 分类标签 */
	.category-tabs {
		white-space: nowrap;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.tabs {
		display: inline-flex;
		gap: 30rpx;
		padding: 0 20rpx;
	}

	.tab-item {
		padding: 20rpx 10rpx;
		font-size: 28rpx;
		color: #999;
		position: relative;
		white-space: nowrap;
	}

	.tab-item.active {
		color: #ffd700;
		font-weight: 600;
	}

	.tab-item.active::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 50%;
		transform: translateX(-50%);
		width: 50rpx;
		height: 4rpx;
		background-color: #ffd700;
		border-radius: 2rpx;
	}

	/* 小说列表 */
	.novel-list {
		height: calc(100vh - 200rpx - 98rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 200rpx - 98rpx - env(safe-area-inset-bottom));
		padding-top: calc(200rpx + constant(safe-area-inset-top));
		padding-top: calc(200rpx + env(safe-area-inset-top));
		box-sizing: content-box;
	}

	.list-container {
		padding: 20rpx;
	}

	.novel-card {
		display: flex;
		background-color: #16213e;
		border-radius: 16rpx;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}

	.novel-cover {
		position: relative;
		width: 180rpx;
		height: 240rpx;
		border-radius: 12rpx;
		overflow: hidden;
		flex-shrink: 0;
		margin-right: 20rpx;
	}

	.cover-image {
		width: 100%;
		height: 100%;
	}

	.vip-badge {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		background-color: #ffd700;
		color: #000;
		font-size: 20rpx;
		font-weight: bold;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
	}

	.finish-badge {
		position: absolute;
		top: 10rpx;
		right: 10rpx;
		background-color: #2ecc71;
		color: #fff;
		font-size: 18rpx;
		padding: 4rpx 10rpx;
		border-radius: 4rpx;
	}

	.novel-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.novel-title {
		font-size: 32rpx;
		color: #fff;
		font-weight: 600;
		margin-bottom: 8rpx;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.novel-author {
		font-size: 24rpx;
		color: #999;
		margin-bottom: 10rpx;
	}

	.novel-tags {
		display: flex;
		gap: 10rpx;
		flex-wrap: wrap;
		margin-bottom: 10rpx;
	}

	.novel-tag {
		font-size: 20rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.15);
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
	}

	.novel-intro {
		font-size: 24rpx;
		color: #ccc;
		line-height: 1.5;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}

	.novel-stats {
		display: flex;
		gap: 20rpx;
		margin-top: auto;
		flex-wrap: nowrap;
	}

	.stat-text {
		font-size: 22rpx;
		color: #999;
		display: inline-flex;
		align-items: center;
		white-space: nowrap;
	}

	.stat-icon {
		width: 32rpx;
		height: 32rpx;
		margin-right: 6rpx;
		flex-shrink: 0;
	}

	.load-more-tip {
		padding: 30rpx;
		text-align: center;
		font-size: 24rpx;
		color: #999;
	}
</style>
