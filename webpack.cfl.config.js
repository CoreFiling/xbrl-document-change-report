const path = require('path');
const merge = require('webpack-merge');
const fs = require('fs');

const mainConfig = require('./webpack.config');
const oauthToken = require('./.dev/oauth-token');

const plugins = mainConfig.plugins;
mainConfig.plugins = [];

const devDir = path.resolve(__dirname, '.dev');

const host = process.env.npm_package_config_devserver_host;
const port = parseInt(process.env.npm_package_config_devserver_port, 10);
const https = process.env.npm_package_config_devserver_https === 'true';
const baseUrl = `${https ? 'https' : 'http'}://${host}:${port}`;
const apiProxyUrl = process.env.npm_package_config_api_proxy;

const proxyHeaders = {};
oauthToken.load(token => proxyHeaders['Authorization'] = `Bearer ${token.access_token}`);

let isLoggedIn = true;

const mergedConfig = merge.smart(mainConfig, {
  output: {
    publicPath: `${baseUrl}/xbrl-document-change-report/`,
  },
  devtool: 'inline-source-map',
  watch: true,
  plugins: plugins,
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
      index: `${mainConfig.output.publicPath}/index.html`,
    },
    proxy: {
      '/api/user': {
        // logLevel: 'debug',
        target: oauthToken.BASE_HOST,
        changeOrigin: true,
        pathRewrite: {
          '^/api/user': oauthToken.USER_PATH,
        },
        headers: proxyHeaders,
        onProxyReq: (proxyReq) => {
          proxyReq.setHeader('Authorization', isLoggedIn ? proxyHeaders['Authorization'] : 'Bearer invalid');
        },
      },
      '/api/': {
        // logLevel: 'debug',
        target: apiProxyUrl,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
        headers: proxyHeaders,
        onProxyRes: (proxyRes) => {
          proxyRes.headers['x-frame-options'] = 'SAMEORIGIN'
        },
        onProxyReq: (proxyReq) => {
          proxyReq.setHeader('Authorization', isLoggedIn ? proxyHeaders['Authorization'] : 'Bearer invalid');
        },
      },
    },
    setup: function (app) {
      app.get('/auth/logout', (req, res) => {
        isLoggedIn = false;
        res.send('<p>Logged Out. Visit <a href="/auth/login">/auth/login</a> to login.</p>');
      });
      app.get('/auth/login', (req, res) => {
        isLoggedIn = true;
        res.send('<p>Logged In. Visit <a href="/auth/logout">/auth/logout</a> to logout.</p>');
      });
      app.get('/api/apps', (req, res) => {
        res.json([
          {"id":"xbrl-document-change-report","name":"XBRL Document Change Report","href":"/xbrl-document-change-report/","colour":"#69BEAB","iconHref":"/img/logo-beacon.svg","features":[]},
          {"id":"beacon","name":"Beacon","href":"/beacon/","colour":"#3c7c34","iconHref":"/img/logo-beacon.svg","features":[]},
          {"id":"account","name":"Manage account","href":"/auth/account","colour":"#3A75C4","features":[]},
          {"id":"sms","name":"Manage organisation","href":"/sms/","colour":"#3A75C4","features":[]},
        ]);
      });
      app.get('/', (req, res) => {
        res.redirect('/xbrl-document-change-report/');
      });
    },
    // webpack output options
    stats: {
      // hide all chunk dependencies because it's unreadable
      chunkModules: false,
      // noize
      assets: false,
    },
  },
});

// Edit linting config
mergedConfig.module.rules[0].options = Object.assign({}, mergedConfig.module.rules[0].options, {emitErrors: false});

module.exports = mergedConfig;
