module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      rootValue: (module) => {
        if (/vant/gi.test(module.file)) {
          return 37.5
        } else {
          return 75
        }
      },
      propList: ['*']
    }
  }
}
