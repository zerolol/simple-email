const path = require('path');

function resolve(dir) {
  return path.join(__dirname, './', dir);
}

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/zy' : '/',
  assetsDir: 'static',
  devServer: {
    port: '3000',
    proxy: {
      '/email': {
        target: 'http://127.0.0.1:9527/',
        changeOrigin: true,
        ws: true,
        pathRewrite: {},
      },
    },
  },
  chainWebpack: (config) => {
    // 别名配置
    config.resolve.alias
      .set('@', resolve('src'));

    // 这里是对环境的配置，不同环境对应不同的BASE_URL，以便axios的请求地址不同
    config.plugin('define').tap((args) => {
      args[0]['process.env'].BASE_URL = JSON.stringify(process.env.BASE_URL);
      return args;
    });
  },
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/assets/css/variables.scss` 这个文件
        // eslint-disable-next-line quotes
        prependData: `@import "~@/styles/variables.sass"`,
      },
    },
  },
};
