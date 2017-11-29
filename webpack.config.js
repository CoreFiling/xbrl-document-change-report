const fs = require('fs');
const path = require('path');
const url = require('url');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LicenseWebpackPlugin = require('license-webpack-plugin');
const awesomeTypescriptLoader = require('awesome-typescript-loader');

const srcPath = path.resolve(__dirname, 'src');
const buildPath = path.resolve(__dirname, 'www');
const isProd = process.env.NODE_ENV === 'production';
const isTest = process.env.NODE_ENV === 'test';
const isDev = !isProd && !isTest;
const extractCssPlugin = new ExtractTextPlugin({ filename: '[name].[contenthash].css', allChunks: true, disable: !isProd });

const appEntries = [path.resolve(srcPath, 'app', 'index.tsx')];
const tsxLoaders = [{ loader: 'awesome-typescript-loader', options: { useCache: true, useBabel: true } }];
if (isDev) {
  appEntries.unshift('react-hot-loader/patch');
  tsxLoaders.unshift({ loader: 'react-hot-loader/webpack' });
}

let config = {
  entry: {
    app: [
      'babel-polyfill',
      'isomorphic-fetch',
      ...appEntries,
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.less', '.css', '.json'],
  },
  output: {
    publicPath: '',
    path: buildPath,
    filename: '[name].[hash].js'
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        include: [
          path.resolve(srcPath, 'app'),
        ],
        loaders: 'tslint-loader',
      },
      {
        test: /\.tsx?$/,
        include: [
          path.resolve(srcPath, 'app'),
        ],
        use: tsxLoaders,
      },
      {
        test: /\.css$/,
        loader: extractCssPlugin.extract({
          use: [
            { loader: 'css-loader', options: { minimize: true } },
          ],
          fallback: 'style-loader',
        }),
      },
      {
        test: /\.less$/,
        loader: extractCssPlugin.extract({
          use: [
            { loader: 'css-loader', options: { minimize: true } },
            { loader: 'less-loader' },
          ],
          fallback: 'style-loader',
        }),
      },
      { test: /\.(jpg|png|gif)$/, loader: 'url-loader?mimetype=image/png' },
      { test: /\.svg$/, loader: 'file-loader?name=[name].[ext]?[hash:6]' },
      { test: /\.woff(2)?(\?v=[0-9].[0-9].[0-9])?$/, loader: 'url-loader?mimetype=application/font-woff' },
      { test: /\.(ttf|eot)(\?v=[0-9].[0-9].[0-9])?$/, loader: 'file-loader?name=[name].[ext]?[hash:6]' },
      { test: /\.json$/, loader: 'json-loader' },
      {
        test: /\.js$/,
        include: [
            /@cfl/
        ],
        loader: 'babel-loader',
      },
    ]
  },
  node: {
    fs: 'empty'
  },
  plugins: [...generatePlugins()],
};

if (isDev) {
  const devDir = path.resolve(__dirname, '.dev');
  const host = process.env.npm_package_config_devserver_host;
  const port = parseInt(process.env.npm_package_config_devserver_port, 10);
  const https = process.env.npm_package_config_devserver_https === 'true';
  const baseUrl = `${https ? 'https' : 'http'}://${host}:${port}`;

  const overrides = {
    output: Object.assign({}, config.output, { publicPath: `${baseUrl}/` }),
    devtool: 'inline-source-map',
    watch: true,
    devServer: {
      host,
      port,
      contentBase: 'src/www',
      hot: true,
      open: false,
      https,
      cert: fs.readFileSync(path.resolve(devDir, 'star_cfl_io.crt')),
      ca: fs.readFileSync(path.resolve(devDir, 'digicert.pem')),
      key: fs.readFileSync(path.resolve(devDir, 'star_cfl_io.key')),
      historyApiFallback: {
        index: url.resolve(config.output.publicPath, 'index.html'),
      },
      // webpack output options
      stats: {
        chunkModules: false,
        assets: false,
      },
    },
  }

  config = Object.assign(config, overrides);
}

function* generatePlugins() {
  if (isProd) {
    // PRODUCTION only
    yield new webpack.DefinePlugin({ 'process.env.NODE_ENV': JSON.stringify('production') });
    yield new webpack.optimize.CommonsChunkPlugin({ name: 'vendors', filename: 'vendors.[hash].js' }),
      yield new webpack.optimize.UglifyJsPlugin({
        exclude: /app\..*\.js/,
        compress: {
          warnings: false
        },
      });
    yield new webpack.optimize.UglifyJsPlugin({
      exclude: /vendors\..*\.js/,
      compress: {
        warnings: true,
        unused: true,
        dead_code: true,
      },
    });
    yield new LicenseWebpackPlugin({
      pattern: /^(.*)$/,
      filename: '../www/LICENSING.TXT',
      includeUndefined: true,
    });
  }
  else if (isDev) {
    // DEV only
    yield new webpack.HotModuleReplacementPlugin();
    yield new awesomeTypescriptLoader.CheckerPlugin();
    yield new webpack.NoEmitOnErrorsPlugin();
  }

  yield new TransferWebpackPlugin([{ from: 'src/www' }]);
  yield extractCssPlugin;
  yield new HtmlWebpackPlugin({
    template: 'src/index.ejs',
    appVersion: `${require('./package.json').version}`,
    favicon: 'src/www/app-logo.ico',
  });
}

module.exports = config;
