'use strict'
const path = require('path')
const UnpluginVueComponentsWebpack = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
// use fs to get certificates files
// const fs = require('fs')

const defaultSettings = require('./src/settings.js')

function resolve(dir) {
  return path.join(__dirname, dir)
}

const name = defaultSettings.title || 'Adempiere Vue' // page title

// If your port is set to 80
// use administrator privileges to execute the command line.
// For example, Mac: sudo npm run
// You can change the port by the following method:
// port = 9527 npm run dev OR npm run dev --port = 9527
const port = process.env.port || process.env.npm_config_port || 9527 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  /**
   * You will need to set publicPath if you plan to deploy your site under a sub path,
   * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
   * then publicPath should be set to "/bar/".
   * In most cases please use '/' !!!
   * Detail: https://cli.vuejs.org/config/#publicpath
   */
  // baseUrl: '/',
  outputDir: 'dist',
  runtimeCompiler: true,
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    public: `0.0.0.0:${port}`,
    // uncomment to enable tls/ssl with the paths to the certificates
    // https: {
    //   key: fs.readFileSync('./certs/localhost.key'),
    //   cert: fs.readFileSync('./certs/localhost.crt')
    // },
    hot: true,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    before: require('./mock/mock-server.js')
  },
  configureWebpack: {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    name: name,
    resolve: {
      alias: {
        '@': resolve('src')
      }
    },
    plugins: [
      // 按需引入Element-plus
      UnpluginVueComponentsWebpack({
        resolvers: [ElementPlusResolver()]
      })
    ]
  },
  chainWebpack: (config) => {
    if (process.env.NODE_ENV === 'production') {
      const analyzer = new BundleAnalyzerPlugin({
        analyzerPort: 9999
      })
      config.plugin('webpack-bundle-analyzer').use(analyzer)
    }
    // it can improve the speed of the first screen, it is recommended to turn on preload
    // it can improve the speed of the first screen, it is recommended to turn on preload
    config.plugin('preload').tap(() => [
      {
        rel: 'preload',
        // to ignore runtime.js
        // https://github.com/vuejs/vue-cli/blob/dev/packages/@vue/cli-service/lib/config/app.js#L171
        fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
        include: 'initial'
      }
    ])

    // when there are many pages, it will cause too many meaningless requests
    config.plugins.delete('prefetch')

    // set svg-sprite-loader
    config.module
      .rule('svg-smart')
      .test(/\.svg$/)
      .include.add(resolve('src/assets/icon'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: '[name]'
      })
      config.optimization.splitChunks({
        // Optimization blocks: all-all async-asynchronous initial-synchronous
        chunks: 'all',
        // The maximum number of parallel requests when loading on demand.
        maxAsyncRequests: 30,
        // The maximum number of parallel requests for the entry point.
        maxInitialRequests: 30,
        // The minimum number of times a module must be shared between blocks before splitting.
        minChunks: 1,
        // Prevent exposing path information when creating names for sections split by maxSize.
        hidePathInfo: true,
        // The minimum size (in bytes) of the block to be generated.
        minSize: 30000,
        // maxSize: 50000,
        name: true,
        cacheGroups: {
          apis: {
            // Overriding file names is only allowed when it is the initial block
            name: 'chunk-apis',
            // Controls which modules are selected for this cache group
            test: resolve('src/apis'),
            // The minimum number of times a module must be shared between blocks before splitting.
            minChunks: 1,
            // Priority
            priority: 10,
            // If the current block contains a module that has been detached from the main package, it will be reused instead of generating a new one.
            reuseExistingChunk: true
          },
          // components: {
          //   name: 'chunk-components',
          //   test: resolve('src/components'),
          //   minChunks: 1,
          //   priority: 10,
          //   reuseExistingChunk: true
          // },
          quill: {
            name: 'chunk-quill',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?quill(.*)/
          },
          elementPlus: {
            name: 'chunk-elementPlus',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?element-plus(.*)/
          },
          elementIcon: {
            name: 'chunk-elementIcon',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?@element-plus(.*)/
          },
          echarts: {
            name: 'chunk-echarts',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?echarts(.*)/
          },
          libs: {
            name: 'chunk-libs',
            test: /[\\/]node_modules[\\/]/,
            priority: 5,
            chunks: 'initial'
          }
        }
      })
      config.plugins.delete('prefetch')
    // config.module
    //   .rule('svg')
    //   .exclude.add(resolve('src/icons'))
    //   .end()
    // config.module
    //   .rule('icons')
    //   .test(/\.svg$/)
    //   .include.add(resolve('src/icons'))
    //   .end()
    //   .use('svg-sprite-loader')
    //   .loader('svg-sprite-loader')
    //   .options({
    //     symbolId: 'icon-[name]'
    //   })
    //   .end()

    // config
    //   .when(process.env.NODE_ENV !== 'development',
    //     config => {
    //       config
    //         .plugin('ScriptExtHtmlWebpackPlugin')
    //         .after('html')
    //         .use('script-ext-html-webpack-plugin', [{
    //         // `runtime` must same as runtimeChunk name. default is `runtime`
    //           inline: /runtime\..*\.js$/
    //         }])
    //         .end()
    //       config
    //         .optimization.splitChunks({
    //           chunks: 'all',
    //           cacheGroups: {
    //             libs: {
    //               name: 'chunk-libs',
    //               test: /[\\/]node_modules[\\/]/,
    //               priority: 10,
    //               chunks: 'initial' // only package third parties that are initially dependent
    //             },
    //             elementUI: {
    //               name: 'chunk-elementUI', // split elementUI into a single package
    //               priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
    //               test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
    //             },
    //             commons: {
    //               name: 'chunk-commons',
    //               test: resolve('src/components'), // can customize your rules
    //               minChunks: 3, //  minimum common number
    //               priority: 5,
    //               reuseExistingChunk: true
    //             }
    //           }
    //         })
    //       // https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
    //       config.optimization.runtimeChunk('single')
    //     }
    //   )
  }
}
