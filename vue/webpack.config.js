const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');

module.exports = {
  devtool: process.env.NODE_ENV === 'development' ? 'inline-source-map' : false,
  entry: './src/index.ts',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/dist'),
    publicPath: 'dist'
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: 'babel-loader'
      },
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/]
          }
        },
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.vue$/,
        use: [
          'vue-loader'
        ]
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.vue', '.js'],
    symlinks: false
  },
  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  },
  plugins: [
    new VueLoaderPlugin()
  ]
};