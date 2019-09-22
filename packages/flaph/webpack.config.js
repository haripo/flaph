const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    library: 'flaph',
    libraryTarget: 'commonjs2'
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
      {
        test: /\.pegjs$/,
        use: 'pegjs-loader?trace=true&cache=true',
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.pegjs'],
    alias: {
      'react': 'preact/compat',
      'react-dom/test-utils': 'preact/test-utils',
      'react-dom': 'preact/compat'
    }
  }
};