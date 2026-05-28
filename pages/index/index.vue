<template>
	<view class="page">
		<view class="top-header">
			<scroll-view scroll-x class="tabs-scroll">
				<view class="tabs">
					<view 
						v-for="(item, index) in tabs" 
						:key="index"
						:class="['tab-item', { active: activeTab === index }]"
						@click="switchTab(index)"
					>
						<text>{{ item.name }}</text>
						<text v-if="item.icon" class="tab-icon">{{ item.icon }}</text>
					</view>
				</view>
				<view class="category-btn" @click="openCategoryDrawer">
					<view class="category-icon">
						<view class="grid-line"></view>
						<view class="grid-line"></view>
						<view class="grid-line"></view>
						<view class="grid-line"></view>
					</view>
				</view>
			</scroll-view>
			<view class="search-bar">
				<view class="search-input-wrap">
					<image src="../../static/images/search.png" mode="widthFix" style="width:36rpx;" class="search-icon" />
					<input class="search-input" placeholder="极品尤物" />
				</view>
				<view class="search-actions">
					<view class="action-btn" @click="handleAction('download')">
						<image src="../../static/images/img01.png" mode="widthFix" style="width:60%;" />
					</view>
					<view class="action-btn" @click="handleAction('refresh')">
						<image src="../../static/images/img02.png" mode="widthFix" style="width:60%;" />
					</view>
				</view>
			</view>
		</view>
		<view class="banner-section">
			<swiper 
				class="banner-swiper"
				:indicator-dots="false"
				:autoplay="true"
				:interval="4000"
				:circular="true"
				@change="onSwiperChange"
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
		<view class="grid-section">
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
		<view class="video-section">
			<view class="section-header">
				<view class="header-left">
					<view class="title-badge"></view>
					<text class="section-title">特约板块-国产最新</text>
				</view>
				<view class="header-right" @click="handleMore">
					<text class="more-text">更多</text>
					<text class="more-arrow">›</text>
				</view>
			</view>
			<view class="video-container">
				<view 
					v-for="(video, index) in videoList" 
					:key="index" 
					class="video-card"
					@click="handleVideoClick(video)"
				>
					<view class="video-cover">
						<image :src="video.cover" mode="aspectFill" class="cover-image" />
						<view class="video-overlay">
							<view class="play-icon">▶</view>
						</view>
						<text class="play-count">{{ video.playCount }}</text>
						<text class="video-duration">{{ video.duration }}</text>
					</view>
					<text class="video-title">{{ video.title }}</text>
					<view class="video-tags">
						<text 
							v-for="(tag, tagIndex) in video.tags" 
							:key="tagIndex" 
							class="video-tag"
						>{{ tag }}</text>
					</view>
				</view>
			</view>
		</view>
		<view class="video-section second-video-section">
			<view class="section-header">
				<view class="header-left">
					<view class="title-badge"></view>
					<text class="section-title">精彩推荐</text>
				</view>
			</view>
			<view class="video-container">
				<view 
					v-for="(video, index) in secondVideoList" 
					:key="index" 
					class="video-card"
					@click="handleVideoClick(video)"
				>
					<view class="video-cover">
						<image :src="video.cover" mode="aspectFill" class="cover-image" />
						<view class="video-overlay">
							<view class="play-icon">▶</view>
						</view>
						<text class="play-count">{{ video.playCount }}</text>
						<text class="video-duration">{{ video.duration }}</text>
					</view>
					<text class="video-title">{{ video.title }}</text>
					<view class="video-tags">
						<text 
							v-for="(tag, tagIndex) in video.tags" 
							:key="tagIndex" 
							class="video-tag"
						>{{ tag }}</text>
					</view>
				</view>
			</view>
			<view class="video-actions">
				<view class="action-button" @click="handleMoreSource">
					<text class="action-icon">⊕</text>
					<text class="action-text">更多片源</text>
				</view>
				<view class="action-button" @click="handleRefreshVideos">
					<text class="action-icon">⟳</text>
					<text class="action-text">换一换</text>
				</view>
			</view>
		</view>
		<view class="video-section horizontal-scroll-section">
			<view class="section-header">
				<view class="header-left">
					<view class="title-badge"></view>
					<text class="section-title">热门精选</text>
				</view>
			</view>
			<scroll-view scroll-x class="horizontal-scroll-container">
				<view 
					v-for="(video, index) in horizontalVideoList" 
					:key="index" 
					class="horizontal-video-card"
					@click="handleVideoClick(video)"
				>
					<view class="video-cover">
						<image :src="video.cover" mode="aspectFill" class="cover-image" />
						<view class="video-overlay">
							<view class="play-icon">▶</view>
						</view>
						<text class="play-count">{{ video.playCount }}</text>
						<text class="video-duration">{{ video.duration }}</text>
					</view>
					<text class="video-title">{{ video.title }}</text>
					<view class="video-tags">
						<text 
							v-for="(tag, tagIndex) in video.tags" 
							:key="tagIndex" 
							class="video-tag"
						>{{ tag }}</text>
					</view>
				</view>
			</scroll-view>
		</view>
		<view class="video-section left-image-section">
			<view class="section-header">
				<view class="header-left">
					<view class="title-badge"></view>
					<text class="section-title">最新上线</text>
				</view>
			</view>
			<view class="left-image-container">
				<view 
					v-for="(video, index) in leftImageVideoList" 
					:key="index" 
					class="left-image-card"
					@click="handleVideoClick(video)"
				>
					<view class="left-video-cover">
						<image :src="video.cover" mode="aspectFill" class="left-cover-image" />
						<view class="left-video-overlay">
							<view class="left-play-icon">▶</view>
						</view>
						<text class="left-play-count">{{ video.playCount }}</text>
						<text class="left-video-duration">{{ video.duration }}</text>
					</view>
					<view class="left-video-info">
						<text class="left-video-title">{{ video.title }}</text>
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
		</view>
		<view class="video-section three-column-section">
			<view class="section-header">
				<view class="header-left">
					<view class="title-badge"></view>
					<text class="section-title">热门排行榜</text>
				</view>
			</view>
			<view class="three-column-container">
				<view 
					v-for="(video, index) in threeColumnVideoList" 
					:key="index" 
					class="three-column-card"
					@click="handleVideoClick(video)"
				>
					<view class="rank-number">{{ index + 1 }}</view>
					<view class="three-video-cover">
						<image :src="video.cover" mode="aspectFill" class="three-cover-image" />
					</view>
					<view class="three-video-info">
						<text class="three-video-title">{{ video.title }}</text>
						<text class="three-video-count">{{ video.playCount }}次</text>
					</view>
				</view>
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
							v-for="(item, index) in categoryList" 
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
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeTab: 0,
				currentBanner: 0,
				showDrawer: false,
				tabs: [
					{ name: '推荐', icon: '' },
					{ name: '最新', icon: '' },
					{ name: '色图', icon: '' },
					{ name: '福利姬', icon: '' },
					{ name: '探花大神', icon: '' },
					{ name: '国产大工厂', icon: '🔥' },
					{ name: '', icon: '🇯🇵' },
				],
				bannerList: [
					{
						image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20portrait%20artistic%20photography&image_size=landscape_16_9',
						title: '精选推荐',
						desc: '每日精选内容'
					},
					{
						image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20fashion%20model%20portrait&image_size=landscape_16_9',
						title: '热门精选',
						desc: '最受欢迎的内容'
					},
					{
						image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20asian%20woman%20portrait%20soft%20lighting&image_size=landscape_16_9',
						title: '精彩集锦',
						desc: '不容错过的精彩'
					}
				],
				gridList: [
					{ name: '美女写真', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20portrait%20icon&image_size=square' },
					{ name: '明星网红', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=celebrity%20star%20icon&image_size=square' },
					{ name: '制服诱惑', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=uniform%20cosplay%20icon&image_size=square' },
					{ name: '街拍女神', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=street%20fashion%20photography%20icon&image_size=square' },
					{ name: '私房照', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=private%20photo%20elegant%20icon&image_size=square' },
					{ name: '网红直播', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=live%20streaming%20beauty%20icon&image_size=square' },
					{ name: '自拍达人', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=selfie%20beautiful%20icon&image_size=square' },
					{ name: '模特走秀', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=fashion%20model%20catwalk%20icon&image_size=square' },
					{ name: '情趣内衣', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=lingerie%20fashion%20icon&image_size=square' },
					{ name: '性感热舞', image: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=dance%20sexy%20icon&image_size=square' }
				],
				videoList: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20asian%20woman%20video%20cover%20artistic&image_size=portrait_4_3',
						title: '高颜值美女私房写真',
						playCount: '5.2万',
						duration: '06:32',
						tags: ['HD', '超清']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20fashion%20video%20cover&image_size=portrait_4_3',
						title: '性感模特内衣秀',
						playCount: '2.0万',
						duration: '08:15',
						tags: ['模特', '高清']
					}
				],
				secondVideoList: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20living%20room%20video%20cover&image_size=portrait_4_3',
						title: '【秦雄全国探花】大神回第二場，熟悉的配方，極品外圍小姐姐，帥哥美女激...',
						playCount: '8.3萬',
						duration: '01:33:36',
						tags: ['打飞机', '美乳', '美女尤物', '国产']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20pink%20dress%20video%20cover&image_size=portrait_4_3',
						title: '【太子极品探花】現代版的黑裙少婦，穿上情趣裝沙發上幹後猛...',
						playCount: '2.0萬',
						duration: '00:42:40',
						tags: ['美女尤物', '贵族', '母狗式', '裙子']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20woman%20sofa%20video%20cover&image_size=portrait_4_3',
						title: '【北寻花】高颜值長相甜美萌妹啪啪，連喘情緒超帶墻口交後入猛...',
						playCount: '2.5萬',
						duration: '00:25:12',
						tags: ['二次元/萌妹', '高挑', '网袜', '美女尤物']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=couple%20sofa%20intimate%20video%20cover&image_size=portrait_4_3',
						title: '素人打野\毒浓探花老嫖带你探外围，完美视角拍攝起来超浪，极品牛仔裙...',
						playCount: '3.7萬',
						duration: '01:16:05',
						tags: ['自慰', '打飞机', '美女尤物', '牛仔裤']
					}
				],
				categoryList: [
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
				],
				horizontalVideoList: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20woman%20bedroom%20video%20cover&image_size=portrait_4_3',
						title: '美女主播热舞直播精选',
						playCount: '12.5萬',
						duration: '00:35:20',
						tags: ['热舞', '直播', '美女']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=asian%20woman%20office%20video%20cover&image_size=portrait_4_3',
						title: '办公室OL制服诱惑',
						playCount: '8.3萬',
						duration: '00:28:45',
						tags: ['制服', 'OL', '办公室']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20girl%20swimsuit%20video%20cover&image_size=portrait_4_3',
						title: '泳池比基尼美女合集',
						playCount: '15.2萬',
						duration: '00:42:15',
						tags: ['比基尼', '泳池', '美腿']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=model%20lingerie%20fashion%20video%20cover&image_size=portrait_4_3',
						title: '内衣模特走秀精选',
						playCount: '6.8萬',
						duration: '00:31:30',
						tags: ['模特', '内衣', '走秀']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=cosplay%20girl%20anime%20video%20cover&image_size=portrait_4_3',
						title: 'Cosplay二次元美女',
						playCount: '9.1萬',
						duration: '00:25:10',
						tags: ['Cosplay', '二次元', '萌妹']
					}
				],
				leftImageVideoList: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=elegant%20woman%20red%20dress%20video%20cover&image_size=portrait_4_3',
						title: '【极品探花】顶级外围女神颜值爆表',
						playCount: '18.6萬',
						duration: '01:12:45',
						tags: ['探花', '极品', '外围']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=sexy%20couple%20intimate%20video%20cover&image_size=portrait_4_3',
						title: '【富二代约会】重金约网红嫩模',
						playCount: '25.3萬',
						duration: '00:55:30',
						tags: ['约会', '网红', '嫩模']
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=beautiful%20wife%20domestic%20video%20cover&image_size=portrait_4_3',
						title: '【国产精品】人妻少妇寂寞难耐',
						playCount: '32.1萬',
						duration: '01:08:20',
						tags: ['国产', '人妻', '少妇']
					}
				],
				threeColumnVideoList: [
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%201&image_size=portrait_4_3',
						title: '【全国探花】长腿空姐酒店约炮',
						playCount: '85.6萬'
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%202&image_size=portrait_4_3',
						title: '【国产AV】大胸美女激情演绎',
						playCount: '72.3萬'
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%203&image_size=portrait_4_3',
						title: '【精品推荐】极品嫩模完美身材',
						playCount: '68.9萬'
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%204&image_size=portrait_4_3',
						title: '【真实自拍】90后小情侣酒店',
						playCount: '61.2萬'
					},
					{
						cover: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=popular%20video%20thumbnail%205&image_size=portrait_4_3',
						title: '【高端会所】极品外围女技师',
						playCount: '55.8萬'
					}
				]
			}
		},
		methods: {
			switchTab(index) {
				this.activeTab = index
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
				uni.showToast({ title: `点击了${item.name}`, icon: 'none' })
			},
			handleMore() {
				uni.showToast({ title: '查看更多', icon: 'none' })
			},
			handleVideoClick(video) {
				uni.showToast({ title: `播放: ${video.title}`, icon: 'none' })
			},
			openCategoryDrawer() {
				this.showDrawer = true
			},
			closeCategoryDrawer() {
				this.showDrawer = false
			},
			handleCategoryClick(item) {
				this.showDrawer = false
				uni.showToast({ title: `选择了: ${item.name}`, icon: 'none' })
			},
			handleMoreSource() {
				uni.showToast({ title: '查看更多片源', icon: 'none' })
			},
			handleRefreshVideos() {
				uni.showToast({ title: '换一换中...', icon: 'loading' })
				setTimeout(() => {
					this.secondVideoList = this.secondVideoList.sort(() => Math.random() - 0.5)
				}, 500)
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page {
		min-height: 100vh;
		background-color: #1a1a2e;
		padding-bottom: 98rpx;
	}
	
	.top-header {
		background-color: #16213e;
		padding: 0 20rpx 20rpx;
	}
	
	.tabs-scroll {
		white-space: nowrap;
		padding: 20rpx 0;
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
		
		.tab-icon {
			font-size: 24rpx;
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
		gap: 20rpx;
	}
	
	.video-card {
		flex: 1;
		display: flex;
		flex-direction: column;
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
		color: #ffd700;
		background-color: rgba(255, 215, 0, 0.15);
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
		margin-left: 10rpx;
		vertical-align: middle;
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
		color: #ffd700;
		background-color: rgba(255, 215, 0, 0.15);
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
</style>
