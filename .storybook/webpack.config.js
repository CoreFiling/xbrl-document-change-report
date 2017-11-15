// you can use this file to add your custom webpack plugins, loaders and anything you like.
// This is just the basic way to add additional webpack configurations.
// For more information refer the docs: https://storybook.js.org/configurations/custom-webpack-config

// IMPORTANT
// When you add this file, we won't add the default configurations which is similar
// to "React Create App". This only has babel loader to load JavaScript.

const path = require('path');

const SRC_PATH = path.join(__dirname, '../src');

module.exports = {
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less', '.css', '.json'],
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        include: SRC_PATH,
        loaders: 'tslint-loader',
      },
      {
        test: /\.tsx?$/,
        include: SRC_PATH,
        use: [{ loader: 'awesome-typescript-loader', options: { useCache: true, useBabel: true } }],
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      { test: /\.(jpg|png|gif)$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.svg$/, loader: 'file-loader?name=[name].[ext]?[hash:6]' },
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: 'url-loader?mimetype=application/font-woff' },
      { test: /\.(ttf|eot)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader?name=[name].[ext]?[hash:6]' },
      { test: /\.json$/, loader: 'json-loader' },
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [],
};
