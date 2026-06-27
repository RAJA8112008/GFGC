const path = require("path");

module.exports = {
  mode: "development",
  devtool: false,
  entry: {
    popup: "./src/popup/PopupEntry.jsx",
    background: "./src/background/background.js",
    content: "./src/content/gfgDetector.js",
    mainWorld: "./src/content/mainWorld.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"]
          }
        }
      }
    ]
  }
};