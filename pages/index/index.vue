<template>
	<view class="page">
		<view class="top-header">
			<view class="tabs-wrapper">
				<view v-if="showCategoryList" class="back-btn" @click="goBackToHome">
					<text class="back-icon">‹</text>
				</view>
				<scroll-view scroll-x class="tabs-scroll" :scroll-into-view="scrollToTab" scroll-with-animation>
					<view class="tabs">
						<view 
							v-for="(item, index) in tabs" 
							:key="index"
							:id="'tab-' + index"
							:class="['tab-item', { active: activeTab === index }]"
							@click="switchTab(index)"
						>
							<text>{{ item.name }}</text>
						</view>
					</view>
				</scroll-view>
				<view v-if="!showCategoryList" class="category-btn" @click="openCategoryDrawer">
					<view class="category-icon">
						<view class="grid-line"></view>
						<view class="grid-line"></view>
						<view class="grid-line"></view>
						<view class="grid-line"></view>
					</view>
				</view>
			</view>
			<view class="search-bar">
				<view class="search-input-wrap" @click="goToSearch">
					<image src="../../static/images/search.png" mode="widthFix" style="width:36rpx;" class="search-icon" />
					<input class="search-input" placeholder="极品尤物" />
				</view>
				<view class="search-actions">
					<!-- <view class="action-btn" @click="handleAction('download')">
						<image src="../../static/images/img01.png" mode="widthFix" style="width:60%;" />
					</view> -->
					<view class="action-btn" @click="goToHistory">
						<image src="../../static/images/img02.png" mode="widthFix" style="width:60%;" />
					</view>
					<!-- <view class="action-btn history-btn" @click="goToHistory">
						<image src="../../static/images/history.png" mode="widthFix" style="width:60%;" />
						<text class="btn-text">历史</text>
					</view> -->
				</view>
			</view>
		</view>

		<view v-if="!showCategoryList">
			<view class="banner-section">
			<swiper 
				class="banner-swiper"
				:indicator-dots="false"
				:autoplay="true"
				:interval="4000"
				:circular="true"
				@change="onSwiperChange"
				@click="handleBannerClick(bannerList[currentBanner])"
			>
				<swiper-item v-for="(item, index) in bannerList" :key="index">
					<view class="banner-item">
						<image :src="item.image" mode="aspectFill" class="banner-image" />
						<view class="banner-overlay"></view>
						<view class="banner-info">
							<text class="banner-title">{{ item.title }}</text>
							<text class="banner-desc">{{ item.desc }}</text>
						</view>
					</view>
				</swiper-item>
			</swiper>
			<view class="banner-indicators">
				<view 
					v-for="(_, index) in bannerList" 
					:key="index"
					:class="['indicator-dot', { active: currentBanner === index }]"
				></view>
			</view>
		</view>
		<view v-show="!isLoading" class="grid-section">
			<view class="grid-container">
				<view 
					v-for="(item, index) in gridList" 
					:key="index" 
					class="grid-item"
					@click="handleGridClick(item)"
				>
					<view class="grid-icon">
						<image :src="item.image" mode="aspectFill" class="grid-image" />
					</view>
					<text class="grid-name">{{ item.name }}</text>
				</view>
			</view>
		</view>

		<view v-if="squareAd" class="square-ad" @click="handleSquareAdClick">
			<image :src="squareAd.image" mode="aspectFill" class="square-ad-image" />
		</view>

		<view :class="['video-section', { 'second-video-section': tabIndex === 1 }]" v-for="(tab, tabIndex) in tabs" :key="tabIndex">
			<view class="section-header">
				<view class="header-left">
					<view class="title-badge"></view>
					<text class="section-title">{{ tab.nickname }}</text>
				</view>
				<view v-if="tabIndex !== 1" class="header-right" @click="handleMore(tabIndex)">
					<text class="more-text">更多</text>
					<text class="more-arrow">›</text>
				</view>
			</view>
			<view class="video-container" v-if="tabIndex === 0 || tabIndex === 1">
				<view 
					v-for="(video, index) in (tabIndex === 0 ? getVideoListByIndex(tabIndex).slice(0, 2) : getVideoListByIndex(tabIndex))" 
					:key="index" 
					class="video-card"
					@click="handleVideoClick(video)"
				>
					<view class="video-cover">
						<image :src="video.cover_image" mode="aspectFill" class="cover-image" />
						<view class="video-overlay">
							<view class="play-icon">▶</view>
						</view>
						<text class="play-count">{{ video.playCount }}</text>
						<text class="video-duration">{{ video.duration }}</text>
						<view v-if="video.is_free === 0" class="vip-badge">VIP</view>
					</view>
					<view class="video-title-row">
						<view v-if="video.is_free === 0" class="vip-label">VIP</view>
						<text class="video-title">{{ video.title }}</text>
					</view>
					<view class="video-tags">
						<text 
							v-for="(tag, tagIndex) in video.tags" 
							:key="tagIndex" 
							class="video-tag"
						>{{ tag }}</text>
					</view>
				</view>
			</view>
			<scroll-view v-if="tabIndex === 2" scroll-x class="horizontal-scroll-container">
				<view 
					v-for="(video, index) in getVideoListByIndex(tabIndex)" 
					:key="index" 
					class="horizontal-video-card"
					@click="handleVideoClick(video)"
				>
					<view class="video-cover">
						<image :src="video.cover_image" mode="aspectFill" class="cover-image" />
						<view class="video-overlay">
							<view class="play-icon">▶</view>
						</view>
						<text class="play-count">{{ video.playCount }}</text>
						<text class="video-duration">{{ video.duration }}</text>
						<view v-if="video.is_free === 0" class="vip-badge">VIP</view>
					</view>
					<view class="video-title-row">
						<view v-if="video.is_free === 0" class="vip-label">VIP</view>
						<text class="video-title">{{ video.title }}</text>
					</view>
					<view class="video-tags">
						<text 
							v-for="(tag, tagIndex) in video.tags" 
							:key="tagIndex" 
							class="video-tag"
						>{{ tag }}</text>
					</view>
				</view>
			</scroll-view>
			<view v-if="tabIndex === 3" class="left-image-container">
				<view 
					v-for="(video, index) in getVideoListByIndex(tabIndex)" 
					:key="index" 
					class="left-image-card"
					@click="handleVideoClick(video)"
				>
					<view class="left-video-cover">
						<image :src="video.cover_image" mode="aspectFill" class="left-cover-image" />
						<view class="left-video-overlay">
							<view class="left-play-icon">▶</view>
						</view>
						<text class="left-play-count">{{ video.playCount }}</text>
						<text class="left-video-duration">{{ video.duration }}</text>
						<view v-if="video.is_free === 0" class="vip-badge">VIP</view>
					</view>
					<view class="left-video-info">
						<view class="left-video-title-row">
							<view v-if="video.is_free === 0" class="vip-label">VIP</view>
							<text class="left-video-title">{{ video.title }}</text>
						</view>
						<view class="left-video-tags">
							<text 
								v-for="(tag, tagIndex) in video.tags" 
								:key="tagIndex" 
								class="left-video-tag"
							>{{ tag }}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="tabIndex === 4" class="three-column-container">
				<view 
					v-for="(video, index) in getVideoListByIndex(tabIndex)" 
					:key="index" 
					class="three-column-card"
					@click="handleVideoClick(video)"
				>
					<view class="rank-number">{{ index + 1 }}</view>
					<view class="three-video-cover">
						<image :src="video.cover_image" mode="aspectFill" class="three-cover-image" />
						<view v-if="video.is_free === 0" class="vip-badge small">VIP</view>
					</view>
					<view class="three-video-info">
						<view class="three-video-title-row">
							<view v-if="video.is_free === 0" class="vip-label small">VIP</view>
							<text class="three-video-title">{{ video.title }}</text>
						</view>
						<text class="three-video-count">{{ video.playCount }}次</text>
					</view>
				</view>
			</view>
			<view v-if="tabIndex === 5" class="big-card-container">
				<view 
					v-for="(video, index) in getVideoListByIndex(tabIndex)" 
					:key="index" 
					class="big-card"
					@click="handleVideoClick(video)"
				>
					<view class="big-video-cover">
						<image :src="video.cover_image" mode="aspectFill" class="big-cover-image" />
						<view class="big-video-overlay">
							<view class="big-play-icon">▶</view>
						</view>
						<text class="big-play-count">{{ video.playCount }}</text>
						<text class="big-video-duration">{{ video.duration }}</text>
						<view v-if="video.is_free === 0" class="vip-badge">VIP</view>
					</view>
					<view class="big-video-info">
						<view class="big-video-title-row">
							<view v-if="video.is_free === 0" class="vip-label">VIP</view>
							<text class="big-video-title">{{ video.title }}</text>
						</view>
						<view class="big-video-meta">
							<text class="meta-item">评分 {{ video.score }}</text>
							<text class="meta-item">|</text>
							<text class="meta-item">{{ video.likeNumber }} 点赞</text>
						</view>
						<view class="big-video-tags">
							<text 
								v-for="(tag, tagIndex) in video.tags.slice(0, 3)" 
								:key="tagIndex" 
								class="big-video-tag"
							>{{ tag }}</text>
						</view>
					</view>
				</view>
			</view>
			<view v-if="tabIndex === 6" class="small-grid-container">
				<view 
					v-for="(video, index) in getVideoListByIndex(tabIndex)" 
					:key="index" 
					class="small-grid-card"
					@click="handleVideoClick(video)"
				>
					<view class="small-video-cover">
						<image :src="video.cover_image" mode="aspectFill" class="small-cover-image" />
						<view class="small-video-overlay">
							<view class="small-play-icon">▶</view>
						</view>
						<view v-if="video.is_free === 0" class="vip-badge small">VIP</view>
					</view>
					<view class="small-video-title-row">
						<view v-if="video.is_free === 0" class="vip-label small">VIP</view>
						<text class="small-video-title">{{ video.title }}</text>
					</view>
				</view>
			</view>
			<view v-if="tabIndex === 7" class="mixed-container">
				<view 
					v-for="(video, index) in getVideoListByIndex(tabIndex)" 
					:key="index" 
					:class="['mixed-card', { 'big': index % 3 === 0 }]"
					@click="handleVideoClick(video)"
				>
					<view :class="['mixed-video-cover', { 'big': index % 3 === 0 }]">
						<image :src="video.cover_image" mode="aspectFill" :class="['mixed-cover-image', { 'big': index % 3 === 0 }]" />
						<view class="mixed-video-overlay">
							<view class="mixed-play-icon">▶</view>
						</view>
						<text class="mixed-play-count">{{ video.playCount }}</text>
						<view v-if="video.is_free === 0" :class="['vip-badge', { 'small': index % 3 !== 0 }]">VIP</view>
					</view>
					<view :class="['mixed-video-title-row', { 'big': index % 3 === 0 }]">
						<view v-if="video.is_free === 0" :class="['vip-label', { 'small': index % 3 !== 0 }]">VIP</view>
						<text :class="['mixed-video-title', { 'big': index % 3 === 0 }]">{{ video.title }}</text>
					</view>
				</view>
			</view>
			<view v-if="tabIndex === 1" class="video-actions">
				<view class="action-button" @click="handleMoreSource">
					<text class="action-icon">⊕</text>
					<text class="action-text">更多片源</text>
				</view>
				<view class="action-button" @click="handleRefresh(tabIndex)">
					<text class="action-icon">⟳</text>
					<text class="action-text">换一换</text>
				</view>
			</view>
			<view v-if="tabIndex !== 0 && tabIndex !== 1" class="video-actions-single">
				<view class="action-button-single" @click="handleRefresh(tabIndex)">
					<text class="action-icon">⟳</text>
					<text class="action-text">换一换</text>
				</view>
			</view>
		</view>
		</view>

		<view v-if="showCategoryList" class="category-video-list">
			<view class="category-header">
				<text class="category-title">{{ tabs[activeTab] && tabs[activeTab].nickname ? tabs[activeTab].nickname : '精选内容' }}</text>
			</view>
			<scroll-view 
				v-if="videoList.length > 0" 
				scroll-y 
				class="category-video-scroll"
				@scrolltolower="loadMore"
			>
				<view class="category-video-container">
					<view 
						v-for="(video, index) in videoList" 
						:key="index" 
						class="category-video-card"
						@click="handleVideoClick(video)"
					>
						<view class="category-video-cover">
							<image :src="video.cover_image" mode="aspectFill" class="cover-image" />
							<view class="video-overlay">
								<view class="play-icon">▶</view>
							</view>
							<text class="play-count">{{ video.playCount }}</text>
							<text class="video-duration">{{ video.duration }}</text>
							<view v-if="video.is_free === 0" class="vip-badge">VIP</view>
						</view>
						<view class="category-video-info">
							<view class="category-video-title-row">
								<view v-if="video.is_free === 0" class="vip-label">VIP</view>
								<text class="category-video-title">{{ video.title }}</text>
							</view>
							<view class="category-video-tags">
								<text 
									v-for="(tag, tagIndex) in video.tags" 
									:key="tagIndex" 
									class="video-tag"
								>{{ tag }}</text>
							</view>
						</view>
					</view>
				</view>
				<u-loadmore 
					v-if="!isLoading && videoList.length > 0" 
					:status="isLoadMore" 
					:loading-text="'加载中'" 
					:loadmore-text="'加载中'" 
					:nomore-text="'暂无更多'" 
					class="py-3" 
				/>
			</scroll-view>
			<view v-else class="empty-state">
				<view class="empty-icon">📺</view>
				<text class="empty-text">暂无相关视频</text>
				<text class="empty-hint">该分类下暂无视频内容</text>
			</view>
		</view>

		<view v-if="showDrawer" class="drawer-overlay" @click="closeCategoryDrawer">
			<view class="drawer-content" @click.stop>
				<view class="drawer-header">
					<text class="drawer-close" @click="closeCategoryDrawer">取消</text>
					<text class="drawer-title">導航</text>
					<view class="drawer-placeholder"></view>
				</view>
				<view class="drawer-body">
					<text class="drawer-section-title">常用频道</text>
					<view class="category-grid">
						<view 
							v-for="(item, index) in tabs" 
							:key="index" 
							class="category-item"
							:style="{ backgroundColor: item.color }"
							@click="handleCategoryClick(item)"
						>
							<text class="category-name">{{ item.name }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view v-if="showPopup && popupList.length > 0" class="modal-overlay">
			<view class="popup-modal">
				<view v-if="popupList[currentPopupIndex] && popupList[currentPopupIndex].content" class="popup-content">
					<view class="popup-header">
						<text class="popup-title">最新公告!</text>
					</view>
					<view class="popup-body">
						<text class="popup-text">{{ popupList[currentPopupIndex].content }}</text>
					</view>
				</view>
				<image 
					v-if="popupList[currentPopupIndex] && popupList[currentPopupIndex].images" 
					:src="popupList[currentPopupIndex].images" 
					mode="aspectFill" 
					class="popup-image" 
				/>
				<view class="popup-btn" @click="closePopup">
					<text>知道了</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { IndexAdvertise, IndexChannel, IndexPopup_window, IndexIndex_list_data, IndexIndex_list_data_Refresh, VodApi_vod_data_list_search } from '@/api/home.js'

	export default {
		data() {
			return {
				popupList: [],
				currentPopupIndex: 0,
				showPopup: false,
				activeTab: 0,
				scrollToTab: '',
				currentBanner: 0,
				showDrawer: false,
				showCategoryList: false,
				tabs: [],
				bannerList: [],
				gridList: [],
				squareAd: null,
				videoList: [],
				secondVideoList: [],
				horizontalVideoList: [],
				leftImageVideoList: [],
				threeColumnVideoList: [],
				bigCardVideoList: [],
				smallGridVideoList: [],
				mixedVideoList: [],
				currentPage: 1,
				totalPages: 1,
				isLoading: false,
				isLoadMore: 'loadmore'
			}
		},
		onLoad() {
			this.loadPopupData()
			this.loadChannelData()
			this.loadAdvertiseData()
		},
		methods: {
			loadPopupData() {
				IndexPopup_window().then(res => {
					if (res && res.data && res.data.length > 0) {
						this.popupList = res.data
						this.currentPopupIndex = 0
						this.showPopup = true
					}
				}).catch(err => {
					console.error('弹窗数据加载失败', err)
				})
			},
			closePopup() {
				this.showPopup = false
				if (this.currentPopupIndex < this.popupList.length - 1) {
					this.currentPopupIndex++
					setTimeout(() => {
						this.showPopup = true
					}, 100)
				}
			},
			loadChannelData() {
				const colors = ['#6BA3E0', '#FF9F43', '#EE5A5A', '#E85FD7', '#9B59B6', '#2ECC71', '#5DADE2', '#F39C12', '#E74C3C', '#D35DE8', '#8E44AD', '#27AE60', '#3498DB', '#F1C40F', '#E67E22', '#D98880', '#58D68D']
				IndexChannel().then(res => {
					if (res && res.data && res.data.length > 0) {
						this.tabs = res.data.map((item, index) => ({
							id: item.id,
							name: item.name,
							nickname: item.nickname,
							color: colors[index % colors.length]
						}))
					} else {
						this.tabs = [
							{ id: 1, name: '推荐', nickname: '精选推荐' },
							{ id: 2, name: '最新', nickname: '最新更新' },
							{ id: 3, name: '色图', nickname: '高清美图' },
							{ id: 4, name: '福利姬', nickname: '福利精选' },
							{ id: 5, name: '探花大神', nickname: '探花精选' },
							{ id: 6, name: '国产大工厂', nickname: '国产精品' },
							{ id: 7, name: '日本AV', nickname: '岛国精选' },
						]
					}
					this.loadVideoList(this.tabs[this.activeTab] && this.tabs[this.activeTab].id ? this.tabs[this.activeTab].id : null)
					this.loadDefaultVideos()
				}).catch(err => {
					console.error('频道数据加载失败', err)
					this.tabs = [
						{ id: 1, name: '推荐', nickname: '精选推荐' },
						{ id: 2, name: '最新', nickname: '最新更新' },
						{ id: 3, name: '色图', nickname: '高清美图' },
						{ id: 4, name: '福利姬', nickname: '福利精选' },
						{ id: 5, name: '探花大神', nickname: '探花精选' },
						{ id: 6, name: '国产大工厂', nickname: '国产精品' },
						{ id: 7, name: '日本AV', nickname: '岛国精选' },
					]
					this.loadDefaultVideos()
				})
			},
			loadVideoList(channelId, page = 1, isLoadMore = false) {
				if (channelId === null || channelId === undefined) return
				if (!isLoadMore) {
					uni.showLoading({ title: '加载中...' })
				}
				VodApi_vod_data_list_search({ category_id: channelId, page: page, pagesize: 10 }).then(res => {
					uni.hideLoading()
					this.isLoading = false
					let dataList = []
					if (res && res.code === 1 && res.data) {
						if (Array.isArray(res.data)) {
							dataList = res.data
						} else if (res.data.rows && Array.isArray(res.data.rows)) {
							dataList = res.data.rows
						}
					}
					if (dataList.length > 0) {
						let videos = dataList.map(video => ({
							id: video.id,
							cover_image: video.cover_image || '',
							title: video.title || '',
							playCount: this.formatNumber(video.look_number) || '0',
							duration: video.duration || '00:00',
							tags: video.tags || [],
							videoUrl: video.video || '',
							isFree: video.is_free,
							score: video.fraction || 0
						}))
						if (isLoadMore) {
							this.videoList = [...this.videoList, ...videos]
							this.isLoadMore = videos.length < 10 ? 'nomore' : 'loadmore'
						} else {
							this.videoList = videos
							this.currentPage = 1
							this.isLoadMore = videos.length < 10 ? 'nomore' : 'loadmore'
						}
					} else {
						if (!isLoadMore) {
							this.videoList = []
						} else {
							this.isLoadMore = 'nomore'
						}
					}
				}).catch(err => {
					uni.hideLoading()
					this.isLoading = false
					console.error('视频数据加载失败', err)
					if (!isLoadMore) {
						this.videoList = []
					} else {
						this.isLoadMore = 'nomore'
					}
				})
			},
			formatNumber(num) {
				if (!num) return '0'
				let n = parseInt(num)
				if (n >= 10000) {
					return (n / 10000).toFixed(1) + '萬'
				}
				return num.toString()
			},
			loadAdvertiseData() {
				IndexAdvertise().then(res => {
					if (res && res.data) {
						if (res.data.carousel && res.data.carousel.length > 0) {
							this.bannerList = res.data.carousel.map(item => ({
								image: item.image,
								title: '',
								desc: '',
								url: item.url
							}))
						} else {
							this.loadDefaultBanner()
						}

						if (res.data.ten && res.data.ten.length > 0) {
							this.gridList = res.data.ten.map((item, index) => ({
								name: item.title || '分类' + (index + 1),
								image: item.image,
								url: item.url
							}))
						}

						if (res.data.square && res.data.square.length > 0) {
							this.squareAd = res.data.square[0]
						}
					}
				}).catch(err => {
					console.error('广告数据加载失败', err)
					this.loadDefaultBanner()
					this.loadDefaultGrid()
				})
			},
			loadDefaultVideos() {
				this.tabs.forEach((tab, index) => {
					this.loadIndexVideoData(tab.id, index)
				})
			},
			loadIndexVideoData(channelId, tabIndex) {
				IndexIndex_list_data({ category_id: channelId }).then(res => {
					if (res && res.data && res.data.length > 0) {
						let channelData = res.data[0]
						if (channelData.videos && channelData.videos.length > 0) {
							let videos = channelData.videos.map(video => ({
								id: video.id,
								cover_image: video.cover_image || '',
								title: video.title || '',
								playCount: this.formatNumber(video.look_number) || '0',
								duration: '00:00',
								tags: video.tags || [],
								videoUrl: video.video || '',
								is_free: video.is_free,
								score: video.fraction || 0,
								likeNumber: video.like_number || 0,
								collectNumber: video.collect_number || 0
							}))
							switch(tabIndex) {
								case 0:
									this.videoList = videos
									break
								case 1:
									this.secondVideoList = videos
									break
								case 2:
									this.horizontalVideoList = videos
									break
								case 3:
									this.leftImageVideoList = videos
									break
								case 4:
									this.threeColumnVideoList = videos
									break
								case 5:
									this.bigCardVideoList = videos
									break
								case 6:
									this.smallGridVideoList = videos
									break
								case 7:
									this.mixedVideoList = videos
									break
							}
						}
					}
				}).catch(err => {
					console.error('分类视频数据加载失败', err)
					this.loadStaticVideos(tabIndex)
				})
			},
			loadStaticVideos(tabIndex) {
				let staticData = [
					{
						id: 1,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20asian%20woman%20video%20cover%20artistic&image_size=portrait_4_3',
						title: '高颜值美女私房写真',
						playCount: '5.2萬',
						duration: '06:32',
						tags: ['HD', '超清'],
						score: 4.8,
						likeNumber: 1234,
						collectNumber: 567
					},
					{
						id: 2,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20fashion%20video%20cover&image_size=portrait_4_3',
						title: '性感模特内衣秀',
						playCount: '2.0萬',
						duration: '08:15',
						tags: ['模特', '高清'],
						score: 4.5,
						likeNumber: 890,
						collectNumber: 345
					},
					{
						id: 3,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20night%20video%20cover&image_size=portrait_4_3',
						title: '夜色迷人',
						playCount: '3.8萬',
						duration: '05:45',
						tags: ['夜景', '唯美'],
						score: 4.6,
						likeNumber: 678,
						collectNumber: 234
					},
					{
						id: 4,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20beach%20video%20cover&image_size=portrait_4_3',
						title: '海滩风情',
						playCount: '4.1萬',
						duration: '07:20',
						tags: ['海滩', '比基尼'],
						score: 4.7,
						likeNumber: 987,
						collectNumber: 456
					}
				]
				switch(tabIndex) {
					case 0:
						this.videoList = staticData.slice(0, 2)
						break
					case 1:
						this.secondVideoList = staticData
						break
					case 2:
						this.horizontalVideoList = staticData
						break
					case 3:
						this.leftImageVideoList = staticData
						break
					case 4:
						this.threeColumnVideoList = staticData
						break
					case 5:
						this.bigCardVideoList = staticData
						break
					case 6:
						this.smallGridVideoList = staticData
						break
					case 7:
						this.mixedVideoList = staticData
						break
				}
			},
			getVideoListByIndex(index) {
				switch(index) {
					case 0:
						return this.videoList
					case 1:
						return this.secondVideoList
					case 2:
						return this.horizontalVideoList
					case 3:
						return this.leftImageVideoList
					case 4:
						return this.threeColumnVideoList
					case 5:
						return this.bigCardVideoList
					case 6:
						return this.smallGridVideoList
					case 7:
						return this.mixedVideoList
					default:
						return this.videoList
				}
			},
			loadStaticVideoList() {
				this.secondVideoList = [
					{
						id: 3,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20living%20room%20video%20cover&image_size=portrait_4_3',
						title: '【秦雄全国探花】大神回第二場，熟悉的配方，極品外圍小姐姐，帥哥美女激...',
						playCount: '8.3萬',
						duration: '01:33:36',
						tags: ['打飞机', '美乳', '美女尤物', '国产']
					},
					{
						id: 4,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20pink%20dress%20video%20cover&image_size=portrait_4_3',
						title: '【太子极品探花】現代版的黑裙少婦，穿上情趣裝沙發上幹後猛...',
						playCount: '2.0萬',
						duration: '00:42:40',
						tags: ['美女尤物', '贵族', '母狗式', '裙子']
					},
					{
						id: 5,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20sofa%20video%20cover&image_size=portrait_4_3',
						title: '【北寻花】高颜值長相甜美萌妹啪啪，連喘情緒超帶墻口交後入猛...',
						playCount: '2.5萬',
						duration: '00:25:12',
						tags: ['二次元/萌妹', '高挑', '网袜', '美女尤物']
					},
					{
						id: 6,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=couple%20sofa%20intimate%20video%20cover&image_size=portrait_4_3',
						title: '素人打野毒浓探花老嫖带你探外围，完美视角拍攝起来超浪，极品牛仔裙...',
						playCount: '3.7萬',
						duration: '01:16:05',
						tags: ['自慰', '打飞机', '美女尤物', '牛仔裤']
					}
				]
				this.horizontalVideoList = [
					{
						id: 7,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20bedroom%20video%20cover&image_size=portrait_4_3',
						title: '美女主播热舞直播精选',
						playCount: '12.5萬',
						duration: '00:35:20',
						tags: ['热舞', '直播', '美女']
					},
					{
						id: 8,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=asian%20woman%20office%20video%20cover&image_size=portrait_4_3',
						title: '办公室OL制服诱惑',
						playCount: '8.3萬',
						duration: '00:28:45',
						tags: ['制服', 'OL', '办公室']
					},
					{
						id: 9,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20girl%20swimsuit%20video%20cover&image_size=portrait_4_3',
						title: '泳池比基尼美女合集',
						playCount: '15.2萬',
						duration: '00:42:15',
						tags: ['比基尼', '泳池', '美腿']
					},
					{
						id: 10,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=model%20lingerie%20fashion%20video%20cover&image_size=portrait_4_3',
						title: '内衣模特走秀精选',
						playCount: '6.8萬',
						duration: '00:31:30',
						tags: ['模特', '内衣', '走秀']
					},
					{
						id: 11,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cosplay%20girl%20anime%20video%20cover&image_size=portrait_4_3',
						title: 'Cosplay二次元美女',
						playCount: '9.1萬',
						duration: '00:25:10',
						tags: ['Cosplay', '二次元', '萌妹']
					}
				]
				this.leftImageVideoList = [
					{
						id: 12,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20red%20dress%20video%20cover&image_size=portrait_4_3',
						title: '【极品探花】顶级外围女神颜值爆表',
						playCount: '18.6萬',
						duration: '01:12:45',
						tags: ['探花', '极品', '外围']
					},
					{
						id: 13,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20couple%20intimate%20video%20cover&image_size=portrait_4_3',
						title: '【富二代约会】重金约网红嫩模',
						playCount: '25.3萬',
						duration: '00:55:30',
						tags: ['约会', '网红', '嫩模']
					},
					{
						id: 14,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20wife%20domestic%20video%20cover&image_size=portrait_4_3',
						title: '【国产精品】人妻少妇寂寞难耐',
						playCount: '32.1萬',
						duration: '01:08:20',
						tags: ['国产', '人妻', '少妇']
					}
				]
				this.threeColumnVideoList = [
					{
						id: 15,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%201&image_size=portrait_4_3',
						title: '【全国探花】长腿空姐酒店约炮',
						playCount: '85.6萬',
						duration: '01:05:30'
					},
					{
						id: 16,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%202&image_size=portrait_4_3',
						title: '【国产AV】大胸美女激情演绎',
						playCount: '72.3萬',
						duration: '00:58:20'
					},
					{
						id: 17,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%203&image_size=portrait_4_3',
						title: '【精品推荐】极品嫩模完美身材',
						playCount: '68.9萬',
						duration: '00:45:15'
					},
					{
						id: 18,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%204&image_size=portrait_4_3',
						title: '【真实自拍】90后小情侣酒店',
						playCount: '61.2萬',
						duration: '00:38:40'
					},
					{
						id: 19,
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%205&image_size=portrait_4_3',
						title: '【高端会所】极品外围女技师',
						playCount: '55.8萬',
						duration: '01:12:00'
					}
				]
				this.categoryList = [
					{ name: '推荐', color: '#6BA3E0' },
					{ name: '最新', color: '#FF9F43' },
					{ name: '色图', color: '#EE5A5A' },
					{ name: '福利姬', color: '#E85FD7' },
					{ name: '探花大神', color: '#9B59B6' },
					{ name: '🔥国产大厂', color: '#2ECC71' },
					{ name: '🇯🇵日本AV', color: '#5DADE2' },
					{ name: '🇨🇳国产自拍', color: '#F39C12' },
					{ name: 'P站模特', color: '#E74C3C' },
					{ name: '成人节目', color: '#D35DE8' },
					{ name: '🇺🇸欧美', color: '#8E44AD' },
					{ name: 'S级女优', color: '#27AE60' },
					{ name: '欧美女优', color: '#3498DB' },
					{ name: '直播', color: '#F1C40F' },
					{ name: '制服诱惑', color: '#E67E22' },
					{ name: '猎奇', color: '#D98880' },
					{ name: '无码', color: '#9B59B6' },
					{ name: '🇰🇷韩国', color: '#58D68D' }
				]
			},
			loadDefaultBanner() {
				this.bannerList = [
					{
						image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20portrait%20artistic%20photography&image_size=landscape_16_9',
						title: '精选推荐',
						desc: '每日精选内容',
						url: ''
					},
					{
						image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20fashion%20model%20portrait&image_size=landscape_16_9',
						title: '热门精选',
						desc: '最受欢迎的内容',
						url: ''
					},
					{
						image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20asian%20woman%20portrait%20soft%20lighting&image_size=landscape_16_9',
						title: '精彩集锦',
						desc: '不容错过的精彩',
						url: ''
					}
				]
			},
			loadDefaultGrid() {
				this.gridList = [
					{ name: '美女写真', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20portrait%20icon&image_size=square', url: '' },
					{ name: '明星网红', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=celebrity%20star%20icon&image_size=square', url: '' },
					{ name: '制服诱惑', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=uniform%20cosplay%20icon&image_size=square', url: '' },
					{ name: '街拍女神', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=street%20fashion%20photography%20icon&image_size=square', url: '' },
					{ name: '私房照', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=private%20photo%20elegant%20icon&image_size=square', url: '' },
					{ name: '网红直播', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=live%20streaming%20beauty%20icon&image_size=square', url: '' },
					{ name: '自拍达人', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=selfie%20beautiful%20icon&image_size=square', url: '' },
					{ name: '模特走秀', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20model%20catwalk%20icon&image_size=square', url: '' },
					{ name: '情趣内衣', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=lingerie%20fashion%20icon&image_size=square', url: '' },
					{ name: '性感热舞', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dance%20sexy%20icon&image_size=square', url: '' }
				]
			},
			switchTab(index) {
				this.activeTab = index
				this.showCategoryList = true
				this.currentPage = 1
				this.isLoadMore = 'loadmore'
				this.scrollToTab = ''
				this.$nextTick(() => {
					this.scrollToTab = 'tab-' + index
					setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
						})
					}, 100)
				})
				const channelId = this.tabs[index] && this.tabs[index].id !== undefined ? this.tabs[index].id : null
				if (channelId !== null && channelId !== undefined) {
					this.loadVideoList(channelId)
				}
			},
			goBackToHome() {
				this.showCategoryList = false
				this.activeTab = 0
			},
			goToSearch() {
				uni.navigateTo({ url: '/pages/index/search' })
			},
			goToHistory() {
				uni.navigateTo({ url: '/pages/mine/history' })
			},
			handleAction(action) {
				if (action === 'download') {
					uni.showToast({ title: '下载功能', icon: 'none' })
				} else if (action === 'refresh') {
					uni.showToast({ title: '刷新中...', icon: 'loading' })
				}
			},
			onSwiperChange(e) {
				this.currentBanner = e.detail.current
			},
			handleGridClick(item) {
				if (item.url) {
					uni.navigateTo({
						url: '/pages/index/webview?url=' + encodeURIComponent(item.url)
					})
				} else {
					uni.showToast({ title: `点击了${item.name}`, icon: 'none' })
				}
			},
			handleBannerClick(item) {
				if (item.url) {
					uni.navigateTo({
						url: '/pages/index/webview?url=' + encodeURIComponent(item.url)
					})
				}
			},
			handleSquareAdClick() {
				if (this.squareAd && this.squareAd.url) {
					uni.navigateTo({
						url: '/pages/index/webview?url=' + encodeURIComponent(this.squareAd.url)
					})
				}
			},
			handleMore(tabIndex) {
				this.activeTab = tabIndex
				this.currentPage = 1
				this.isLoadMore = 'loadmore'
				this.scrollToTab = ''
				this.$nextTick(() => {
					this.scrollToTab = 'tab-' + tabIndex
					setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
						})
					}, 100)
				})
				this.showCategoryList = true
				const channelId = this.tabs[tabIndex] && this.tabs[tabIndex].id !== undefined ? this.tabs[tabIndex].id : null
				if (channelId !== null && channelId !== undefined) {
					this.loadVideoList(channelId)
				}
			},
			loadMore() {
				if (this.isLoading || this.isLoadMore === 'nomore') return
				this.isLoading = true
				this.isLoadMore = 'loading'
				this.currentPage++
				const channelId = this.tabs[this.activeTab] && this.tabs[this.activeTab].id !== undefined ? this.tabs[this.activeTab].id : null
				if (channelId !== null && channelId !== undefined) {
					this.loadVideoList(channelId, this.currentPage, true)
				}
			},
			handleVideoClick(video) {
				uni.navigateTo({
					url: '/pages/index/play?id=' + (video.id || Date.now()) + 
						'&title=' + encodeURIComponent(video.title) +
						'&poster=' + encodeURIComponent(video.cover_image) +
						'&video=' + encodeURIComponent(video.video || '') +
						'&duration=' + video.duration +
						'&views=' + video.playCount +
						'&is_free=' + (video.is_free !== undefined ? video.is_free : 1)
				})
			},
			openCategoryDrawer() {
				this.showDrawer = true
			},
			closeCategoryDrawer() {
				this.showDrawer = false
			},
			handleCategoryClick(item) {
				this.showDrawer = false
				const tabIndex = this.tabs.findIndex(tab => tab.id === item.id)
				this.activeTab = tabIndex
				this.scrollToTab = ''
				this.$nextTick(() => {
					this.scrollToTab = 'tab-' + tabIndex
					setTimeout(() => {
						uni.pageScrollTo({
							scrollTop: 0,
							duration: 300
						})
					}, 100)
				})
				this.showCategoryList = true
				if (item.id !== null && item.id !== undefined) {
					this.loadVideoList(item.id)
				}
			},
			handleMoreSource() {
				uni.showToast({ title: '查看更多片源', icon: 'none' })
			},
			handleRefreshVideos() {
				uni.showToast({ title: '换一换中...', icon: 'loading' })
				setTimeout(() => {
					this.secondVideoList = [...this.secondVideoList].sort(() => Math.random() - 0.5)
				}, 500)
			},
			handleRefresh(tabIndex) {
				let channelId = this.tabs[tabIndex] && this.tabs[tabIndex].id !== undefined ? this.tabs[tabIndex].id : null
				if (channelId === null || channelId === undefined) return
				uni.showToast({ title: '换一换中...', icon: 'loading' })
				IndexIndex_list_data_Refresh({ category_id: channelId }).then(res => {
					uni.hideToast()
					if (res && res.data && res.data.length > 0) {
						let channelData = res.data[0]
						if (channelData.videos && channelData.videos.length > 0) {
							let videos = channelData.videos.map(video => ({
								id: video.id,
								cover: video.cover_image || '',
								title: video.title || '',
								playCount: this.formatNumber(video.look_number) || '0',
								duration: '00:00',
								tags: video.tags || [],
								videoUrl: video.video || '',
								is_free: video.is_free === 1,
								score: video.fraction || 0,
								likeNumber: video.like_number || 0,
								collectNumber: video.collect_number || 0
							}))
							switch(tabIndex) {
								case 1:
									this.secondVideoList = videos
									break
								case 2:
									this.horizontalVideoList = videos
									break
								case 3:
									this.leftImageVideoList = videos
									break
								case 4:
									this.threeColumnVideoList = videos
									break
								case 5:
									this.bigCardVideoList = videos
									break
								case 6:
									this.smallGridVideoList = videos
									break
								case 7:
									this.mixedVideoList = videos
									break
							}
						}
					}
				}).catch(err => {
					uni.hideToast()
					console.error('换一换失败', err)
					uni.showToast({ title: '换一换失败', icon: 'none' })
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
	
	.top-header {
		background-color: #16213e;
		padding: 0 20rpx;
		margin-bottom: 20rpx;
	}
	
	.tabs-wrapper {
		display: flex;
		align-items: center;
		padding: 20rpx 0;
		gap: 10rpx;
	}

	.back-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		flex-shrink: 0;
	}

	.back-icon {
		font-size: 48rpx;
		color: #fff;
		line-height: 1;
	}

	.tabs-scroll {
		white-space: nowrap;
		flex: 1;
		overflow: hidden;
	}
	
	.tabs {
		display: inline-flex;
		gap: 30rpx;
		padding: 0 10rpx;
	}
	
	.tab-item {
		display: inline-flex;
		align-items: center;
		gap: 5rpx;
		padding: 15rpx 25rpx;
		border-radius: 30rpx;
		background-color: rgba(255, 255, 255, 0.1);
		color: #999;
		font-size: 28rpx;
		transition: all 0.3s;
		
		&.active {
			background-color: #ffd700;
			color: #000;
		}
	}
	
	.search-bar {
		display: flex;
		align-items: center;
		gap: 20rpx;
	}
	
	.search-input-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 30rpx;
		padding: 15rpx 25rpx;
	}
	
	.search-icon {
		font-size: 28rpx;
		margin-right: 15rpx;
	}
	
	.search-input {
		flex: 1;
		background: transparent;
		border: none;
		color: #fff;
		font-size: 28rpx;
	}
	
	.search-actions {
		display: flex;
		gap: 15rpx;
	}

	.action-btn {
		width: 60rpx;
		height: 60rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: rgba(255, 255, 255, 0.1);
		border-radius: 50%;
		font-size: 28rpx;
		
		&.history-btn {
			width: auto;
			height: auto;
			padding: 10rpx 20rpx;
			border-radius: 30rpx;
			flex-direction: column;
			gap: 5rpx;
		}
	}

	.btn-text {
		font-size: 20rpx;
		color: #fff;
	}
	
	.banner-section {
		position: relative;
		margin: 20rpx;
		border-radius: 20rpx;
		overflow: hidden;
	}
	
	.banner-swiper {
		height: 360rpx;
	}
	
	.banner-item {
		position: relative;
		width: 100%;
		height: 100%;
	}
	
	.banner-image {
		width: 100%;
		height: 100%;
	}
	
	.banner-overlay {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		height: 120rpx;
		background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	}
	
	.banner-info {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 20rpx 30rpx;
	}
	
	.banner-title {
		display: block;
		color: #fff;
		font-size: 32rpx;
		font-weight: 600;
		margin-bottom: 5rpx;
	}
	
	.banner-desc {
		display: block;
		color: rgba(255, 255, 255, 0.7);
		font-size: 24rpx;
	}
	
	.banner-indicators {
		position: absolute;
		bottom: 20rpx;
		right: 20rpx;
		display: flex;
		gap: 15rpx;
	}
	
	.indicator-dot {
		width: 16rpx;
		height: 16rpx;
		border-radius: 50%;
		background-color: rgba(255, 255, 255, 0.5);
		transition: opacity 0.3s;
		
		&.active {
			background-color: rgba(255, 255, 255, 1);
		}
	}
	
	.grid-section {
		padding: 20rpx;
		background-color: #16213e;
		margin: 0 20rpx 20rpx;
		border-radius: 20rpx;
	}
	
	.grid-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	
	.grid-item {
		width: calc(20% - 10rpx);
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 20rpx 0;
	}
	
	.grid-icon {
		width: 100rpx;
		height: 100rpx;
		border-radius: 50%;
		overflow: hidden;
		margin-bottom: 15rpx;
		background-color: rgba(255, 255, 255, 0.1);
	}
	
	.grid-image {
		width: 100%;
		height: 100%;
	}
	
	.grid-name {
		font-size: 24rpx;
		color: #fff;
		text-align: center;
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.video-section {
		padding: 20rpx;
	}
	
	.section-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 20rpx;
	}
	
	.header-left {
		display: flex;
		align-items: center;
		gap: 15rpx;
	}
	
	.title-badge {
		width: 8rpx;
		height: 32rpx;
		background: linear-gradient(180deg, #ffd700 0%, #ff8c00 100%);
		border-radius: 4rpx;
	}
	
	.section-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
	}
	
	.header-right {
		display: flex;
		align-items: center;
		gap: 8rpx;
	}
	
	.more-text {
		font-size: 26rpx;
		color: #999;
	}
	
	.more-arrow {
		font-size: 32rpx;
		color: #999;
	}
	
	.video-container {
		display: flex;
		gap: 30rpx;
	}

	.video-card {
		flex: 1;
		display: flex;
		flex-direction: column;
		background-color: #16213e;
		border-radius: 16rpx;
		overflow: hidden;
		padding: 15rpx;
	}
	
	.video-cover {
		position: relative;
		width: 100%;
		height: 280rpx;
		border-radius: 12rpx;
		overflow: hidden;
		margin-bottom: 15rpx;
	}
	
	.cover-image {
		width: 100%;
		height: 100%;
	}
	
	.video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 80rpx;
		height: 80rpx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.play-icon {
		color: #fff;
		font-size: 32rpx;
		margin-left: 5rpx;
	}
	
	.play-count {
		position: absolute;
		bottom: 10rpx;
		left: 15rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.9);
		background-color: rgba(0, 0, 0, 0.5);
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}
	
	.video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 15rpx;
		font-size: 22rpx;
		color: rgba(255, 255, 255, 0.9);
		background-color: rgba(0, 0, 0, 0.5);
		padding: 4rpx 12rpx;
		border-radius: 8rpx;
	}

	.vip-badge {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		font-size: 22rpx;
		color: #fff;
		background: linear-gradient(135deg, #ff4500 0%, #ff8c00 100%);
		padding: 6rpx 16rpx;
		border-radius: 8rpx;
		font-weight: 700;
		box-shadow: 0 4rpx 12rpx rgba(255, 69, 0, 0.5);
		
		&.small {
			font-size: 18rpx;
			padding: 4rpx 12rpx;
		}
	}

	.vip-label {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		font-size: 22rpx;
		color: #ff6347;
		background-color: rgba(255, 99, 71, 0.25);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
		margin-right: 10rpx;
		font-weight: 700;
		flex-shrink: 0;
		border: 1rpx solid rgba(255, 99, 71, 0.4);
		
		&.small {
			font-size: 18rpx;
			padding: 2rpx 8rpx;
			margin-right: 8rpx;
		}
	}

	.video-title-row {
		display: flex;
		align-items: flex-start;
		margin-bottom: 10rpx;
	}

	.video-title {
		font-size: 26rpx;
		color: #fff;
		font-weight: 500;
		margin-bottom: 10rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.video-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}
	
	.video-tag {
		font-size: 22rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.2);
		padding: 4rpx 12rpx;
		border-radius: 6rpx;
	}
	
	.second-video-section {
		background-color: #16213e;
		margin: 0 20rpx;
		border-radius: 16rpx;
	}
	
	.second-video-section .video-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20rpx;
	}
	
	.video-actions {
		display: flex;
		gap: 20rpx;
		margin-top: 30rpx;
	}
	
	.action-button {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 10rpx;
		background-color: rgba(255, 255, 255, 0.08);
		border-radius: 50rpx;
		padding: 20rpx 0;
	}
	
	.action-icon {
		font-size: 32rpx;
		color: #ffd700;
	}
	
	.action-text {
		font-size: 28rpx;
		color: #fff;
	}
	
	.category-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 64rpx;
		height: 64rpx;
		background-color: rgba(255, 255, 255, 0.15);
		border-radius: 12rpx;
		flex-shrink: 0;
	}
	
	.category-icon {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 6rpx;
		padding: 8rpx;
	}
	
	.grid-line {
		width: 16rpx;
		height: 16rpx;
		background-color: #fff;
		border-radius: 4rpx;
	}
	
	.drawer-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.6);
		z-index: 1000;
		display: flex;
		justify-content: flex-end;
	}
	
	.drawer-content {
		width: 85%;
		height: 100%;
		background-color: #fff;
		animation: slideIn 0.3s ease-out;
	}
	
	@keyframes slideIn {
		from {
			transform: translateX(100%);
		}
		to {
			transform: translateX(0);
		}
	}
	
	.drawer-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 40rpx 30rpx 30rpx;
		border-bottom: 1rpx solid #f0f0f0;
	}
	
	.drawer-close {
		font-size: 30rpx;
		color: #6BA3E0;
	}
	
	.drawer-title {
		font-size: 34rpx;
		font-weight: 600;
		color: #333;
	}
	
	.drawer-placeholder {
		width: 80rpx;
	}
	
	.drawer-body {
		padding: 30rpx;
		height: calc(100% - 120rpx);
		overflow-y: auto;
	}
	
	.drawer-section-title {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20rpx;
	}
	
	.category-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15rpx;
	}
	
	.category-item {
		display: flex;
		align-items: center;
		justify-content: center;
		height: 140rpx;
		border-radius: 16rpx;
	}
	
	.category-name {
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
	}
	
	.horizontal-scroll-section {
		margin: 20rpx 0;
	}
	
	.horizontal-scroll-container {
		display: flex;
		white-space: nowrap;
		padding: 0 20rpx;
	}
	
	.horizontal-video-card {
		display: inline-block;
		width: 280rpx;
		margin-right: 20rpx;
		flex-shrink: 0;
	}
	
	.horizontal-video-card .video-cover {
		height: 360rpx;
	}
	
	.left-image-section {
		background-color: #16213e;
		margin: 20rpx;
		border-radius: 16rpx;
		padding: 20rpx;
	}
	
	.left-image-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}
	
	.left-image-card {
		display: flex;
		gap: 20rpx;
		background-color: rgba(255, 255, 255, 0.05);
		border-radius: 12rpx;
		padding: 15rpx;
	}
	
	.left-video-cover {
		position: relative;
		width: 220rpx;
		height: 280rpx;
		border-radius: 12rpx;
		overflow: hidden;
		flex-shrink: 0;
	}
	
	.left-cover-image {
		width: 100%;
		height: 100%;
	}
	
	.left-video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 70rpx;
		height: 70rpx;
		background-color: rgba(0, 0, 0, 0.5);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.left-play-icon {
		color: #fff;
		font-size: 28rpx;
		margin-left: 4rpx;
	}
	
	.left-play-count {
		position: absolute;
		bottom: 10rpx;
		left: 10rpx;
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.9);
		background-color: rgba(0, 0, 0, 0.5);
		padding: 3rpx 10rpx;
		border-radius: 6rpx;
	}
	
	.left-video-duration {
		position: absolute;
		bottom: 10rpx;
		right: 10rpx;
		font-size: 20rpx;
		color: rgba(255, 255, 255, 0.9);
		background-color: rgba(0, 0, 0, 0.5);
		padding: 3rpx 10rpx;
		border-radius: 6rpx;
	}
	
	.left-video-info {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}
	
	.left-video-title {
		font-size: 26rpx;
		color: #fff;
		font-weight: 500;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	
	.left-video-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 8rpx;
	}
	
	.left-video-tag {
		font-size: 20rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.2);
		padding: 3rpx 10rpx;
		border-radius: 6rpx;
	}
	
	.three-column-section {
		margin: 20rpx 0;
	}
	
	.three-column-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15rpx;
		padding: 0 20rpx;
	}
	
	.three-column-card {
		position: relative;
		display: flex;
		flex-direction: column;
		background-color: #16213e;
		border-radius: 12rpx;
		overflow: hidden;
	}
	
	.rank-number {
		position: absolute;
		top: 10rpx;
		left: 10rpx;
		width: 50rpx;
		height: 50rpx;
		background: linear-gradient(135deg, #ffd700, #ff6b00);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
		font-weight: bold;
		color: #000;
		z-index: 2;
	}
	
	.three-video-cover {
		position: relative;
		width: 100%;
		height: 240rpx;
	}
	
	.three-cover-image {
		width: 100%;
		height: 100%;
	}
	
	.three-video-info {
		padding: 12rpx;
	}
	
	.three-video-title {
		font-size: 22rpx;
		color: #fff;
		font-weight: 500;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
		margin-bottom: 8rpx;
	}
	
	.three-video-count {
		font-size: 20rpx;
		color: #999;
	}

	.square-ad {
		position: fixed;
		right: 20rpx;
		top: 50%;
		transform: translateY(-50%);
		width: 120rpx;
		height: 120rpx;
		border-radius: 12rpx;
		overflow: hidden;
		z-index: 99;
	}

	.square-ad-image {
		width: 100%;
		height: 100%;
	}

	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.8);
		z-index: 2000;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.notice-modal {
		width: 90%;
		max-width: 680rpx;
		background-color: #fff;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
	}

	.notice-header {
		background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
		padding: 30rpx;
		text-align: center;
	}

	.notice-title {
		display: block;
		font-size: 48rpx;
		color: #fff;
		font-weight: bold;
		text-shadow: 2rpx 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.notice-title-sub {
		display: block;
		font-size: 36rpx;
		color: rgba(255, 255, 255, 0.9);
		margin-top: 10rpx;
	}

	.notice-content {
		padding: 30rpx;
		max-height: 60vh;
		overflow-y: auto;
	}

	.notice-greeting {
		display: block;
		font-size: 28rpx;
		color: #666;
		margin-bottom: 20rpx;
		text-align: center;
	}

	.notice-list {
		display: flex;
		flex-direction: column;
		gap: 15rpx;
		margin-bottom: 20rpx;
	}

	.notice-item {
		font-size: 26rpx;
		color: #333;
		line-height: 1.6;
	}

	.notice-footer {
		text-align: center;
		padding-top: 20rpx;
		border-top: 1rpx dashed #ddd;
	}

	.notice-brand {
		display: block;
		font-size: 32rpx;
		color: #ff8c00;
		font-weight: bold;
		margin-bottom: 10rpx;
	}

	.notice-url {
		font-size: 24rpx;
		color: #999;
	}

	.notice-btn {
		background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
		padding: 25rpx;
		text-align: center;
	}

	.notice-btn text {
		font-size: 32rpx;
		color: #000;
		font-weight: bold;
	}

	.popup-modal {
		width: 90%;
		max-width: 680rpx;
		background-color: #fff;
		border-radius: 30rpx;
		overflow: hidden;
		position: relative;
	}

	.popup-content {
		padding: 30rpx;
	}

	.popup-header {
		background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
		padding: 30rpx;
		text-align: center;
	}

	.popup-title {
		font-size: 48rpx;
		color: #fff;
		font-weight: bold;
		text-shadow: 2rpx 2rpx 4rpx rgba(0, 0, 0, 0.3);
	}

	.popup-body {
		padding: 30rpx;
		max-height: 50vh;
		overflow-y: auto;
	}

	.popup-text {
		font-size: 28rpx;
		color: #333;
		line-height: 1.8;
	}

	.popup-image {
		width: 100%;
		height: 700rpx;
	}

	.popup-btn {
		background: linear-gradient(135deg, #ffd700 0%, #ff8c00 100%);
		padding: 25rpx;
		text-align: center;
	}

	.popup-btn text {
		font-size: 32rpx;
		color: #000;
		font-weight: bold;
	}

	.category-video-list {
		padding: 20rpx;
		height: calc(100vh - 200rpx - 98rpx - constant(safe-area-inset-bottom));
		height: calc(100vh - 200rpx - 98rpx - env(safe-area-inset-bottom));
		box-sizing: border-box;
	}

	.category-video-scroll {
		height: calc(100% - 80rpx);
		box-sizing: border-box;
	}

	.category-header {
		padding-bottom: 20rpx;
		border-bottom: 1rpx solid rgba(255, 255, 255, 0.1);
		margin-bottom: 20rpx;
	}

	.category-title {
		font-size: 32rpx;
		font-weight: 600;
		color: #fff;
	}

	.category-video-container {
		display: flex;
		flex-direction: column;
		gap: 20rpx;
	}

	.empty-state {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 100rpx 40rpx;
	}

	.empty-icon {
		font-size: 120rpx;
		margin-bottom: 30rpx;
	}

	.empty-text {
		font-size: 32rpx;
		color: #fff;
		margin-bottom: 15rpx;
	}

	.empty-hint {
		font-size: 26rpx;
		color: #666;
	}

	.loading-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #1a1a2e;
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 999;
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

	.category-video-card {
		display: flex;
		background-color: #16213e;
		border-radius: 16rpx;
		overflow: hidden;
		padding: 15rpx;
	}

	.category-video-cover {
		position: relative;
		width: 280rpx;
		height: 180rpx;
		border-radius: 12rpx;
		overflow: hidden;
		flex-shrink: 0;
	}

	.category-video-info {
		flex: 1;
		padding: 0 20rpx;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
	}

	.category-video-title {
		font-size: 28rpx;
		color: #fff;
		font-weight: 500;
		line-height: 1.4;
		display: -webkit-box;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.category-video-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10rpx;
	}

	.big-card-container {
		display: flex;
		flex-direction: column;
		gap: 25rpx;
	}

	.big-card {
		background-color: #16213e;
		border-radius: 20rpx;
		overflow: hidden;
	}

	.big-video-cover {
		position: relative;
		width: 100%;
		height: 400rpx;
	}

	.big-cover-image {
		width: 100%;
		height: 100%;
	}

	.big-video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 100rpx;
		height: 100rpx;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.big-play-icon {
		font-size: 40rpx;
		color: #fff;
		margin-left: 8rpx;
	}

	.big-play-count {
		position: absolute;
		bottom: 15rpx;
		left: 15rpx;
		font-size: 24rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 5rpx 15rpx;
		border-radius: 20rpx;
	}

	.big-video-duration {
		position: absolute;
		bottom: 15rpx;
		right: 15rpx;
		font-size: 24rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 5rpx 15rpx;
		border-radius: 20rpx;
	}

	.big-video-info {
		padding: 20rpx;
	}

	.big-video-title {
		font-size: 30rpx;
		color: #fff;
		font-weight: 500;
		margin-bottom: 15rpx;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.big-video-meta {
		display: flex;
		align-items: center;
		gap: 15rpx;
		margin-bottom: 15rpx;
	}

	.meta-item {
		font-size: 24rpx;
		color: #999;
	}

	.big-video-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 12rpx;
	}

	.big-video-tag {
		font-size: 22rpx;
		color: #6BA3E0;
		background-color: rgba(107, 163, 224, 0.2);
		padding: 6rpx 16rpx;
		border-radius: 20rpx;
	}

	.small-grid-container {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 15rpx;
	}

	.small-grid-card {
		display: flex;
		flex-direction: column;
	}

	.small-video-cover {
		position: relative;
		width: 100%;
		height: 180rpx;
		border-radius: 12rpx;
		overflow: hidden;
		margin-bottom: 10rpx;
	}

	.small-cover-image {
		width: 100%;
		height: 100%;
	}

	.small-video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 50rpx;
		height: 50rpx;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.small-play-icon {
		font-size: 24rpx;
		color: #fff;
		margin-left: 4rpx;
	}

	.small-video-title {
		font-size: 22rpx;
		color: #ccc;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mixed-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 15rpx;
	}

	.mixed-card {
		display: flex;
		flex-direction: column;
	}

	.mixed-card.big {
		grid-column: span 2;
	}

	.mixed-video-cover {
		position: relative;
		width: 100%;
		height: 200rpx;
		border-radius: 12rpx;
		overflow: hidden;
		margin-bottom: 10rpx;
	}

	.mixed-video-cover.big {
		height: 300rpx;
	}

	.mixed-cover-image {
		width: 100%;
		height: 100%;
	}

	.mixed-cover-image.big {
		width: 100%;
		height: 100%;
	}

	.mixed-video-overlay {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60rpx;
		height: 60rpx;
		background-color: rgba(0, 0, 0, 0.6);
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.mixed-play-icon {
		font-size: 28rpx;
		color: #fff;
		margin-left: 5rpx;
	}

	.mixed-play-count {
		position: absolute;
		bottom: 10rpx;
		left: 10rpx;
		font-size: 22rpx;
		color: #fff;
		background-color: rgba(0, 0, 0, 0.6);
		padding: 4rpx 12rpx;
		border-radius: 15rpx;
	}

	.mixed-video-title {
		font-size: 24rpx;
		color: #fff;
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.mixed-video-title.big {
		font-size: 28rpx;
		-webkit-line-clamp: 2;
	}

	.video-actions-single {
		display: flex;
		justify-content: center;
		margin-top: 20rpx;
	}

	.action-button-single {
		display: flex;
		align-items: center;
		gap: 8rpx;
		background-color: #16213e;
		padding: 15rpx 40rpx;
		border-radius: 30rpx;
	}
</style>