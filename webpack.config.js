const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['babel-polyfill', './client/src/app/index.jsx'],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  resolve: {
    modules: [
      path.resolve(__dirname, 'client', 'src'),
      'tests',
      'node_modules'
    ],
    extensions: ['.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.(jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['babel-plugin-jsx-remove-data-test-id']
          }
        }
      },
      {
        test: /\.s?css$/,
        use: [
          'style-loader', // creates style nodes from JS strings
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.(png|jpg)$/,
        use: 'file-loader'
      }
    ]
  },
  devServer: {
    port: 3000,
    open: true,
    inline: true,
    hot: true,
    disableHostCheck: true,
    proxy: {
      '/api': 'http://localhost:8080',
      '/auth': 'http://localhost:8080'
    },
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './client/public/index.html'
    })
  ]
};
