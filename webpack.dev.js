const { merge } = require('webpack-merge')
const path = require('path');
const common = require('./webpack.common.js')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = merge(common,{ 
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    historyApiFallback: true,
    hot: true,
  },
  plugins: [
    new BundleAnalyzerPlugin({generateStatsFile:true})
  ]
})
