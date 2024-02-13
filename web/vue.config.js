const path = require('path')
const webpack = require('webpack')
// 在vue-config.js 中加入
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const isProduction = process.env.NODE_ENV === 'production'
const friendLog = require('friendly-errors-webpack-plugin')
const WorkboxPlugin = require('workbox-webpack-plugin')

const resolve = dir => {
  return path.resolve(__dirname, dir)
}

let baseUrl = '/'
module.exports = {
  publicPath: baseUrl,
  lintOnSave: false,

  chainWebpack: config => {
    // 移除prefetch和preload
    // config.plugins.delete('prefetch')
    // config.plugins.delete('preload')

    config.externals({})
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, {limit: 1})) // 这里 limit 如果配置为 0 反而是会把所谓图片转为 base64，所以配置为 1

    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set('_c', resolve('src/components'))

    // config.module
    //   .rule('vue')
    //   .use('iview-loader')
    //   .loader('iview-loader')
    //   .options({
    //     prefix: false
    //   })
    //   .end()

    config.module
      .rule('url-loader')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 1,
        name: '[name].[hash:7].[ext]'
      })
      .end()

    // if(isProduction) {
    //   config
    //     .plugin('webpack-bundle-analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
    // }

  },
  configureWebpack: (config) => {
    config.devtool = 'none'
    if (isProduction) {
      // 开启gzip压缩
      config.plugins.push(new CompressionWebpackPlugin({
        filename: '[file].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.woff$|\.woff2$|\.svg$|\.ttf$|\.html$|\.json$|\.css$/,
        threshold: 5120,
        minRatio: 0.8
      }))
      config.optimization = {
        namedChunks: true,
        splitChunks: {
          minSize: 500000, // 单个文件的最小size
          maxSize: 1000000, // 单个文件最大的size
          minChunks: 2, // 最小被引用
          maxAsyncRequests: 5, // 首页加载资源
          maxInitialRequests: 3,
          enforceSizeThreshold: 200000,
          automaticNameDelimiter: '~', // 打包文件自定义的链接符
          name: true,
          chunks: 'all', // initial(初始块)、async(按需加载块)、all(默认，全部块)
          // 这里需要注意的是如果使用initial 会将首页需要的依赖和项目本身的依赖打包2次增大文件体积
          cacheGroups: {
            default: false,
            vendor: {
              test(module) {
                let path = module.resource
                if (!path) return true
                path = path.replace(/\\/g, '/')
                let isNeed = path &&
                  /node_modules/.test(path)
                if (!isNeed && path.indexOf('node_modules') > -1) {
                  console.log('vendor not need::', path, isNeed)
                }
                return isNeed
              },
              name: "vendors",
              priority: 10,
              enforce: true
            },
            vue: {
              test(module) {
                let path = module.resource
                if (!path) return false
                path = path.replace(/\\/g, '/')
                // return path && path.indexOf('node_modules') > -1 && path.indexOf('vuetify') > -1
                return path && /node_modules\/vue/.test(path)
              },
              name: "vuetify",
              priority: 9,
              enforce: true
            },
            echarts: {
              // test: (/node_modules/ && /muse\n*/),
              test(module) {
                let path = module.resource
                if (!path) return false
                path = path.replace(/\\/g, '/')
                return path && /node_modules\/echarts\n*/.test(path)
              },
              name: "echarts",
              priority: 8,
              enforce: true
            },
            common: {
              name: "chunk-common",
              minChunks: 2,
              priority: 7,
              reuseExistingChunk: true,
              minSize: 30000
            }
          }
        },
      }
      config.plugins.push(
        new TerserPlugin({
          cache: true,
          sourceMap: false,
          // 多进程
          parallel: true,
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'], // 移除console
            },
          },
        })
      )
      config.plugins.push(new friendLog())

      config.performance = {
        maxEntrypointSize: 2000000,
        maxAssetSize: 500000,
      }
      config.plugins.push(
        ...[
          // new webpack.optimize.LimitChunkCountPlugin({
          //   maxChunks: 10, // 必须大于或等于 1
          // }),
          new webpack.optimize.MinChunkSizePlugin({
            minChunkSize: 30000 // Minimum number of characters
          }),
          new WorkboxPlugin.GenerateSW({
            // 这些选项帮助快速启用 ServiceWorkers
            // 不允许遗留任何“旧的” ServiceWorkers
            clientsClaim: true,
            skipWaiting: true
          })
        ]
      )
    }
  },
  outputDir: `../node/webpages_back/`,
  crossorigin: 'anonymous',
  productionSourceMap: false,
  css: {
    extract: true,
    sourceMap: false,
    requireModuleExtension: true,
    loaderOptions: {
      less: {
        // 若 less-loader 版本小于 6.0，请移除 lessOptions 这一级，直接配置选项。
        modifyVars: {
          // 直接覆盖变量
          // 'text-color': '#111',
          // 'border-color': '#eee',
          // 或者可以通过 less 文件覆盖（文件路径为绝对路径）
          hack: `true; @import "${resolve('src/styles/my-vant-style.less')}";`,
        },
      },
    },
  },
  devServer: {
    // open: true,
    host: 'dev.wpkqz.com',
    port: 8001,
    https: true,
    inline: true,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://dev.wpkqz.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api'
        }
      },
      '/wss': {
        target: 'http://dev.wpkqz.com:4901',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/wss': '/wss',
        }
      }
    }
  },
  parallel: require('os').cpus().length > 1,
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, 'src/styles/index.less')]
    }
  }
}
