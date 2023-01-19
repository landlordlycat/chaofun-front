// vue.config.js
const path = require("path");
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const resolve = dir => {
  return path.join(__dirname, dir);
};

const port = process.env.port || process.env.npm_config_port || 8099
const isProduction = process.env.NODE_ENV === 'production';

// 线上打包路径，请根据项目实际线上情况
const BASE_URL = process.env.NODE_ENV === "production" ? "https://s.chao-fan.com/" : "/";
// const BASE_URL =  "/";
// const BASE_URL = "/";
const fs = require('fs');

// directory to check if exists
const dirweb = './src/views/chaofun-webview';

// check if directory exists
process.env.VUE_APP_BASE_WEB = fs.existsSync(dirweb);
const Timestamp = new Date().getTime();

module.exports = {
  publicPath: BASE_URL,
  outputDir: "dist", // 打包生成的生产环境构建文件的目录
  assetsDir: "", // 放置生成的静态资源路径，默认在outputDir
  indexPath: "index.html", // 指定生成的 index.html 输入路径，默认outputDir
  pages: {
    index: {
      entry: './src/main.js',
      template: './public/index.html',
      filename: 'index.html',
      // chunks: ['index']
    },
    tuxunPage: {
      entry: './src/tuxun.main.js',
      template: './public/tuxunPage.html',
      filename: 'tuxunPage.html',
      // chunks: ['tuxun']
    }

  }, // 构建多页
  productionSourceMap: false, // 开启 生产环境的 source map
  // css:  config => {
  //   config.extract.chunkFilename = `[name].33${Timestamp}.css`;
  // },
  configureWebpack: config => {
    config.performance = {
      hints: false
    };
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        chunks: ['index']
      }),
      new HtmlWebpackPlugin({
        filename: 'tuxunPage.html',
        chunks: ['tuxunPage']
      }),
    ],
    config.output.filename = `[name].11${Timestamp}.js`;
    config.output.chunkFilename = `[name].22${Timestamp}.js`;
  },
  chainWebpack: config => {

    // 配置路径别名
    config.resolve.alias
      .set("@", resolve("src"))
      .set("_c", resolve("src/components"));
    // set svg-sprite-loader
    config.module.rule('svg').exclude.add(resolve('src/icons')).end();
    config.module.rule('icons').test(/\.svg$/).include.add(resolve('src/icons')).end().use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })
      .end();
      config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true
        return options
      })
      .end()

    config
    // https://webpack.js.org/configuration/devtool/#development
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

      /** add */
      // 生产环境配置
    if (isProduction) {
      // 删除预加载
      config.plugins.delete('preload');
      config.plugins.delete('prefetch');
      // 删除多余moment语言包
      config.plugin("ignore")
        .use(
          new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn$/)
        );

      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码
      // config.optimization.splitChunks({
      //   chunks: 'all',
      //   minSize: 20000,
      //   maxSize: 400000,
      // })
      // 生产环境注入cdn
      // config.plugin('html')
      //   .tap(args => {
      //     args[0].cdn = cdn;
      //     return args;
      //   });
    }
  },
  css: {
    extract: {
      filename: `[name].33${Timestamp}.css`,
      chunkFilename: `[name].33${Timestamp}.css`,
    },
    requireModuleExtension: true, // 启用 CSS modules
    // extract: true, // 是否使用css分离插件
    sourceMap: false, // 开启 CSS source maps?
    // css预设器配置项
    loaderOptions: {
      //pass options to sass-loader
      sass: {
        //引入全局变量样式
        // data: `@import "@/assets/common/index.sass"`
        prependData: `@import "~@/styles/variables.scss";`
      },
      postcss: {
        plugins: [

        ]
      }
    }
  },

  // 反向代理的配置
  devServer: {
    host: "0.0.0.0", // ip
    port: port, // 端口
    proxy: {
      '/api':{
        // target: `http://localhost:8080/api`,
        target: `https://choa.fun/api`,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
      '/ws': {
        // target: `ws://localhost:8080/ws`,
        target: `wss://choa.fun/ws`,
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/ws': ''
        }
      }
    },
  }
};

