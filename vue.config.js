// 引入插件
var ImageminPlugin = require('imagemin-webpack-plugin').default
module.exports = {
  publicPath: './',

  devServer: {
    open: true, // 是否自动弹出浏览器页面
    host: 'localhost',
    port: '8081',
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://ht.idealead.hbindex.com/api', // API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/testApi': {
        target: '//ht.idealead.hbindex.com/apii', // API测试服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/testApi': ''
        }
      }
    }
  },

  lintOnSave: true,

  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // config.optimization.minimizer[0].options.terserOptions.compress.warnings = false
      config.optimization.minimizer[0].options.terserOptions.compress.drop_console = true
      config.optimization.minimizer[0].options.terserOptions.compress.drop_debugger = true
      config.optimization.minimizer[0].options.terserOptions.compress.pure_funcs = ['console.log']
      // 压缩图片
      config.plugins.push(new ImageminPlugin({
        pngquant: {// 图片质量
          quality: '95-100'
        }
      }))
    }
  }
}
