module.exports = {
  devtool: "source-map",
  mode: "development",
  watch: true,
  entry: [
    "babel-polyfill",
    "./src/BasicComponent.js"
  ],
  output: {
    libraryTarget: "this",
    filename: "./bundle.js",
    path: __dirname + "/build"
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
            {"plugins": ["@babel/plugin-proposal-class-properties"]}
          ]
        }
      }
    ]
  },
  resolve: {
    extensions: [".webpack.js", ".js"]
  }
};
