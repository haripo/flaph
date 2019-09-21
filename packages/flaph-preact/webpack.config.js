const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    library: 'flaph-preact',
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
    symlinks: false
  },
  externals: {
    'preact': 'preact',
    'preact/compat': 'preact/compat'
  }
};