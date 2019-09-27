const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: './src/index.ts',
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    library: 'flaph',
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
      {
        test: /\.pegjs$/,
        use: 'pegjs-loader?trace=true&cache=true',
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.pegjs']
  },
  externals: {
    'react': 'react',
    'react-dom': 'react-dom'
  },
  plugins: [
    // new BundleAnalyzerPlugin()
  ]
};