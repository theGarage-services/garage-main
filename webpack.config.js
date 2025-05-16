const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output bundle file
    clean: true, // Clean the output directory before each build
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Apply this rule to .js and .jsx files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'], // Use Babel presets
          },
        },
      },
      {
        test: /\.css$/, // Apply this rule to .css files
        use: ['style-loader', 'css-loader'], // Use style-loader and css-loader
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Resolve these extensions
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template HTML file
      favicon: './public/favicon.ico', // Optional favicon
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'), // Serve static files from the dist directory
    compress: true, // Enable gzip compression for everything served
    port: 3000, // Port number for the dev server
    hot: true, // Enable hot module replacement (HMR)
    open: true, // Open the browser after server is started
  },
  mode: 'development', // Set the mode to development or production as needed
};