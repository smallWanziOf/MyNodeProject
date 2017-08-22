var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  devtool:'source-map',
  entry:{
    bundle:'./src/index.js',
    //vendor:'moment'
  },
  output:{
    filename:'[name].js',
    path:path.resolve(__dirname, 'dist'),
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:['babel-loader']
      },
      {
        test:/\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader"
        })
      },
      {
        test:/\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            // 通过 loader 参数激活 source maps
            {
              loader: 'css-loader',
              options: { sourceMap: true, importLoaders: 1 }
            },
            {
              loader: 'less-loader',
              options: { sourceMap: true }
            }
          ]
        })
      },
      {
        test:/\.(png|svg|jpg|gif)$/,
        use:['file-loader?name=[name].[ext]&outputPath=images/']
      },
      {
        test:/\.(woff|woff2|eot|ttf|otf)$/,
        use:['file-loader?name=[name].[ext]&outputPath=font/']
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("style.css"),
    new UglifyJSPlugin({
      compress: {
        warnings: false,
        drop_console:true,
        pure_funcs:['console.log']
      },
      sourceMap:false
    }),
    new webpack.DefinePlugin({
      'process.env': {
          NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
}