module.exports = {
  transpileDependencies: ['uview-ui'],
  devServer: {
    proxy: {
      '/api': {
        target: 'https://admin.buenmtdnet.xyz',
        changeOrigin: true,
        secure: true
      }
    }
  }
}
