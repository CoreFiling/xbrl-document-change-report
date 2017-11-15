const path = require('path');

process.env.NODE_ENV = 'test';
const webpackConfig = require('./webpack.config');

// Karma configuration here:
module.exports = (config) => {
  config.set({
    logLevel: config.LOG_INFO,
    port: 3334,
    browsers: ['ChromeCustom'],
    customLaunchers: {
      ChromeCustom: {
        base: 'ChromeHeadless',
        flags: ['--no-sandbox'],
        debug: false
      },
    },
    concurrency: Infinity,
    singleRun: true, //just run once by default
    frameworks: ['jasmine'], //use jasmine as framework
    files: [
      'karma.tests.js' //test files
    ],
    preprocessors: {
      'karma.tests.js': ['webpack', 'sourcemap'] //preprocess with webpack and sourcemap loader
    },
    reporters: ['dots'], //report results in this format
    webpack: webpackConfig,
    webpackMiddleware: {
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: true,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: false,
        warnings: true,
        publicPath: false
      },
    },
  });
};
