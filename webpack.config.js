const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackPwaManifest = require('webpack-pwa-manifest');

module.exports = {
  mode: 'development',
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
          'style-loader',
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                includePaths: ['./client/src/app/styles']
              }
            }
          }
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
      '/auth': 'http://localhost:8080',
      '/socket.io': { target: 'http://localhost:8080', ws: true }
    },
    watchOptions: {
      ignored: /node_modules/
    },
    historyApiFallback: true
  },
  plugins: [
    new CleanWebpackPlugin({ verbose: true }),
    new HtmlWebpackPlugin({
      favicon: './client/public/favicon/favicon.ico',
      template: './client/public/index.html'
    }),
    new WebpackPwaManifest({
      background_color: '#ffffff',
      display: 'standalone',
      fingerprints: false,
      icons: [
        {
          sizes: '72x72',
          src: path.resolve('./client/public/favicon/android-chrome-72x72.png'),
          type: 'image/png'
        },
        {
          sizes: '16x16',
          src: path.resolve('./client/public/favicon/favicon-16x16.png'),
          type: 'image/png'
        },
        {
          sizes: '32x32',
          src: path.resolve('./client/public/favicon/favicon-32x32.png'),
          type: 'image/png'
        },
        {
          sizes: '150x150',
          src: path.resolve('./client/public/favicon/mstile-150x150.png'),
          type: 'image/png'
        },
        {
          ios: true,
          sizes: '72x72',
          src: path.resolve('./client/public/favicon/apple-touch-icon.png'),
          type: 'image/png'
        }
      ],
      name: 'End of coffee',
      short_name: 'EOC',
      theme_color: '#ffffff'
    })
  ]
};
