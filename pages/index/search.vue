<template>
	<view class="page">
		<view class="search-header">
			<view class="back-btn" @click="goBack">
				<image src="../../static/images/back.png" mode="widthFix" class="back-icon" />
			</view>
			<view class="search-input-wrap">
				<input 
					v-model="keyword" 
					class="search-input" 
					placeholder="輸入關鍵字查找"
					confirm-type="search"
					@confirm="doSearch"
				/>
			</view>
			<view class="search-btn" @click="doSearch">
			<image src="../../static/images/search.png" mode="aspectFit" class="search-icon" />
		</view>
		</view>

		<view class="filter-container">
			<scroll-view scroll-y class="category-scroll">
				<view 
					v-for="(cat, index) in categories" 
					:key="cat.id"
					:class="['category-item', { active: activeCategory === index }]"
					@click="selectCategory(index)"
				>
					<text>{{ cat.title }}</text>
				</view>
			</scroll-view>

			<view class="tags-container">
				<view class="tags-header">
					<text>{{ categories[activeCategory] && categories[activeCategory].title || '视频分类' }}</text>
				</view>
				<view class="tags-scroll">
					<view 
						v-for="(tag, index) in currentTags" 
						:key="tag.id"
						:class="['tag-item', { active: selectedTags.includes(tag.title) }]"
						@click="toggleTag(tag)"
					>
						<text>{{ tag.title }}</text>
					</view>
				</view>
			</view>
		</view>

		<view class="sort-bar">
			<view 
				v-for="(sort, index) in sortOptions" 
				:key="index"
				:class="['sort-item', { active: activeSort === index }]"
				@click="selectSort(index)"
			>
				<text>{{ sort }}</text>
			</view>
			<view class="reset-btn" @click="resetFilters">
				<text>重置</text>
			</view>
		</view>

		<!-- <view class="content-tabs">
			<view 
				v-for="(tab, index) in contentTabs" 
				:key="index"
				:class="['content-tab', { active: activeContentTab === index }]"
				@click="selectContentTab(index)"
			>
				<text>{{ tab }}</text>
			</view>
		</view> -->

		<scroll-view scroll-y class="content-list">
			<view v-for="(item, index) in searchResults" :key="index" class="content-item" @click="playVideo(item)">
				<view class="item-cover-wrap">
					<image :src="item.cover" mode="aspectFill" class="item-cover" />
					<text class="item-duration">{{ item.duration }}</text>
					<view class="item-badge" v-if="item.badge">
						<text>{{ item.badge }}</text>
					</view>
				</view>
				<view class="item-info">
					<text class="item-title">{{ item.title }}</text>
					<view class="item-meta">
						<text class="item-views">{{ item.views }}</text>
						<text class="item-separator">·</text>
						<text class="item-tags">{{ item.tags }}</text>
					</view>
					<text class="item-code">{{ item.code }}</text>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import { VodApi_vod_type_list } from '@/api/home.js'
	export default {
		data() {
			return {
				keyword: '',
				activeCategory: 0,
				activeSort: 0,
				activeContentTab: 1,
				selectedTags: [],
				categories: [],
				sortOptions: ['最多播放', '最近添加', '最高评分'],
				contentTabs: ['播單', '視頻', '圖集', 'GIFs'],
				searchResults: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20asian%20woman%20portrait&image_size=portrait_4_3',
						title: '(Part.1)女教師レ×プ輪姦 高橋しょう子',
						duration: '02:50:45',
						views: '4094.5萬',
						tags: 'S級女優 单体作品',
						code: 'MIDE-582',
						badge: 'HD'
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20fashion%20video&image_size=portrait_4_3',
						title: 'DASS-022 派遣マッサージ師にきわどい',
						duration: '02:40:35',
						views: '4080.5萬',
						tags: '单体作品',
						code: 'DASS-022',
						badge: null
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20lingerie%20portrait&image_size=portrait_4_3',
						title: '痴漢に襲われる若妻たち、快楽に身を...',
						duration: '02:35:20',
						views: '3890.2萬',
						tags: '痴漢 劇中劇',
						code: 'JUL-345',
						badge: 'HD'
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20bedroom%20soft%20lighting&image_size=portrait_4_3',
						title: '新人AV女優 初体験3本番 美月もな',
						duration: '02:20:15',
						views: '3650.8萬',
						tags: '新人 单体',
						code: 'SSIS-123',
						badge: 'NEW'
					}
				]
			}
		},
		computed: {
			currentTags() {
				return this.categories[this.activeCategory]?.children || []
			}
		},
		onLoad(options) {
			if (options && options.keyword) {
				this.keyword = decodeURIComponent(options.keyword)
			}
			this.loadCategories()
		},
		methods: {
			loadCategories() {
				uni.showLoading({ title: '加载中...' })
				VodApi_vod_type_list({}).then(res => {
					uni.hideLoading()
					if (res && res.code === 1 && res.data) {
						this.categories = res.data
						if (this.categories.length > 0 && this.categories[0].children) {
							this.activeCategory = 0
						}
					} else {
						this.categories = []
					}
				}).catch(err => {
					uni.hideLoading()
					console.error('加载分类失败:', err)
					this.categories = []
				})
			},
			goBack() {
				uni.navigateBack()
			},
			doSearch() {
				uni.showToast({ title: '搜索: ' + this.keyword, icon: 'none' })
			},
			selectCategory(index) {
				this.activeCategory = index
				this.selectedTags = []
			},
			toggleTag(tag) {
				const index = this.selectedTags.indexOf(tag.title)
				if (index > -1) {
					this.selectedTags.splice(index, 1)
				} else {
					this.selectedTags.push(tag.title)
				}
			},
			selectSort(index) {
				this.activeSort = index
			},
			selectContentTab(index) {
				this.activeContentTab = index
			},
			resetFilters() {
				this.selectedTags = []
				this.activeSort = 0
			},
			playVideo(item) {
				uni.showToast({ title: item.code, icon: 'none' })
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
		padding-top: constant(safe-area-inset-top);
		padding-top: env(safe-area-inset-top);
	}

	.search-header {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #16213e;
		padding-top: calc(20rpx + constant(safe-area-inset-top));
		padding-top: calc(20rpx + env(safe-area-inset-top));
	}

	.back-btn {
		width: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.back-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.search-input-wrap {
		flex: 1;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
		padding: 0 25rpx;
	}

	.search-input {
		width: 100%;
		height: 70rpx;
		font-size: 28rpx;
		color: #fff;
	}

	.search-btn {
		width: 70rpx;
		height: 70rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-left: 15rpx;
	}

	.search-icon {
		width: 40rpx;
		height: 40rpx;
	}

	.filter-container {
		display: flex;
		background-color: #16213e;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.category-scroll {
		width: 160rpx;
		height: 400rpx;
		padding: 20rpx 0;
	}

	.category-item {
		padding: 20rpx 15rpx;
		text-align: center;
		border-left: 4rpx solid transparent;
	}

	.category-item.active {
		background-color: rgba(255, 215, 0, 0.1);
		border-left-color: #ffd700;
	}

	.category-item text {
		font-size: 24rpx;
		color: #999;
	}

	.category-item.active text {
		color: #ffd700;
	}

	.tags-container {
		flex: 1;
		height: 400rpx;
		display: flex;
		flex-direction: column;
		border-left: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.tags-header {
		padding: 20rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.tags-header text {
		font-size: 26rpx;
		color: #fff;
		font-weight: 600;
	}

	.tags-scroll {
		// flex: 1;
		overflow-y: auto;
		padding: 15rpx;
		display: flex;
		flex-wrap: wrap;
		gap: 15rpx;
	}

	.tag-item {
		padding: 12rpx 25rpx;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 20rpx;
	}

	.tag-item.active {
		background-color: rgba(255, 215, 0, 0.3);
	}

	.tag-item text {
		font-size: 24rpx;
		color: #999;
	}

	.tag-item.active text {
		color: #ffd700;
	}

	.sort-bar {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #16213e;
		gap: 30rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
	}

	.sort-item {
		padding: 10rpx 0;
		border-bottom: 3rpx solid transparent;
	}

	.sort-item.active {
		border-bottom-color: #ffd700;
	}

	.sort-item text {
		font-size: 26rpx;
		color: #999;
	}

	.sort-item.active text {
		color: #ffd700;
	}

	.reset-btn {
		margin-left: auto;
		padding: 12rpx 25rpx;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 20rpx;
	}

	.reset-btn text {
		font-size: 24rpx;
		color: #999;
	}

	.content-tabs {
		display: flex;
		align-items: center;
		padding: 20rpx;
		background-color: #1a1a2e;
		gap: 30rpx;
	}

	.content-tab {
		padding: 10rpx 0;
		border-bottom: 3rpx solid transparent;
	}

	.content-tab.active {
		border-bottom-color: #ffd700;
	}

	.content-tab text {
		font-size: 28rpx;
		color: #999;
	}

	.content-tab.active text {
		color: #ffd700;
	}

	.content-list {
		height: calc(100vh - 600rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 600rpx - env(safe-area-inset-bottom));
		padding: 20rpx;
		box-sizing: border-box;
	}

	.content-item {
		display: flex;
		gap: 20rpx;
		padding: 20rpx;
		background-color: #16213e;
		border-radius: 12rpx;
		margin-bottom: 20rpx;
	}

	.item-cover-wrap {
		position: relative;
		width: 200rpx;
		height: 280rpx;
		border-radius: 10rpx;
		overflow: hidden;
		flex-shrink: 0;
	}

	.item-cover {
		width: 100%;
		height: 100%;
	}

	.item-duration {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		font-size: 22rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.7);
		padding: 4rpx 10rpx;
		border-radius: 4rpx;
	}

	.item-badge {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		background-color: #e74c3c;
		padding: 4rpx 12rpx;
		border-radius: 4rpx;
	}

	.item-badge text {
		font-size: 20rpx;
		color: #fff;
		font-weight: 600;
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
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-height: 1.5;
	}

	.item-meta {
		display: flex;
		align-items: center;
		margin-bottom: 10rpx;
	}

	.item-views {
		font-size: 22rpx;
		color: #ffd700;
	}

	.item-separator {
		font-size: 22rpx;
		color: #666;
		margin: 0 10rpx;
	}

	.item-tags {
		font-size: 22rpx;
		color: #999;
	}

	.item-code {
		font-size: 22rpx;
		color: #666;
		font-family: monospace;
	}
</style>
