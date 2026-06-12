<!-- 顶部组件 -->
<template>
	<view>
		<view class="index-5" :class="isSticky ? 'position-sticky' : 'position-fixed'" :style="{paddingTop: `${statusHeight}px`}">
			<view class="top top-0 index-1"
				:style="{height: `${navbarHeight}px`, borderBottom: borderBottom ? '1rpx solid #f5f5f5' : 'none'}">
				<view :style="{backgroundColor: bgColor}" class="tabbar d-flex j-center a-center position-relative">
					<template>
						<view v-if="!isTab" class="tabbar-back d-flex j-center a-center p-1">
							<u-icon v-if="isLogin" @click="getHome" name="arrow-left" :color="iconColor" size="18"></u-icon>
							<u-icon v-else @click="back" name="arrow-left" :color="iconColor" size="18"></u-icon>
						</view>
						<view v-if="isHome" class="tabbar-back d-flex j-center a-center p-1">
							<u-icon @click="toMine" name="/static/images/ic_user.png" color="#000" size="24"></u-icon>
						</view>
						<view class="tabbar-title" :style="{color: textColor}">
							{{ i18n ? $t(value) : value }}
						</view>
					</template>
					<!-- <view v-if="isLang" class="tabbar-locale d-flex j-center a-center" @click="selectLang">
						<text style="color: #000;margin-right: 10rpx;">{{ lang }}</text>
						<u-icon name="/static/images/earth.png" size="20" color="#000"></u-icon>
					</view> -->
					<view v-if="isStar" class="tabbar-locale d-flex j-center a-center" @click="getStar">
						<u-icon name="star" v-if="!isCollect" size="20" color="#828a99"></u-icon>
						<u-icon name="star-fill" v-else size="20" color="#6666ff"></u-icon>
					</view>
					<view v-if="isNotice" class="tabbar-locale d-flex j-center a-center" @click="getNotice">
						<u-icon name="bell" size="20" color="#333333"></u-icon>
						<u-badge v-if="total > 0" isDot absolute :offset="[0, 0]" bgColor="#F53F3F"></u-badge>
					</view>
					<view v-if="isRecharge" class="tabbar-locale d-flex j-center a-center" @click="getRecord">
						<text>{{ $t('记录') }}</text>
					</view>
					<view v-if="isOptionChart" class="tabbar-locale d-flex j-center a-center" @click="getOptionChart">
						<u-icon name="list-dot" size="20" color="#6666ff"></u-icon>
					</view>
					<view v-if="isFundRecord" class="tabbar-locale d-flex j-center a-center" @click="getFundRecord">
						<u-icon name="order" size="22" bold color="#333333"></u-icon>
					</view>
				</view>
			</view>
		</view>
		<u-picker :show="show" :columns="columns" :defaultIndex="defaultIndex" :confirmText="$t('确定')" :cancelText="$t('取消')" keyName="name" @confirm="confirm" @cancel="show = false"></u-picker>
	</view>
</template>

<script>
	// import { myNotifiablesCount } from "@/api/user";
	import langList from './data.json';
	export default {
		name: "top-bar",
		props: {
			value: {
				type: String,
				default: ''
			},
			isStatus: {
				type: Boolean,
				default: true
			},
			isLang: {
				type: Boolean,
				default: false
			},
			isStar: {
				type: Boolean,
				default: false
			},
			isCollect: {
				type: Boolean,
				default: false
			},
			isNotice: {
				type: Boolean,
				default: false
			},
			isRecharge: {
				type: Boolean,
				default: false
			},
			isOptionChart: {
				type: Boolean,
				default: false
			},
			isFundRecord: {
				type: Boolean,
				default: false
			},
			borderBottom: {
				type: Boolean,
				default: true
			},
			isTab: {
				type: Boolean,
				default: false
			},
			isHome: {
				type: Boolean,
				default: false
			},
			isLogin: {
				type: Boolean,
				default: false
			},
			bgColor: {
				type: String,
				default: '#fff'
			},
			iconColor: {
				type: String,
				default: '#333333'
			},
			textColor: {
				type: String,
				default: '#000'
			},
			i18n: {
				type: Boolean,
				default: false
			},
			isSticky: {
				type: Boolean,
				default: true
			}
		},
		data() {
			return {
				statusHeight: 0,
				navbarHeight: 0,

				lang: 'English',
				token: uni.getStorageSync('token'),
				userInfo: {},
				show: false,
				columns: [],
				defaultIndex: [],
				total: 0
			};
		},
		created() {
			this.columns = Object.values(langList)
			this.statusHeight = this.$store.state.statusHeight
			this.navbarHeight = this.$store.state.navbarHeight
			this.userInfo = uni.getStorageSync('userInfo') ? JSON.parse(uni.getStorageSync('userInfo')) : {}
			this.columns[0].forEach((element,index) => {
				if (element.value == uni.getStorageSync('lang')) {
					this.lang = element.name || 'English'
					this.defaultIndex = [index]
				}
			});

			// if (this.token) {
			// 	myNotifiablesCount({
			// 		token: this.token
			// 	}).then(res => {
			// 		if (res.code == 200) {
			// 			this.total = res.data.total
			// 		}
			// 	})
			// }
		},
		methods: {
			selectLang() {
				this.show = true
			},
			toMine() {
				this.$emit('toMine')
			},
			getStar() {
				this.$emit('getStar')
			},
			getNotice() {
				this.$emit('getNotice')
			},
			getRecord() {
				this.$emit('getRecord')
			},
			getOptionChart() {
				this.$emit('getOptionChart')
			},
			getFundRecord() {
				this.$emit('getFundRecord')
			},
			confirm(e) {
				let lang = e.value[0].value
				this.lang = e.value[0].name
				this.$i18n.locale = lang
				uni.setLocale(lang)
				uni.setStorageSync('lang', lang)
				this.show = false
				location.reload()
			},
			back() {
				// uni.navigateBack({
				// 	delta: 1
				// })
				//获取页面栈的长度
				const canNavBack = getCurrentPages()
				//判断是否刷新了浏览器，刷新了浏览器，页面栈只有当前一个
				if (canNavBack && canNavBack.length > 1) {
					uni.navigateBack({
						delta: 1
					})
				} else {
					history.back()
				}
			},
			getHome() {
				uni.switchTab({
					url: '/pages/index/index',
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	// /deep/ .u-popup__content {
	// 	background-color: #19473d;
	// 	padding: 0 !important;
	// 	.u-modal__title {
	// 		color: #fff;
	// 	}
	// 	.u-modal__button-group__wrapper--hover {
	// 		background-color: transparent;
	// 	}
	// }
	.top {
		width: 100vw;
		// border-radius: 8rpx;
		overflow: hidden;

		.tabbar {
			height: 100%;
			width: 100%;

			.tabbar-title {
				// font-size: 28rpx;
				font-weight: 500;
				font-size: 32rpx;
				// font-family: Arial, Arial;
				// font-weight: bold;
				color: #000000;
				// margin-left: 20rpx;
			}

			.tabbar-locale {
				position: absolute;
				right: 20rpx;
				top: 50%;
				transform: translateY(-50%);
				// width: 60rpx;
				// height: 60rpx;

				img {
					width: 60rpx;
				}
			}

			.tabbar-back {
				position: absolute;
				left: 15rpx;
				top: 50%;
				transform: translateY(-50%);

				img {
					width: 60rpx;
				}
			}
		}
	}
</style>