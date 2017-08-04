var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool:'source-map',
  entry:{
    bundle:'./src/index.js',
  },
  output:{
    filename:'[name].js',
    path:path.resolve(__dirname,'dist'),
    publicPath: '/'
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:['babel-loader']
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },
      {
        test:/\.less$/,
        use:['style-loader','css-loader','less-loader']
      },
      {
        test:/\.(png|svg|jpg|gif)$/,
        use:['file-loader']
      },
      {
        test:/\.(woff|woff2|eot|ttf|otf)$/,
        use:['file-loader']
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 启用 HMR
  ],
  devServer:{
    hot:true,
    compress: true,
    contentBase:path.resolve(__dirname),
    publicPath:'/'
  }
}