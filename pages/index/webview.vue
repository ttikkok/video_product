<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="uri"></web-view>
  </view>
</template>

<script>
var wv;
export default {
  data() {
    return {
      uri: "",
      webviewStyles: {
        progress: {
          color: "#FF3333",
        },
      },
    };
  },
  onLoad(option) {
    this.uri = decodeURIComponent(option.uri);
    // this.openurl()
    this.getWebviewPage()
  },
  methods: {
    getWebviewPage() {
      //设置 webview 界面的状态栏的 title
      uni.setNavigationBarTitle({
        title: this.$t('客服'),
      });
    },
  },
  onBackPress() {
    // console.log('返回了')
    // //获取页面栈的长度
    // const canNavBack = getCurrentPages()
    // //判断是否刷新了浏览器，刷新了浏览器，页面栈只有当前一个
    // if (canNavBack && canNavBack.length > 1) {
    //   uni.navigateBack({
    //     delta: 1
    //   })
    // } else {
    //   history.back()
    // }
    uni.switchTab({
      url: '/pages/index/index'
    })
  }
};
</script>

<style>
</style>
