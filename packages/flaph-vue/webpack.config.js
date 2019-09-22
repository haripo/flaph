const path = require('path');

module.exports = {
  entry: './src/index.js',
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    library: 'flaph-vue',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader'
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat'
    },
    symlinks: false
  },
  externals: {
    'vue': 'vue'
  }
};