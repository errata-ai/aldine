var path = require('path');
var webpack = require('webpack');
var postcssAssets = require('postcss-assets');
var postcssNext = require('postcss-cssnext');
var stylelint = require('stylelint');
var ManifestPlugin = require('webpack-manifest-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  bail: true,

  resolve: {
    root: path.resolve(__dirname),
    extensions: ['', '.ts', '.tsx', '.js', '.jsx']
  },

  entry: {
    app: './src/client.tsx',
    vendor: [
      './src/vendor/main.ts',
      'react',
      'react-dom',
      'react-router',
      'react-helmet',
      'react-redux',
      'react-router-redux',
      'redux',
      'redux-connect',
      'redux-thunk'
    ]
  },

  output: {
    path: path.resolve('./build/public'),
    publicPath: '/public/',
    filename: 'js/[name].[chunkhash].js'
  },

  module: {
    preLoaders: [
      {
        test: /\.tsx?$/,
        loader: 'tslint'
      }
    ],
    loaders: require('./loaders/prod'),
  },

  postcss: function () {
    return [
      stylelint({ files: '../../src/app/*.css' }),
      postcssNext(),
      postcssAssets({ relative: true })
    ];
  },

  tslint: {
    failOnHint: true
  },

  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'js/[name].[chunkhash].js',
      minChunks: Infinity
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new ExtractTextPlugin('css/[name].[hash].css'),
    new ManifestPlugin({
      fileName: '../manifest.json'
    }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('production')
      }
    })
  ]
};

module.exports = config;
