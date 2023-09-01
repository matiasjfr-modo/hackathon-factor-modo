const path = require("path");

module.exports = {
  devtool: "source-map",
  mode: "development",
  entry: ["babel-polyfill", "./src/BasicComponent.js"],
  output: {
    libraryTarget: "this",
    filename: "./bundle.js",
    path: path.resolve(__dirname, "build"),
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [
            "@babel/preset-env",
            "@babel/preset-react",
            { plugins: ["@babel/plugin-proposal-class-properties"] },
          ],
        },
      },
    ],
  },
  optimization: {
    minimize: false,
  },
  resolve: {
    extensions: [".webpack.js", ".js", "ts"]
  },
};
