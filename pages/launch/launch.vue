<template>
  <view class="launch-container">
    <!-- 图片层：绝对定位重叠，通过 opacity 控制显隐 -->
    <image 
      v-for="(item, index) in imageList" 
      :key="index"
      class="bg-image" 
      :class="{ 'is-active': currentIndex === index }"
      :src="item.image"
    ></image>

    <!-- 底部信息区域 -->
    <view class="skip-btn">{{ loading ? '加载中' : (countdown + '秒') }}</view>
    <!-- <view class="footer-overlay">
      <text class="app-name">您的应用名称</text>
      <view class="countdown-box">
        <text class="countdown-text">{{ countdown }}s 后进入首页</text>
        <view class="progress-bar">
          <view class="progress-inner" :style="{ width: progress + '%' }"></view>
        </view>
      </view>
    </view> -->
  </view>
</template>

<script>
import { AdvertiseApi_advertise_list } from '@/api/home.js'

export default {
  data() {
    return {
      loading: true,
      imageList: [],
      currentIndex: 0,     // 当前显示的图片索引
      countdown: 5,        // 倒计时秒数
      totalDuration: 5000, // 总毫秒数
      imgTimer: null,      // 图片切换定时器
      countTimer: null,    // 倒计时定时器
      progress: 0          // 进度条百分比
    };
  },
  onLoad() {
    this.loading = true;
    AdvertiseApi_advertise_list({ name: '启动页广告位' }).then(res => {
      if (res && res.code === 1 && res.data && res.data.length > 0) {
        this.imageList = res.data
        this.loading = false
        this.initLaunch();
      }
    }).catch(err => {
      console.error('首页广告列表加载失败', err)
    })
  },
  onUnload() {
    // 页面销毁时清除所有定时器
    if (this.imgTimer) clearInterval(this.imgTimer);
    if (this.countTimer) clearInterval(this.countTimer);
  },
  methods: {
    initLaunch() {
      const count = this.imageList.length;
      // 计算每张图片停留的时间（例如 5000ms / 3张 ≈ 1666ms）
      const interval = Math.floor(this.totalDuration / count);

      // 1. 启动图片切换定时器
      this.imgTimer = setInterval(() => {
        this.currentIndex = (this.currentIndex + 1) % count;
      }, interval);

      // 2. 启动倒计时定时器（每秒执行一次）
      this.countTimer = setInterval(() => {
        this.countdown--;
        this.progress = ((5 - this.countdown) / 5) * 100;

        if (this.countdown <= 0) {
          this.goHome();
        }
      }, 1000);
    },
    goHome() {
      clearInterval(this.imgTimer);
      clearInterval(this.countTimer);
      uni.reLaunch({ url: '/pages/index/index' });
    }
  }
};
</script>

<style scoped>
.launch-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000; /* 防止图片加载前黑屏 */
  z-index: 9999;
}
.skip-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  border: none;
  border-radius: 5px;
  background: #000000b3;
  color: #fff;
  height: auto;
  padding: 10px 15px;
  font-size: 14px;
  line-height: 1;
  z-index: 3;
  cursor: pointer;
}

/* 核心：图片全屏重叠 */
.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0; /* 默认完全透明 */
  transition: opacity 0.8s ease-in-out; /* 0.8秒的平滑淡入淡出过渡 */
}

/* 当前激活的图片完全可见 */
.is-active {
  opacity: 1; 
}

/* 底部遮罩与信息 */
.footer-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding-bottom: 100rpx; /* 适配 iPhone 底部安全区 */
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
  z-index: 10; /* 确保文字在图片之上 */
}

.app-name {
  color: #fff;
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 30rpx;
}

.countdown-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
}

.countdown-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 24rpx;
  margin-bottom: 10rpx;
}

.progress-bar {
  width: 100%;
  height: 6rpx;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 3rpx;
  overflow: hidden;
}

.progress-inner {
  height: 100%;
  background-color: #ffcc00;
  transition: width 1s linear;
}
</style>