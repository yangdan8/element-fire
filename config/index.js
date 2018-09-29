// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')
var { url } = require('./url')
module.exports = {
  build: {
    env: require('./prod.env'),
    app: path.resolve(__dirname, '../../webapp/index.html'),
    assetsRoot: path.resolve(__dirname, '../../webapp'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 3000,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',

    proxyTable: {
      '/sys/': {
        target: url,
        changeOrigin: true,
        secure:false  // 如果是https接口，需要配置这个参数
      },
      '/sysbase/': {
        target: url,
        changeOrigin: true,
        secure:false  // 如果是https接口，需要配置这个参数
      },
      '/demo/': {
        target: url,
        changeOrigin: true,
        secure:false
      },
      '/activiti/': {
        target: url,
        changeOrigin: true,
        secure:false
      },
      '/code/': {
        target: url,
        changeOrigin: true,
        secure:false
      },
      '/codetest/': {
        target: url,
        changeOrigin: true,
        secure:false
      },
      '/staticUpload/': {
        target: url,
        changeOrigin: true,
        secure:false
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
