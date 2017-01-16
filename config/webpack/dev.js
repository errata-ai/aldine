const path = require('path');
const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const merge = require('webpack-merge');
const rootDir = path.resolve('./src');

const config = {
  devtool: 'eval',

  debug: true,

  entry: {
    app: [
      'webpack-hot-middleware/client?reload=true',
      './src/client.tsx',
      './src/vendor/main.ts'
    ]
  },

  postcss: function () {
    return [
      require('postcss-import')({
        addDependencyTo: webpack,
        path: [
          rootDir,
          path.join(rootDir, 'node_modules'),
        ],
      }),
      require('stylelint')({ files: '../../src/app/*.css' }),
      require('postcss-cssnext')(),
      require('postcss-assets')({ relative: '../../src/app' })
    ];
  },

  output: {
    path: path.resolve('./build/public'),
    publicPath: '/public/',
    filename: 'js/[name].js',
    pathinfo: true
  },

  tslint: {
    failOnHint: true
  },

  plugins: [
    new ManifestPlugin({ fileName: '../manifest.json' }),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = require('webpack-merge')(
  config,
  require('./partials/aliases'),
  require('./partials/loaders-dev')
);
